import React from 'react';
import { BookOpen } from 'lucide-react';

const JournalPlaceholder = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
            <BookOpen className="w-24 h-24 text-neon-white mb-6 opacity-50" />
            <h2 className="text-3xl font-bold text-neon-white mb-4">Journal</h2>
            <p className="text-gray-400 max-w-md">
                This feature is currently under development. Soon you'll be able to record your thoughts and feelings here.
            </p>
        </div>
    );
};

export default JournalPlaceholder;
