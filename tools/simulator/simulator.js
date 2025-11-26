// simulator.js
// Simple 1v1 Monte Carlo simulator for Legends of the Spire
// Outputs: results.json (winrates), ev_builds.json, mge.json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = minimist(process.argv.slice(2));
const rounds = parseInt(args.rounds || args.r || '500'); // per pairing
const outFile = args.out || 'results.json';

// Adjust relative paths if needed
// We are in tools/simulator/simulator.js
// Data is in ../../src/data/
import { CARD_DATABASE } from '../../src/data/cards.js';
import { CHAMPION_POOL } from '../../src/data/champions.js';

const CARD_DB = CARD_DATABASE;
const CHAMPS = CHAMPION_POOL;

// Utilities
function deepClone(o) { return JSON.parse(JSON.stringify(o)); }
function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

// Basic player state builder: deck is list of card ids
function buildDeckFromInitial(champId) {
    const champ = CHAMPS[champId];
    if (!champ) throw new Error('Champion not found: ' + champId);
    // Start with champion initialCards and fill to 20 with neutral basic attacks/blocks
    let deck = champ.initialCards.slice();

    // Fallback fillers
    const fillerAttack = CARD_DB['Neutral_001'] ? 'Neutral_001' : (CARD_DB['Strike'] ? 'Strike' : null);
    const fillerBlock = CARD_DB['Neutral_041'] ? 'Neutral_041' : (CARD_DB['Defend'] ? 'Defend' : null);

    while (deck.length < 20) {
        if (fillerAttack) deck.push(fillerAttack);
        if (deck.length < 20 && fillerBlock) deck.push(fillerBlock);
        if (!fillerAttack && !fillerBlock) break;
    }
    return shuffle(deck.slice());
}

// Simple evaluation of a card's damage to a target given player state
function resolveAttack(card, player, target) {
    let dmg = card.value || 0;

    // Add player's strength
    dmg += (player.str || 0);

    // Apply Weak (Player deals 75% dmg)
    if (player.weak && player.weak > 0) {
        dmg = Math.floor(dmg * 0.75);
    }

    // Check Vulnerable (Target takes 50% more)
    if (target.vuln && target.vuln > 0) {
        dmg = Math.floor(dmg * 1.5);
    }

    // EXECUTE effects
    if (card.effect && card.effect.includes('EXECUTE')) {
        // Simple execute simulation: if target HP < 50%, deal 50% more
        if (target.hp < target.maxHp * 0.5) {
            dmg = Math.floor(dmg * 1.5);
        }
        // GarenR: EXECUTE_SCALE
        if (card.effect === 'EXECUTE_SCALE') {
            const missingHp = target.maxHp - target.hp;
            dmg += Math.floor(missingHp * 0.5);
        }
    }

    // Simulate block
    const effective = Math.max(0, dmg - (target.block || 0));
    target.block = Math.max(0, (target.block || 0) - dmg);
    target.hp -= effective;

    // Handle effects
    if (card.effect === 'BLEED' || card.effect === 'BLEED_VULN' || card.effect === 'BLEED_EXECUTE') {
        target.bleed = (target.bleed || 0) + (card.effectValue || 0);
    }
    if (card.effect === 'POISON') {
        target.poison = (target.poison || 0) + (card.effectValue || 0);
    }
    if (card.effect === 'VULNERABLE' || card.effect === 'BLEED_VULN' || card.effect === 'WEAK_VULN_AND_PERMAHP') {
        target.vuln = (target.vuln || 0) + (card.effectValue || 0);
    }
    if (card.effect === 'WEAK' || card.effect === 'BLEED_VULN' || card.effect === 'WEAK_VULN_AND_PERMAHP') {
        target.weak = (target.weak || 0) + (card.effectValue || 0); // Apply weak to target
    }
    if (card.effect === 'LIFESTEAL') {
        player.hp = Math.min(player.maxHp, player.hp + (card.effectValue || 0));
    }
    if (card.effect === 'MARK') {
        target.mark = (target.mark || 0) + (card.effectValue || 0);
    }
    if (card.effect === 'BLIND') {
        target.weak = (target.weak || 0) + (card.effectValue || 0); // Sim blind as weak
    }
    return effective;
}

