import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const cardsPath = path.resolve(__dirname, '../../src/data/cards.js');
const appPath = path.resolve(__dirname, '../../src/App.jsx');
const battleUtilsPath = path.resolve(__dirname, '../../src/utils/battleUtils.js'); // Assuming this exists or logic is in App.jsx

async function main() {
    try {
        // 1. Load Cards
        const cardsModule = await import('file://' + cardsPath);
        const CARD_DATABASE = cardsModule.CARD_DATABASE;

        // 2. Extract Effects from Cards
        const cardEffects = new Set();
        const cardsByEffect = {};
        const cardsWithoutEffect = [];

        for (const [key, card] of Object.entries(CARD_DATABASE)) {
            if (card.effect) {
                cardEffects.add(card.effect);
                if (!cardsByEffect[card.effect]) {
                    cardsByEffect[card.effect] = [];
                }
                cardsByEffect[card.effect].push(key);
            } else {
                cardsWithoutEffect.push(key);
            }
        }

        console.log(`Found ${cardEffects.size} unique effects in ${Object.keys(CARD_DATABASE).length} cards.`);

        // 3. Scan Codebase for Implementation
        // We'll look for string literals matching the effect names in App.jsx
        // This is a heuristic but usually effective for switch cases or if checks.

        let appContent = '';
        if (fs.existsSync(appPath)) {
            appContent += fs.readFileSync(appPath, 'utf-8');
        }
        // Add other files if logic is split
        // For now, App.jsx is the main one based on previous context.

        const implementedEffects = new Set();
        const missingEffects = new Set();

        for (const effect of cardEffects) {
            // Regex to find 'EFFECT_NAME' or "EFFECT_NAME"
            // We want to avoid matching substrings if possible, but effect names are usually unique enough (UPPER_CASE).
            const regex = new RegExp(`['"]${effect}['"]`);
            if (regex.test(appContent)) {
                implementedEffects.add(effect);
            } else {
                missingEffects.add(effect);
            }
        }

        // 4. Generate Report
        const report = {
            summary: {
                total_cards: Object.keys(CARD_DATABASE).length,
                total_unique_effects: cardEffects.size,
                implemented_effects: implementedEffects.size,
                missing_effects: missingEffects.size,
                cards_without_explicit_effect: cardsWithoutEffect.length
            },
            implemented: [],
            missing: [],
            uncategorized_cards: cardsWithoutEffect
        };

        // Fill details
        for (const effect of implementedEffects) {
            report.implemented.push({
                effect: effect,
                count: cardsByEffect[effect].length,
                examples: cardsByEffect[effect].slice(0, 5) // Show first 5 examples
            });
        }

        for (const effect of missingEffects) {
            report.missing.push({
                effect: effect,
                count: cardsByEffect[effect].length,
                examples: cardsByEffect[effect] // Show all for missing
            });
        }

        // Sort for readability
        report.implemented.sort((a, b) => b.count - a.count);
        report.missing.sort((a, b) => b.count - a.count);

        const outputPath = path.resolve(__dirname, '../../reports/effect_audit.json');
        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

        console.log(`Audit complete. Report saved to ${outputPath}`);
        console.log(`Implemented: ${implementedEffects.size}, Missing: ${missingEffects.size}`);

    } catch (error) {
        console.error('Error auditing effects:', error);
        process.exit(1);
    }
}

main();
