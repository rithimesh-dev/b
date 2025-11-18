import React from 'react';
import { RefreshCw, FileText, Activity, Moon, Zap, Brain, AlertTriangle } from 'lucide-react';

const DetailRow = ({ label, value, max = 10, inverse = false }) => {
    // For inverse metrics (Sleep, Energy), low is bad (high burnout contribution)
    // For normal metrics (Stress, Workload), high is bad

    const percentage = (value / max) * 100;
    const displayPercentage = inverse ? 100 - percentage : percentage;

    let colorClass = "bg-neon-white";
    if (displayPercentage < 40) colorClass = "bg-neon-white";
    else if (displayPercentage < 70) colorClass = "bg-yellow-200";
    else colorClass = "bg-red-400";

    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="text-neon-white font-mono">{value}/{max}</span>
            </div>
            <div className="h-2 bg-dark-gray rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClass} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

const BurnoutResult = ({ result, onReset }) => {
    const { score, details } = result;
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const getRiskLevel = (score) => {
        if (score < 30) return "Low Risk";
        if (score < 60) return "Moderate Risk";
        return "High Risk";
    };

    return (
        <div className="bg-matte-black border border-neon-white/20 p-8 max-w-3xl mx-auto shadow-[0_0_30px_rgba(255,255,255,0.05)] font-mono relative animate-fade-in">
            {/* Header */}
            <div className="border-b border-neon-white/20 pb-6 mb-8 flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-neon-white tracking-tighter flex items-center gap-3">
                        <FileText className="w-8 h-8" />
                        BURNOUT ASSESSMENT REPORT
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
                <div className="text-right">
                    <div className="text-neon-white text-sm">{date}</div>
                    <div className="text-gray-500 text-xs mt-1">NEURACARE SYSTEM v1.0</div>
                </div>
            </div>

            {/* Main Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-1 border-r border-neon-white/20 pr-8">
                    <div className="text-gray-500 text-sm mb-2 uppercase tracking-widest">Overall Score</div>
                    <div className="text-6xl font-bold text-neon-white mb-2">{score}%</div>
                    <div className={`inline-block px-3 py-1 text-xs font-bold border ${score < 60 ? 'border-neon-white text-neon-white' : 'border-red-500 text-red-500'} uppercase tracking-widest`}>
                        {getRiskLevel(score)}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="text-gray-500 text-sm mb-4 uppercase tracking-widest">Executive Summary</div>
                    <p className="text-gray-300 leading-relaxed">
                        Based on the input parameters, the subject is exhibiting
                        <span className="text-neon-white font-bold"> {getRiskLevel(score).toLowerCase()} </span>
                        indicators of occupational burnout.
                        {score > 60
                            ? " Immediate intervention is recommended to prevent long-term physiological and psychological impact."
                            : " Current stress management protocols appear effective, though continued monitoring is advised."}
                    </p>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="mb-8 bg-dark-gray/30 p-6 border border-neon-white/10">
                <h3 className="text-neon-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                    <Activity className="w-4 h-4" /> Metric Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailRow label="Psychological Stress" value={details.stress} />
                    <DetailRow label="Sleep Quality" value={details.sleep} inverse={true} />
                    <DetailRow label="Workload Intensity" value={details.workload} />
                    <DetailRow label="Energy Levels" value={details.energy} inverse={true} />
                </div>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
                <h3 className="text-neon-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                    <Brain className="w-4 h-4" /> Clinical Recommendations
                </h3>
                <div className="grid gap-4">
                    {score > 60 && (
                        <div className="border-l-2 border-red-500 pl-4 py-2">
                            <h4 className="text-red-400 font-bold text-sm mb-1 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" /> CRITICAL INTERVENTION
                            </h4>
                            <p className="text-gray-400 text-sm">Mandatory disconnect from professional stressors for minimum 48 hours.</p>
                        </div>
                    )}
                    <div className="border-l-2 border-neon-white pl-4 py-2">
                        <h4 className="text-neon-white font-bold text-sm mb-1">Cognitive Restructuring</h4>
                        <p className="text-gray-400 text-sm">Implement 4-7-8 breathing technique every 2 hours to regulate cortisol levels.</p>
                    </div>
                    <div className="border-l-2 border-neon-white pl-4 py-2">
                        <h4 className="text-neon-white font-bold text-sm mb-1">Sleep Hygiene Protocol</h4>
                        <p className="text-gray-400 text-sm">Enforce digital sunset 60 minutes prior to sleep. Target 7.5h minimum rest.</p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-neon-white/20 pt-6 flex justify-between items-center">
                <div className="text-xs text-gray-600">
                    Generated by Neuracare AI Engine
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-2 bg-neon-white text-matte-black font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    NEW ASSESSMENT
                </button>
            </div>
        </div>
    );
};

export default BurnoutResult;
