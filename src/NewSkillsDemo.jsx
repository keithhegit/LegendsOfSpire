import React, { useState } from 'react';
import LoginView from './components/LoginView';
import HeroSelectView from './components/HeroSelectView';

/**
 * New Skills Demo - Demonstrates Login and Hero Selection UI
 * This is a standalone demo to showcase the new UI components
 */
const NewSkillsDemo = () => {
    const [currentView, setCurrentView] = useState('LOGIN'); // 'LOGIN' | 'HERO_SELECT'
    const [selectedHero, setSelectedHero] = useState(null);

    const handleLogin = () => {
        console.log('Login successful!');
        setCurrentView('HERO_SELECT');
    };

    const handleHeroConfirm = (hero) => {
        console.log('Hero selected:', hero);
        setSelectedHero(hero);
        alert(`Locked in: ${hero.name} - ${hero.title}`);
    };

    return (
        <div className="w-full h-screen">
            {currentView === 'LOGIN' && (
                <LoginView onLogin={handleLogin} />
            )}

            {currentView === 'HERO_SELECT' && (
                <HeroSelectView onHeroConfirm={handleHeroConfirm} />
            )}
        </div>
    );
};

export default NewSkillsDemo;
