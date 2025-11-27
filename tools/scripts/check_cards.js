import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to cards.js
const cardsPath = path.resolve(__dirname, '../../src/data/cards.js');

async function main() {
    try {
        // Dynamic import of the cards database
        // We need to use the file:// protocol for absolute paths in Windows
        const cardsModule = await import('file://' + cardsPath);
        const CARD_DATABASE = cardsModule.CARD_DATABASE;

        const report = {
            total: 0,
            active: 0,
            inactive: 0,
            cards: {}
        };

        for (const [key, card] of Object.entries(CARD_DATABASE)) {
            report.total++;

            // Determine if active (simple heuristic: has a valid description and not a placeholder name)
            // The user mentioned "Neutral_047" to "Neutral_120" are placeholders.
            // We can check if the ID matches the key, and if it looks like a placeholder.

            let isActive = true;
            let status = 'active';

            // Check for placeholder names or generic descriptions if needed
            // For now, we'll assume all in DB are "technically" active unless we define criteria.
            // But the user asked to "show-inactive". 
            // Let's mark the known placeholder range as inactive for the report.

            if (key.startsWith('Neutral_') && parseInt(key.split('_')[1]) >= 47) {
                isActive = false;
                status = 'inactive_placeholder';
            }

            if (isActive) {
                report.active++;
            } else {
                report.inactive++;
            }

            report.cards[key] = {
                id: card.id,
                name: card.name,
                type: card.type,
                rarity: card.rarity,
                status: status
            };
        }

        const outputPath = path.resolve(__dirname, '../../reports/card_activation.json');
        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

        console.log(`Report generated at ${outputPath}`);
        console.log(`Total: ${report.total}, Active: ${report.active}, Inactive: ${report.inactive}`);

    } catch (error) {
        console.error('Error auditing cards:', error);
        process.exit(1);
    }
}

main();
