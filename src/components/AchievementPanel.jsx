import React from 'react';
import { motion } from 'framer-motion';
import { X, Award, ToggleLeft, ToggleRight } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { achievementTracker } from '../utils/achievementTracker';
import AchievementProgressSummary from './AchievementProgressSummary';

const AchievementPanel = ({ onClose, enabled, onToggle, unlockedSnapshot }) => {
    const unlockedIds = unlockedSnapshot || achievementTracker.getUnlocked();

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[250] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="w-full max-w-3xl max-h-[85vh] bg-[#070E1A] border border-cyan-400/40 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.35)] overflow-hidden flex flex-col"
            >
                <div className="flex flex-col gap-3 px-6 py-4 border-b border-cyan-500/20 bg-cyan-900/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-cyan-100">
                            <Award className="w-6 h-6" />
                            <div>
                                <p className="text-lg font-bold tracking-[0.35em]">成就系统</p>
                                <p className="text-xs text-cyan-200/70 tracking-widest">S1 · Tracking Core</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full transition ${enabled ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'}`}>
                                {enabled ? '运营已启用' : '运营已关闭'}
                            </span>
                            <button
                                onClick={onToggle}
                                className="p-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                                aria-label="切换成就状态"
                            >
                                {enabled ? <ToggleLeft size={18} /> : <ToggleRight size={18} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/30 text-cyan-100 transition"
                                aria-label="关闭成就面板"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                    <AchievementProgressSummary unlocked={unlockedIds} />
                </div>
                {!enabled && (
                    <div className="px-6 py-3 border-b border-cyan-500/10 bg-red-500/10 text-red-200 text-sm">
                        当前运营配置已关闭成就功能，暂不记录或触发新的成就。开关位于右上角。
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {ACHIEVEMENTS.map((achievement) => {
                        const unlocked = achievementTracker.isUnlocked(achievement.id);
                        const isNewThisRun = achievementTracker.wasUnlockedThisRun(achievement.id);
                        return (
                            <div
                                key={achievement.id}
                                className={`border rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                                    unlocked
                                        ? 'border-cyan-400/70 bg-cyan-500/5'
                                        : 'border-slate-700 bg-slate-900/40'
                                }`}
                            >
                                <div>
                                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{achievement.category}</p>
                                    <p className="text-lg text-white font-semibold">{achievement.name}</p>
                                    <p className="text-sm text-slate-300">{achievement.description}</p>
                                    {unlocked && isNewThisRun && (
                                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">
                                            <Award className="w-3 h-3" />
                                            本局新解锁
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col items-end text-sm text-slate-300">
                                    <span className="text-xs text-slate-400">难度</span>
                                    <span className="text-base font-bold text-cyan-300">{achievement.difficulty}</span>
                                    <span className={`mt-2 text-xs px-2 py-0.5 rounded-full ${unlocked ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-700 text-slate-300'}`}>
                                        {unlocked ? '已解锁' : '未完成'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default AchievementPanel;

