import React from 'react';
import { Brain } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-matte-black text-neon-white flex flex-col">
            <header className="p-6 border-b border-dark-gray flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Brain className="w-8 h-8 text-neon-accent" />
                    <h1 className="text-2xl font-bold tracking-wider text-neon-white">NEURACARE</h1>
                </div>
                <nav>
                    <a href="#" className="text-gray-400 hover:text-neon-accent transition-colors">About</a>
                </nav>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="p-6 text-center text-gray-600 text-sm border-t border-dark-gray">
                &copy; {new Date().getFullYear()} Neuracare. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;