// resolve skill simple: block/heal/draw/temp mana effects
function resolveSkill(card, player) {
    if (card.effect === 'DRAW' || card.effect === 'DRAW_NEXT') {
        draw(player, card.effectValue || 1);
    }
    if (card.effect === 'HEAL') {
        player.hp = Math.min(player.maxHp, player.hp + (card.effectValue || card.value || 0));
    }
    if (card.effect === 'TEMP_MANA' || card.effect === 'GAIN_MANA') {
        player.mana += (card.effectValue || 1);
    }
    if (card.effect === 'CLEANSE') {
        player.vuln = 0;
        player.weak = 0;
        player.bleed = 0;
        player.poison = 0;
    }

    // Block handling
    let blockVal = 0;
    if (card.type === 'SKILL' && card.value) blockVal = card.value;
    // Some skills have block in effectValue if not HEAL/DRAW specific? 
    // For now rely on card.value for block on Skills as per DB convention

    player.block = (player.block || 0) + blockVal;
}

// draw function
function draw(player, n) {
    for (let i = 0; i < n; i++) {
        if (player.deck.length === 0) {
            // reshuffle discard
            player.deck = shuffle(player.discard.splice(0));
        }
        if (player.deck.length === 0) break;
        player.hand.push(player.deck.shift());
    }
}

// naive policy: play all 0-cost, then play highest damage-per-cost attack first
function policy_playBestDamagePerCost(player, opponent) {
    // play 0 cost first
    let played = [];
    // sort by cost ascending then damage per cost descending
    const handSorted = player.hand.slice().sort((aId, bId) => {
        const a = CARD_DB[aId];
        const b = CARD_DB[bId];
        if (!a || !b) return 0;

        const ca = a.cost; const cb = b.cost;
        if (ca !== cb) return ca - cb;
        const da = (a.type === 'ATTACK' ? (a.value + (player.str || 0)) / Math.max(1, a.cost) : 0);
        const db = (b.type === 'ATTACK' ? (b.value + (player.str || 0)) / Math.max(1, b.cost) : 0);
        return db - da;
    });

    for (const cId of handSorted) {
        const c = CARD_DB[cId];
        if (!c) continue;

        if (c.cost <= player.mana) {
            player.mana -= c.cost;
            played.push(cId);
            if (c.type === 'ATTACK') resolveAttack(c, player, opponent);
            else resolveSkill(c, player);
        }
    }
    // discard played
    player.discard.push(...played);
    player.hand = player.hand.filter(h => !played.includes(h));
}

// simulate a single match with simplified loop
function simulateSingleMatch(champA, champB, rounds = 1) {
    let aWins = 0;
    for (let r = 0; r < rounds; r++) {
        // build player states
        const deckA = buildDeckFromInitial(champA);
        const deckB = buildDeckFromInitial(champB);
        const A = { id: champA, hp: CHAMPS[champA].maxHp, maxHp: CHAMPS[champA].maxHp, mana: CHAMPS[champA].maxMana, str: CHAMPS[champA].baseStr, deck: deckA.slice(), hand: [], discard: [], block: 0, vuln: 0, mark: 0 };
        const B = { id: champB, hp: CHAMPS[champB].maxHp, maxHp: CHAMPS[champB].maxHp, mana: CHAMPS[champB].maxMana, str: CHAMPS[champB].baseStr, deck: deckB.slice(), hand: [], discard: [], block: 0, vuln: 0, mark: 0 };
        // initial draws
        draw(A, 5); draw(B, 5);
        let turn = 0;
        const maxTurns = 60;
        while (A.hp > 0 && B.hp > 0 && turn < maxTurns) {
            // A turn
            A.mana = 3;
            A.block = 0; // Reset block at start of turn (simplified)
            policy_playBestDamagePerCost(A, B);
            draw(A, 1); // Draw for next turn
            if (B.hp <= 0) break;

            // B turn
            B.mana = 3;
            B.block = 0;
            policy_playBestDamagePerCost(B, A);
            draw(B, 1);
            turn++;
        }
        if (B.hp <= 0 && A.hp > 0) aWins++;
    }
    return aWins / rounds;
}

// build list of champions
const champIds = Object.keys(CHAMPS);

// compute 20x20 matrix
async function runAllSimulations(roundsPerPair = rounds) {
    const res = {};
    console.log(`Starting simulation with ${roundsPerPair} rounds per pairing...`);
    for (let i = 0; i < champIds.length; i++) {
        const a = champIds[i];
        res[a] = {};
        for (let j = 0; j < champIds.length; j++) {
            const b = champIds[j];
            // simulate roundsPerPair matches
            const winRate = simulateSingleMatch(a, b, roundsPerPair);
            res[a][b] = winRate;
            // console.log(`${a} vs ${b} => ${winRate}`);
        }
        console.log(`Finished ${a}`);
    }
    fs.writeFileSync(outFile, JSON.stringify(res, null, 2));
    console.log(`Wrote ${outFile}`);
}

(async () => {
    await runAllSimulations(rounds);
})();
