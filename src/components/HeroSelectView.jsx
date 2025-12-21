import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_LIST } from '../data/heroSkins';

const HeroSelectView = ({ onChampionSelect, unlockedIds = [], currentUser }) => {
    const [selectedHero, setSelectedHero] = useState(HERO_LIST.find(h => h.id === 'Jhin') || HERO_LIST[0]);
    const [currentSkinIndex, setCurrentSkinIndex] = useState(0);
    const [favoriteHero, setFavoriteHero] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            setFavoriteHero(null);
            return;
        }
        const stored = localStorage.getItem(`favoriteHero_${currentUser.email}`);
        if (stored) setFavoriteHero(stored);
    }, [currentUser]);

    const handleHeroSelect = (hero) => {
        setSelectedHero(hero);
        setCurrentSkinIndex(0); // Reset skin to first when changing hero
    };

    const nextSkin = () => {
        setCurrentSkinIndex((prev) =>
            prev === selectedHero.skins.length - 1 ? 0 : prev + 1
        );
    };

    const prevSkin = () => {
        setCurrentSkinIndex((prev) =>
            prev === 0 ? selectedHero.skins.length - 1 : prev - 1
        );
    };

    const handleLockIn = async () => {
        if (onChampionSelect) {
            try {
                console.log(`[HeroSelect] Locking in hero: ${selectedHero.id}`);
                const { default: CHAMPION_POOL } = await import('../data/champions');
                console.log(`[HeroSelect] Loaded CHAMPION_POOL keys:`, Object.keys(CHAMPION_POOL));

                let championData = CHAMPION_POOL[selectedHero.id];
                console.log(`[HeroSelect] Found champion data for ${selectedHero.id}:`, championData ? 'Yes' : 'No');

                // Inject selected skin data
                const selectedSkin = selectedHero.skins[currentSkinIndex];
                if (championData && selectedSkin) {
                    championData = {
                        ...championData,
                        img: selectedSkin.loadingUrl, // Use skin loading art for battle
                        skinName: selectedSkin.name,
                        splashUrl: selectedSkin.splashUrl
                    };
                }

                if (championData) {
                    onChampionSelect(championData);
                } else {
                    console.error(`Champion data not found for ID: ${selectedHero.id}`);
                    // Fallback
                    onChampionSelect({
                        ...selectedHero,
                        maxHp: 70,
                        maxMana: 3,
                        initialCards: [],
                        img: selectedSkin ? selectedSkin.loadingUrl : selectedHero.skins[0].loadingUrl
                    });
                }
            } catch (error) {
                console.error("Failed to load champion data:", error);
            }
        }
    };

    const handleSetFavorite = () => {
        if (!currentUser) return;
        localStorage.setItem(`favoriteHero_${currentUser.email}`, selectedHero.id);
        setFavoriteHero(selectedHero.id);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent" />

            {/* LEFT PANEL - Hero Splash Art (25%) */}
            <motion.div
                className="w-1/4 relative border-r border-slate-700/50"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedHero.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative h-full"
                    >
                        {/* Splash Art Image */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={selectedHero.skins[currentSkinIndex].loadingUrl}
                                alt={selectedHero.name}
                                className="h-full w-full object-cover object-top"
                            />
                            {/** Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                        </div>

                        {/* Hero Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl font-black text-white mb-2 drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
                            >
                                {selectedHero.name.toUpperCase()}
                            </motion.h2>
                            <p className="text-slate-300 text-sm tracking-wider italic">
                                {selectedHero.title}
                            </p>
                        </div>

                        {/* Border Accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-amber-500 to-transparent" />
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* CENTER PANEL - Hero Grid (35%) */}
            <div className="w-[35%] flex flex-col bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50">
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-amber-400 tracking-widest">SELECT CHAMPION</h3>
                            <p className="text-slate-400 text-sm mt-1">Choose your legend</p>
                        </div>
                        {currentUser && (
                            <div className="flex flex-col items-end text-right">
                                <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">
                                    {`Logged in as ${currentUser.username || currentUser.email}`}
                                </p>
                                {favoriteHero && (
                                    <p className="text-[9px] uppercase tracking-[0.5em] text-amber-300">
                                        {`Favorite: ${favoriteHero}`}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid Container */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="grid grid-cols-5 gap-3">
                        {HERO_LIST.map((hero) => (
                            <motion.button
                                key={hero.id}
                                onClick={() => handleHeroSelect(hero)}
                                whileHover={{ scale: selectedHero.id === hero.id ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedHero.id === hero.id
                                    ? 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] opacity-100'
                                    : 'border-slate-600 hover:border-amber-300/50 opacity-60 hover:opacity-100'
                                    } ${favoriteHero === hero.id ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900' : ''}`}
                            >
                                {/* Avatar Image */}
                                <img
                                    src={hero.avatar}
                                    alt={hero.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Selected Indicator */}
                                {selectedHero.id === hero.id && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 bg-gradient-to-t from-amber-500/30 to-transparent"
                                    />
                                )}

                                {/* Name Label on Hover */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                                    <p className="text-white text-[10px] font-semibold text-center truncate">
                                        {hero.name}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - Skin Viewer (40%) */}
            <div className="w-[40%] flex flex-col bg-slate-900/30 backdrop-blur-sm">
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-cyan-400 tracking-widest">SKIN SELECTION</h3>
                            <p className="text-slate-400 text-sm mt-1">
                                {selectedHero.skins.length} skins available
                            </p>
                        </div>
                        {currentUser && (
                            <button
                                onClick={handleSetFavorite}
                                className="px-3 py-1 text-xs uppercase tracking-[0.3em] border border-cyan-400 text-cyan-200 rounded-full hover:bg-cyan-400 hover:text-black transition"
                            >
                                {favoriteHero === selectedHero.id ? 'Favored' : 'Set Favorite'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Skin Preview */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${selectedHero.id}-${currentSkinIndex}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-2xl"
                        >
                            {/* Skin Card */}
                            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                                {/* Skin Splash Image */}
                                <img
                                    src={selectedHero.skins[currentSkinIndex].splashUrl}
                                    alt={selectedHero.skins[currentSkinIndex].name}
                                    className="w-full aspect-video object-cover"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/30" />

                                {/* Skin Name Badge */}
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-400/30 rounded-lg p-4">
                                        <h4 className="text-2xl font-bold text-cyan-300 mb-1">
                                            {selectedHero.skins[currentSkinIndex].name}
                                        </h4>
                                        <p className="text-slate-400 text-sm">
                                            Skin {currentSkinIndex + 1} of {selectedHero.skins.length}
                                        </p>
                                    </div>
                                </div>

                                {/* Navigation Arrows */}
                                {selectedHero.skins.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevSkin}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-600 flex items-center justify-center transition-all hover:scale-110"
                                        >
                                            <ChevronLeft className="text-white" size={24} />
                                        </button>
                                        <button
                                            onClick={nextSkin}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-600 flex items-center justify-center transition-all hover:scale-110"
                                        >
                                            <ChevronRight className="text-white" size={24} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Lock In Button */}
                <div className="p-6 border-t border-slate-700/50">
                    <motion.button
                        onClick={handleLockIn}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold text-lg tracking-widest rounded-lg shadow-lg transition-all uppercase flex items-center justify-center gap-3"
                    >
                        <Lock size={20} />
                        Lock In
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default HeroSelectView;
