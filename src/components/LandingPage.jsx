import React from 'react';
import { Book, Activity, Brain } from 'lucide-react';

const Card = ({ title, icon: Icon, onClick, index, total }) => {
    // Calculate rotation and position based on index
    // For 3 cards: index 0 (left), 1 (center), 2 (right)
    // Center is index 1
    const centerIndex = (total - 1) / 2;
    const offset = index - centerIndex; // -1, 0, 1

    // Base rotation: -15deg, 0deg, 15deg
    const baseRotate = offset * 15;
    // Hover rotation: -25deg, 0deg, 25deg
    const hoverRotate = offset * 25;

    // Base translation X: -40px, 0px, 40px (overlap)
    const baseTranslateX = offset * 40;
    // Hover translation X: -120px, 0px, 120px (expand)
    const hoverTranslateX = offset * 140;

    // Base translation Y: slightly down for outer cards to form arc
    const baseTranslateY = Math.abs(offset) * 20;

    return (
        <div
            onClick={onClick}
            className="absolute top-0 left-0 w-64 h-96 transition-all duration-500 ease-out cursor-pointer group/card origin-bottom"
            style={{
                // We use CSS variables to handle the hover state via the parent group
                '--base-rotate': `${baseRotate}deg`,
                '--hover-rotate': `${hoverRotate}deg`,
                '--base-x': `${baseTranslateX}px`,
                '--hover-x': `${hoverTranslateX}px`,
                '--base-y': `${baseTranslateY}px`,
                zIndex: 10 - Math.abs(offset), // Center card on top
                transform: `translateX(var(--base-x)) translateY(var(--base-y)) rotate(var(--base-rotate))`,
            }}
        >
            {/* Card Content */}
            <div className={`
        w-full h-full bg-matte-black border border-neon-white/20 rounded-3xl
        flex flex-col items-center justify-center gap-6
        transition-all duration-500
        group-hover/fan:translate-x-[var(--hover-x)]
        group-hover/fan:rotate-[var(--hover-rotate)]
        group-hover/fan:translate-y-0
        hover:!scale-110 hover:!z-20 hover:border-neon-white hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]
        relative overflow-hidden
      `}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neon-white/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                <div className="p-4 rounded-full border border-neon-white/30 group-hover/card:scale-110 group-hover/card:border-neon-white transition-all duration-500 bg-dark-gray/50">
                    <Icon className="w-12 h-12 text-neon-white" />
                </div>

                <h3 className="text-2xl font-bold text-neon-white tracking-widest uppercase group-hover/card:text-shadow-neon transition-all text-center">
                    {title}
                </h3>

                <div className="absolute bottom-8 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 text-xs tracking-[0.2em] text-gray-400">
                    CLICK TO OPEN
                </div>
            </div>
        </div>
    );
};

const LandingPage = ({ onNavigate }) => {
    const cards = [
        { id: 'journal', title: 'Journal', icon: Book },
        { id: 'mood', title: 'Mood Analyzer', icon: Activity },
        { id: 'journal-analysis', title: 'AI Insights', icon: Brain },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-20 relative z-20">
            <h1 className="text-5xl md:text-7xl font-bold text-neon-white mb-24 tracking-tighter animate-fade-in drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] relative z-20">
                NEURACARE
            </h1>

            {/* Fan Container */}
            <div className="relative w-64 h-96 group/fan perspective-1000 mb-20">
                {cards.map((card, index) => (
                    <Card
                        key={card.id}
                        {...card}
                        index={index}
                        total={cards.length}
                        onClick={() => onNavigate(card.id)}
                    />
                ))}
            </div>


        </div>
    );
};

export default LandingPage;
