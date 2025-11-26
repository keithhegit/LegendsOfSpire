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
        <div className="w-[35%] flex flex-col bg-slate-900/50 backdrop-blur-sm">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
                <h3 className="text-2xl font-bold text-amber-400 tracking-widest">SELECT CHAMPION</h3>
                <p className="text-slate-400 text-sm mt-1">Choose your legend</p>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-4 gap-3">
                    {HERO_LIST.map((hero) => (
                        <motion.button
                            key={hero.id}
                            onClick={() => handleHeroSelect(hero)}
                            whileHover={{ scale: selectedHero.id === hero.id ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedHero.id === hero.id
                                ? 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] opacity-100'
                                : 'border-slate-600 hover:border-amber-300/50 opacity-60 hover:opacity-100'
                                }`}
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
                                <p className="text-white text-xs font-semibold text-center truncate">
                                    {hero.name}
                                </p>
                            </div>
                        </motion.button>
                    ))}
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-2xl font-bold text-cyan-400 tracking-widest">SKIN SELECTION</h3>
                        <p className="text-slate-400 text-sm mt-1">
                            {selectedHero.skins.length} skins available
                        </p>
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

                                    {/* Navigation Arrows */}
                                    <button
                                        onClick={prevSkin}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="text-3xl font-black text-white text-center drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]"
                                    >
                                        {selectedHero.skins[currentSkinIndex].name.toUpperCase()}
                                    </motion.h4>
                                </div>
                            </div>

                            {/* Skin Counter */}
                            <div className="mt-4 text-center">
                                <p className="text-slate-400 text-sm tracking-wider">
                                    {currentSkinIndex + 1} / {selectedHero.skins.length}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Skin Thumbnails */}
                <div className="px-6 pb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedHero.skins.map((skin, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSkinIndex(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentSkinIndex === index
                                    ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]'
                                    : 'border-slate-600 hover:border-cyan-300/50 opacity-50 hover:opacity-100'
                                    }`}
                            >
                                <img
                                    src={skin.loadingUrl}
                                    alt={skin.name}
                                    className="w-full h-full object-cover object-top"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        );
};

        export default HeroSelectView;
