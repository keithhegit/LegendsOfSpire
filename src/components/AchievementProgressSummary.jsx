import React, { useMemo } from 'react';
import { ACHIEVEMENTS } from '../data/achievements';

const CATEGORY_ORDER = ['BATTLE', 'BOSS', 'MECH', 'COLLECTION', 'CHALLENGE', 'META', 'HERO', 'DEFAULT'];

const ProgressBar = ({ label, percent }) => (
    <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-slate-400">
            <span>{label}</span>
            <span>{percent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500" style={{ width: `${percent}%` }} />
        </div>
    </div>
);

const AchievementProgressSummary = ({ unlocked = [] }) => {
    const unlockedSet = useMemo(() => new Set(unlocked), [unlocked]);

    const summary = useMemo(() => {
        const map = {};
        ACHIEVEMENTS.forEach(achievement => {
            const category = achievement.category || 'DEFAULT';
            map[category] = map[category] || { total: 0, unlocked: 0 };
            map[category].total += 1;
            if (unlockedSet.has(achievement.id)) {
                map[category].unlocked += 1;
            }
        });
        return CATEGORY_ORDER.filter(cat => map[cat]).map(cat => ({
            category: cat,
            ...map[cat],
            percent: Math.round((map[cat].unlocked / map[cat].total) * 100)
        }));
    }, [unlockedSet]);

    return (
        <div className="space-y-3">
            {summary.map(entry => (
                <ProgressBar
                    key={entry.category}
                    label={`${entry.category} (${entry.unlocked}/${entry.total})`}
                    percent={entry.percent}
                />
            ))}
        </div>
    );
};

export default AchievementProgressSummary;

