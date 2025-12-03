import React from 'react';
import { achievementTracker } from '../utils/achievementTracker';

const makeHandler = (fn) => () => {
    fn();
};

const AchievementDevPanel = () => {
    if (process.env.NODE_ENV === 'production') return null;

    const fillChest = () => {
        for (let i = 0; i < 15; i++) {
            achievementTracker.recordChestOpen();
        }
    };
    const fillEvents = () => {
        for (let i = 0; i < 12; i++) {
            achievementTracker.recordEventVisit();
        }
    };
    const visitNodes = () => {
        for (let i = 0; i < 25; i++) {
            achievementTracker.recordNodeVisit();
        }
    };
    const speedRun = () => achievementTracker.updateRunDuration(9);
    const noRelicRun = () => achievementTracker.setBattleFlag('noRelicRun', true);
    const resetRun = () => achievementTracker.startRun({ type: 'dev' });

    return (
        <div className="fixed bottom-6 right-6 z-[270] bg-black/50 border border-cyan-500/40 rounded-2xl p-4 space-y-2 text-xs text-white hidden lg:flex flex-col">
            <div className="text-cyan-200 uppercase tracking-[0.4em] text-[10px] mb-1">DEV 成就检验</div>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={fillChest} className="px-2 py-1 rounded bg-slate-800 border border-slate-600 hover:bg-slate-700">15 宝箱</button>
                <button onClick={fillEvents} className="px-2 py-1 rounded bg-slate-800 border border-slate-600 hover:bg-slate-700">12 事件</button>
                <button onClick={visitNodes} className="px-2 py-1 rounded bg-slate-800 border border-slate-600 hover:bg-slate-700">25 节点</button>
                <button onClick={speedRun} className="px-2 py-1 rounded bg-slate-800 border border-slate-600 hover:bg-slate-700">9 分速通</button>
                <button onClick={noRelicRun} className="px-2 py-1 rounded bg-slate-800 border border-slate-600 hover:bg-slate-700">无遗物</button>
                <button onClick={resetRun} className="px-2 py-1 rounded bg-red-600 border border-red-500 hover:bg-red-500">重置 Run</button>
            </div>
        </div>
    );
};

export default AchievementDevPanel;

