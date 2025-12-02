import React from 'react';
import { motion } from 'framer-motion';
import { X, Award } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { achievementTracker } from '../utils/achievementTracker';

const AchievementPanel = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[250] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-3xl max-h-[85vh] bg-[#070E1A] border border-cyan-400/40 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.35)] overflow-hidden flex flex-col"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-cyan-900/10">
                    <div className="flex items-center gap-3 text-cyan-100">
                        <Award className="w-6 h-6" />
                        <div>
                            <p className="text-lg font-bold tracking-[0.35em]">成就系统</p>
                            <p className="text-xs text-cyan-200/70 tracking-widest">S1 · Tracking Core</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/30 text-cyan-100 transition"
                        aria-label="关闭成就面板"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {ACHIEVEMENTS.map((achievement) => {
                        const unlocked = achievementTracker.isUnlocked(achievement.id);
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

