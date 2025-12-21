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
                className="absolute bottom-8 right-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/30 transition"
            >
                跳过
            </button>
        </motion.div>
    );
};

export default IntroVideo;

