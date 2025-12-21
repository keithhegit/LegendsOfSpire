import React from 'react';
import { motion } from 'framer-motion';
import { INTRO_VIDEO_URL } from '../data/constants';

const IntroVideo = ({ onComplete }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <video
                src={INTRO_VIDEO_URL}
                autoPlay
                playsInline
                onEnded={onComplete}
                className="max-w-full max-h-full object-contain"
            />
            <button
                onClick={onComplete}
                className="absolute bottom-8 right-8 px-6 py-2 bg-amber-500/90 hover:bg-amber-400 text-black font-semibold rounded-lg border border-amber-200 shadow-lg transition"
            >
                跳过片头
            </button>
        </motion.div>
    );
};

export default IntroVideo;

