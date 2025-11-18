import React from 'react';
import { BrainCircuit } from 'lucide-react';

const JournalAnalyzerPlaceholder = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
            <BrainCircuit className="w-24 h-24 text-neon-white mb-6 opacity-50" />
            <h2 className="text-3xl font-bold text-neon-white mb-4">Journal Analyzer</h2>
            <p className="text-gray-400 max-w-md">
                AI-powered analysis of your journal entries is coming soon. Get deeper insights into your emotional patterns.
            </p>
        </div>
    );
};

export default JournalAnalyzerPlaceholder;
