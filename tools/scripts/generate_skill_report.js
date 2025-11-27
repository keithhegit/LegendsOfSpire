import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cardsPath = path.resolve(__dirname, '../../src/data/cards.js');

async function main() {
    try {
        const cardsModule = await import('file://' + cardsPath);
        const CARD_DATABASE = cardsModule.CARD_DATABASE;

        const effects = {};

        // Helper to guess effect meaning from description
        const guessMeaning = (effect, desc) => {
            if (effect === 'GAIN_AGI') return '获得敏捷 (Agility)';
            if (effect === 'CLEANSE') return '净化 (Remove Debuffs)';
            if (effect === 'VULNERABLE') return '易伤 (Vulnerable)';
            if (effect === 'WEAK') return '虚弱 (Weak)';
            if (effect === 'STRENGTH') return '力量 (Strength)';
            if (effect === 'DRAW') return '抽牌 (Draw)';
            if (effect === 'HEAL') return '治疗 (Heal)';
            if (effect === 'BLOCK') return '护甲 (Block)';
            if (effect === 'POISON') return '中毒 (Poison)';
            if (effect === 'MULTI_HIT') return '多段攻击 (Multi-hit)';
            return 'See Description';
        };

        for (const card of Object.values(CARD_DATABASE)) {
            const effect = card.effect || 'NO_EFFECT';
            if (!effects[effect]) {
                effects[effect] = {
                    count: 0,
                    cards: []
                };
            }
            effects[effect].count++;
            effects[effect].cards.push({
                id: card.id,
                name: card.name,
                value: card.effectValue,
                desc: card.description
            });
        }

        let md = '# Card Skills & Effects Inventory\n\n';
        md += '## Summary\n';
        md += `- **Total Unique Effects**: ${Object.keys(effects).length}\n`;
        md += `- **Generated**: ${new Date().toLocaleString()}\n\n`;

        // Sort effects by count (descending)
        const sortedEffects = Object.entries(effects).sort((a, b) => b[1].count - a[1].count);

        md += '## Effect List\n\n';
        md += '| Effect Code | Count | Inferred Meaning | Cards (Name / ID / Value) |\n';
        md += '| :--- | :--- | :--- | :--- |\n';

        for (const [effect, data] of sortedEffects) {
            if (effect === 'NO_EFFECT') continue;

            const firstCard = data.cards[0];
            const meaning = guessMeaning(effect, firstCard.desc);

            const cardList = data.cards.map(c => `**${c.name}** (${c.id}) [v:${c.value}]`).join('<br/>');

            md += `| \`${effect}\` | ${data.count} | ${meaning} | ${cardList} |\n`;
        }

        // No Effect Section
        if (effects['NO_EFFECT']) {
            md += `\n## No Explicit Effect (${effects['NO_EFFECT'].count})\n`;
            md += '| Card Name | ID | Description |\n';
            md += '| :--- | :--- | :--- |\n';
            for (const c of effects['NO_EFFECT'].cards) {
                md += `| ${c.name} | ${c.id} | ${c.description} |\n`;
            }
        }

        const outputPath = path.resolve(__dirname, '../../card_skills.md');
        fs.writeFileSync(outputPath, md);
        console.log(`Report generated at ${outputPath}`);

    } catch (error) {
        console.error(error);
    }
}

main();
