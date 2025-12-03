import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const rewardLabel = (reward) => {
    if (!reward) return '奖励：待定';
    switch (reward.type) {
        case 'CARD':
            return `卡牌：${reward.ref}`;
        case 'RELIC':
            return `遗物：${reward.ref}`;
        case 'MODE':
            return `模式：${reward.ref}`;
        case 'REWARD':
            return `奖励：${reward.ref}`;
        default:
            return `奖励：${reward.ref}`;
    }
};

const AchievementUnlockBanner = ({ achievement }) => {
    if (!achievement) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-[260] pointer-events-none w-full max-w-md"
            >
                <div className="bg-gradient-to-br from-cyan-500/20 to-slate-900 border border-cyan-400/40 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.45)] px-6 py-5 flex items-center gap-4 text-white">
                    <div className="flex flex-col">
                        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Achievement Unlocked</p>
                        <p className="text-lg font-semibold text-white">{achievement.name}</p>
                        <p className="text-sm text-cyan-100/80">{rewardLabel(achievement.reward)}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/10">
                        <Award className="w-8 h-8 text-emerald-300" />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AchievementUnlockBanner;

