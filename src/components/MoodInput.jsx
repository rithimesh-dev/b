import React, { useState } from 'react';

const MoodSlider = ({ label, value, onChange, minLabel, maxLabel }) => (
    <div className="mb-8">
        <div className="flex justify-between mb-2">
            <label className="text-lg font-medium text-neon-white">{label}</label>
            <span className="text-neon-accent font-bold">{value}/10</span>
        </div>
        <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-dark-gray rounded-lg appearance-none cursor-pointer accent-neon-accent hover:accent-neon-blue transition-all"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
        </div>
    </div>
);

const MoodInput = ({ onCalculate }) => {
    const [moodData, setMoodData] = useState({
        stress: 5,
        sleep: 5,
        workload: 5,
        energy: 5
    });

    const handleChange = (field, value) => {
        setMoodData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCalculate(moodData);
    };

    return (
        <div className="bg-dark-gray/50 p-8 rounded-2xl border border-dark-gray shadow-neon backdrop-blur-sm">
            <form onSubmit={handleSubmit}>
                <MoodSlider
                    label="Stress Level"
                    value={moodData.stress}
                    onChange={(val) => handleChange('stress', val)}
                    minLabel="Zen Mode"
                    maxLabel="Overwhelmed"
                />
                <MoodSlider
                    label="Quality of Sleep"
                    value={moodData.sleep}
                    onChange={(val) => handleChange('sleep', val)}
                    minLabel="Insomniac"
                    maxLabel="Well Rested"
                />
                <MoodSlider
                    label="Workload Intensity"
                    value={moodData.workload}
                    onChange={(val) => handleChange('workload', val)}
                    minLabel="Light"
                    maxLabel="Heavy"
                />
                <MoodSlider
                    label="Energy Level"
                    value={moodData.energy}
                    onChange={(val) => handleChange('energy', val)}
                    minLabel="Drained"
                    maxLabel="Energized"
                />

                <button
                    type="submit"
                    className="w-full mt-6 py-4 bg-neon-accent text-matte-black font-bold text-lg rounded-xl hover:bg-neon-blue hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] transition-all duration-300 transform hover:-translate-y-1"
                >
                    Analyze Burnout
                </button>
            </form>
        </div>
    );
};

export default MoodInput;
