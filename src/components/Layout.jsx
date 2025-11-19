import React from 'react';
import { Brain } from 'lucide-react';
import FluidBackground from './FluidBackground';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen text-neon-white flex flex-col relative overflow-hidden">
            <FluidBackground />

            <header className="p-6 border-b border-glass-border flex items-center justify-between backdrop-blur-md bg-matte-black/30 sticky top-0 z-50">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-white/30 transition-all duration-300">
                        <Brain className="w-6 h-6 text-neon-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-widest text-neon-white group-hover:text-glow transition-all duration-300">NEURACARE</h1>
                </div>
                <nav>
                    <a href="#" className="text-gray-400 hover:text-neon-white transition-colors text-sm tracking-widest uppercase">About</a>
                </nav>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
                {children}
            </main>

            <footer className="p-6 text-center text-gray-500 text-xs tracking-widest border-t border-glass-border backdrop-blur-sm bg-matte-black/20">
                &copy; {new Date().getFullYear()} NEURACARE. ALL RIGHTS RESERVED.
            </footer>
        </div>
    );
};

export default Layout;
