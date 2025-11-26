// simulator.js
// Simple 1v1 Monte Carlo simulator for Legends of the Spire
// Outputs: results.json (winrates), ev_builds.json, mge.json

const fs = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const rounds = parseInt(args.rounds || args.r || '500'); // per pairing
const outFile = args.out || 'results.json';

// Adjust relative paths if needed
const CARDS_MODULE = require(path.resolve(__dirname,'../../src/data/cards.js'));
const CHAMPS_MODULE = require(path.resolve(__dirname,'../../src/data/champions.js'));
const CARD_DB = CARDS_MODULE.CARD_DATABASE || CARDS_MODULE.default || CARDS_MODULE;
const CHAMPS = CHAMPS_MODULE.CHAMPION_POOL || CHAMPS_MODULE.default || CHAMPS_MODULE;

// Utilities
function deepClone(o){ return JSON.parse(JSON.stringify(o)); }
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

// Basic player state builder: deck is list of card ids
function buildDeckFromInitial(champId){
  const champ = CHAMPS[champId];
  if(!champ) throw new Error('Champion not found: '+champId);
  // Start with champion initialCards and fill to 30 with neutral basic attacks/blocks if available
  let deck = champ.initialCards.slice();
  // fill with neutral common attack/blocks identifiers if present
  const fallbackStrike = Object.values(CARD_DB).find(c=>c.name && /strike/i.test(c.name))?.id;
  const fallbackDefend = Object.values(CARD_DB).find(c=>c.name && /defend/i.test(c.name))?.id;
  while(deck.length < 30){
    if(fallbackStrike) deck.push(fallbackStrike);
    if(deck.length < 30 && fallbackDefend) deck.push(fallbackDefend);
    if(!fallbackStrike && !fallbackDefend) break;
  }
  return shuffle(deck.slice());
}

// Simple evaluation of a card's damage to a target given player state (VERY simplified)
function resolveAttack(card, player, target){
  let dmg = card.value || 0;
  // add player's strength
  dmg += (player.str || 0);
  // check vulnerable
  if(target.vuln && target.vuln > 0) dmg = Math.floor(dmg * 1.5);
  // simulate block
  const effective = Math.max(0, dmg - (target.block || 0));
  target.block = Math.max(0, (target.block||0) - dmg);
  target.hp -= effective;
  // handle simple effects
  if(card.effect === 'BLEED') {
    target.bleed = (target.bleed||0) + (card.effectValue||0);
  }
  if(card.effect === 'POISON'){
    target.poison = (target.poison||0) + (card.effectValue||0);
  }
  if(card.effect === 'VULNERABLE' || card.effect === 'APPLY_VULNERABLE'){
    target.vuln = (target.vuln||0) + (card.effectValue||0);
  }
  if(card.effect === 'LIFESTEAL'){
    player.hp = Math.min(player.maxHp, player.hp + (card.effectValue || 0));
  }
  if(card.effect === 'MARK'){
    target.mark = (target.mark||0) + (card.effectValue||0);
  }
  return effective;
}

// resolve skill simple: block/heal/draw/temp mana effects
function resolveSkill(card, player){
  if(card.effect === 'DRAW'){
    draw(player, card.effectValue||1);
  }
  if(card.effect === 'HEAL'){
    player.hp = Math.min(player.maxHp, player.hp + (card.effectValue || card.value || 0));
  }
  if(card.effect === 'TEMP_MANA' || card.effect === 'GAIN_MANA'){
    player.mana += (card.effectValue||1);
  }
  if(card.type === 'SKILL' && card.value){
    // treat as block if value present
    player.block = (player.block||0) + card.value;
  }
}

// draw function
function draw(player, n){
  for(let i=0;i<n;i++){
    if(player.deck.length === 0){
      // reshuffle discard
      player.deck = shuffle(player.discard.splice(0));
    }
    if(player.deck.length === 0) break;
    player.hand.push(player.deck.shift());
  }
}

// naive policy: play all 0-cost, then play highest damage-per-cost attack first
function policy_playBestDamagePerCost(player, opponent){
  // play 0 cost first
  let played = [];
  // sort by cost ascending then damage per cost descending
  const handSorted = player.hand.slice().sort((a,b)=>{
    const ca = a.cost; const cb = b.cost;
    if(ca !== cb) return ca - cb;
    const da = (a.type==='ATTACK'? (a.value + (player.str||0)) / Math.max(1, a.cost) : 0);
    const db = (b.type==='ATTACK'? (b.value + (player.str||0)) / Math.max(1, b.cost) : 0);
    return db - da;
  });
  for(const c of handSorted){
    if(c.cost <= player.mana){
      player.mana -= c.cost;
      played.push(c);
      if(c.type === 'ATTACK') resolveAttack(c, player, opponent);
      else resolveSkill(c, player);
    }
  }
  // discard played
  player.discard.push(...played);
  player.hand = player.hand.filter(h => !played.includes(h));
}

// simulate a single match with simplified loop
function simulateSingleMatch(champA, champB, rounds=1){
  let aWins = 0;
  for(let r=0;r<rounds;r++){
    // build player states
    const deckA = buildDeckFromInitial(champA);
    const deckB = buildDeckFromInitial(champB);
    const A = { id: champA, hp: CHAMPS[champA].maxHp, maxHp: CHAMPS[champA].maxHp, mana: CHAMPS[champA].maxMana, str: CHAMPS[champA].baseStr, deck: deckA.slice(), hand: [], discard: [], block:0, vuln:0, mark:0 };
    const B = { id: champB, hp: CHAMPS[champB].maxHp, maxHp: CHAMPS[champB].maxHp, mana: CHAMPS[champB].maxMana, str: CHAMPS[champB].baseStr, deck: deckB.slice(), hand: [], discard: [], block:0, vuln:0, mark:0 };
    // initial draws
    draw(A,5); draw(B,5);
    let turn = 0;
    const maxTurns = 60;
    while(A.hp > 0 && B.hp > 0 && turn < maxTurns){
      // A turn
      A.mana = 3;
      policy_playBestDamagePerCost(A,B);
      draw(A,1);
      if(B.hp <= 0) break;
      // B turn
      B.mana = 3;
      policy_playBestDamagePerCost(B,A);
      draw(B,1);
      turn++;
    }
    if(B.hp <= 0 && A.hp > 0) aWins++;
  }
  return aWins / rounds;
}

// build list of champions
const champIds = Object.keys(CHAMPS);

// compute 20x20 matrix
async function runAllSimulations(roundsPerPair = rounds){
  const res = {};
  for(let i=0;i<champIds.length;i++){
    const a = champIds[i];
    res[a] = {};
    for(let j=0;j<champIds.length;j++){
      const b = champIds[j];
      // simulate roundsPerPair matches
      const winRate = simulateSingleMatch(a,b, roundsPerPair);
      res[a][b] = winRate;
      console.log(`${a} vs ${b} => ${winRate}`);
    }
  }
  fs.writeFileSync(outFile, JSON.stringify(res, null, 2));
  console.log(`Wrote ${outFile}`);
}

(async ()=>{
  await runAllSimulations(rounds);
})();
