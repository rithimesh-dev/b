import React from 'react';
import { RefreshCw, FileText, Activity, Moon, Zap, Brain, AlertTriangle } from 'lucide-react';

const DetailRow = ({ label, value, max = 10, inverse = false }) => {
    // For inverse metrics (Sleep, Energy), low is bad (high burnout contribution)
    // For normal metrics (Stress, Workload), high is bad

    const percentage = (value / max) * 100;
    const displayPercentage = inverse ? 100 - percentage : percentage;

    let colorClass = "bg-white";
    if (displayPercentage < 40) colorClass = "bg-white";
    else if (displayPercentage < 70) colorClass = "bg-yellow-200";
    else colorClass = "bg-red-400";

    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1 text-xs uppercase tracking-wider">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-mono">{value}/{max}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClass} transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
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
        <div className="bg-matte-black/60 backdrop-blur-xl border border-white/10 p-10 max-w-3xl mx-auto shadow-2xl rounded-[2rem] font-mono relative animate-fade-in overflow-hidden">
            {/* Decorative shine */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Header */}
            <div className="border-b border-white/10 pb-6 mb-8 flex justify-between items-start relative z-10">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tighter flex items-center gap-3">
                        <FileText className="w-8 h-8 text-white/80" />
                        BURNOUT REPORT
                    </h2>
                    <p className="text-gray-500 mt-2 text-xs tracking-widest">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
                <div className="text-right">
                    <div className="text-white/80 text-sm tracking-widest">{date}</div>
                    <div className="text-gray-600 text-[10px] mt-1 tracking-[0.2em] uppercase">Neuracare System v2.0</div>
                </div>
            </div>

            {/* Main Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 relative z-10">
                <div className="md:col-span-1 border-r border-white/10 pr-8">
                    <div className="text-gray-500 text-[10px] mb-2 uppercase tracking-[0.2em]">Overall Score</div>
                    <div className="text-7xl font-display font-bold text-white mb-4 tracking-tighter">{score}%</div>
                    <div className={`inline-block px-4 py-1 text-[10px] font-bold border ${score < 60 ? 'border-white/50 text-white' : 'border-red-500/50 text-red-400'} uppercase tracking-[0.3em] rounded-full bg-white/5`}>
                        {getRiskLevel(score)}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="text-gray-500 text-[10px] mb-4 uppercase tracking-[0.2em]">Executive Summary</div>
                    <p className="text-gray-300 leading-relaxed text-sm font-light">
                        Based on the input parameters, the subject is exhibiting
                        <span className="text-white font-bold"> {getRiskLevel(score).toLowerCase()} </span>
                        indicators of occupational burnout.
                        {score > 60
                            ? " Immediate intervention is recommended to prevent long-term physiological and psychological impact."
                            : " Current stress management protocols appear effective, though continued monitoring is advised."}
                    </p>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="mb-8 bg-white/5 p-6 rounded-xl border border-white/5 relative z-10">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-xs">
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
            <div className="mb-8 relative z-10">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-xs">
                    <Brain className="w-4 h-4" /> Clinical Recommendations
                </h3>
                <div className="grid gap-4">
                    {score > 60 && (
                        <div className="border-l-2 border-red-500/50 pl-4 py-2 bg-red-500/5 rounded-r-lg">
                            <h4 className="text-red-400 font-bold text-xs mb-1 flex items-center gap-2 uppercase tracking-wider">
                                <AlertTriangle className="w-3 h-3" /> Critical Intervention
                            </h4>
                            <p className="text-gray-400 text-xs">Mandatory disconnect from professional stressors for minimum 48 hours.</p>
                        </div>
                    )}
                    <div className="border-l-2 border-white/30 pl-4 py-2 hover:bg-white/5 transition-colors rounded-r-lg">
                        <h4 className="text-white font-bold text-xs mb-1 uppercase tracking-wider">Cognitive Restructuring</h4>
                        <p className="text-gray-400 text-xs">Implement 4-7-8 breathing technique every 2 hours to regulate cortisol levels.</p>
                    </div>
                    <div className="border-l-2 border-white/30 pl-4 py-2 hover:bg-white/5 transition-colors rounded-r-lg">
                        <h4 className="text-white font-bold text-xs mb-1 uppercase tracking-wider">Sleep Hygiene Protocol</h4>
                        <p className="text-gray-400 text-xs">Enforce digital sunset 60 minutes prior to sleep. Target 7.5h minimum rest.</p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-white/10 pt-6 flex justify-between items-center relative z-10">
                <div className="text-[10px] text-gray-600 tracking-widest uppercase">
                    Generated by Neuracare AI Engine
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-xs hover:bg-gray-200 transition-all rounded-lg tracking-widest uppercase"
                >
                    <RefreshCw className="w-3 h-3" />
                    New Assessment
                </button>
            </div>
        </div>
    );
};

export default BurnoutResult;
