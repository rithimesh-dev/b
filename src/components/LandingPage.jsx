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
    const hoverTranslateX = offset * 160; // Increased spacing

    // Base translation Y: slightly down for outer cards to form arc
    const baseTranslateY = Math.abs(offset) * 30;

    return (
        <div
            onClick={onClick}
            className="absolute top-0 left-0 w-72 h-[28rem] transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1) cursor-pointer group/card origin-bottom"
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
        w-full h-full 
        bg-matte-black/40 backdrop-blur-xl 
        border border-white/10 
        rounded-[2rem]
        flex flex-col items-center justify-center gap-8
        transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1)
        group-hover/fan:translate-x-[var(--hover-x)]
        group-hover/fan:rotate-[var(--hover-rotate)]
        group-hover/fan:translate-y-0
        hover:!scale-110 hover:!z-50 
        hover:border-white/40 hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]
        hover:bg-matte-black/60
        relative overflow-hidden
      `}>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="p-5 rounded-2xl border border-white/10 bg-white/5 group-hover/card:scale-110 group-hover/card:bg-white/10 group-hover/card:border-white/30 transition-all duration-500">
                    <Icon className="w-12 h-12 text-neon-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                </div>

                <h3 className="text-2xl font-display font-bold text-neon-white tracking-[0.2em] uppercase group-hover/card:text-glow transition-all text-center px-4">
                    {title}
                </h3>

                <div className="absolute bottom-10 opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-y-4 group-hover/card:translate-y-0 text-[10px] tracking-[0.3em] text-gray-400 font-medium">
                    EXPLORE
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
