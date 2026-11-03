import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiCpu,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiCompass,
  FiZap,
  FiInfo,
  FiLoader,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import roadmapService from '../../services/roadmapService';
import aiService from '../../services/aiService';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapErr, setRoadmapErr] = useState('');

  // Explainable AI States
  const [xaiData, setXaiData] = useState(null);
  const [xaiLoading, setXaiLoading] = useState(false);
  const [xaiError, setXaiError] = useState('');
  const [activeXaiTab, setActiveXaiTab] = useState('placement'); // 'placement' | 'salary'

  const prediction = location.state?.prediction;

  // Redirect back if no prediction data passed
  useEffect(() => {
    if (!prediction) {
      navigate('/prediction');
    } else {
      fetchExplanation();
    }
  }, [prediction, navigate]);

  const fetchExplanation = async () => {
    if (!prediction) return;
    setXaiLoading(true);
    setXaiError('');
    try {
      const res = await aiService.getExplanation(prediction._id, prediction);
      if (res?.success) {
        setXaiData(res);
      }
    } catch (err) {
      console.error('XAI error:', err);
      setXaiError(
        err.response?.data?.message ||
        err.message ||
        'Unable to load AI model explanations'
      );
    } finally {
      setXaiLoading(false);
    }
  };

  if (!prediction) return null;

  const handleGenerateRoadmap = async () => {
    setRoadmapLoading(true);
    setRoadmapErr('');
    try {
      await roadmapService.generateRoadmap(prediction._id);
      navigate('/roadmap');
    } catch (err) {
      setRoadmapErr(err.response?.data?.message || err.message || 'Failed to generate roadmap');
    } finally {
      setRoadmapLoading(false);
    }
  };

  // Format data for Recharts Radar (Coding Skills)
  const radarData = [
    { subject: 'DSA', A: prediction.dsa, B: 85, fullMark: 100 },
    { subject: 'Communication', A: prediction.communication, B: 80, fullMark: 100 },
    { subject: 'Aptitude', A: prediction.aptitude, B: 80, fullMark: 100 },
    { subject: 'Projects', A: Math.min(prediction.projects * 25, 100), B: 75, fullMark: 100 },
    { subject: 'Experience', A: Math.min(prediction.internships * 50, 100), B: 75, fullMark: 100 },
  ];

  // Format data for Recharts Bar (Feature Importance weights from model)
  const skillImportance = prediction.skillImportance || {};
  const importanceData = Object.entries(skillImportance).map(([key, value]) => ({
    name: key.toUpperCase(),
    weight: Math.round(value * 100),
  })).sort((a, b) => b.weight - a.weight);

  const probPct = Math.round(prediction.probability * 100);
  const isPlaced = prediction.prediction;

  // Simple Markdown parser for AI explanation text
  const renderFormattedMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return (
      <div className="space-y-2 text-sm leading-relaxed text-dark-800 dark:text-dark-200">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-base text-dark-900 dark:text-white mt-3 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-bold text-lg text-primary-600 dark:text-primary-400 mt-4 mb-2">
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span className="text-primary-500 font-bold mt-1 text-xs">•</span>
                <span className="flex-1">{parseInline(line.replace(/^[-*]\s+/, ''))}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            const match = line.match(/^(\d+\.)\s+(.*)/);
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span className="text-primary-500 font-bold text-xs mt-0.5">{match[1]}</span>
                <span className="flex-1">{parseInline(match[2])}</span>
              </div>
            );
          }
          if (line.trim() === '') return <div key={idx} className="h-1" />;
          return <p key={idx}>{parseInline(line)}</p>;
        })}
      </div>
    );
  };

  const parseInline = (text) => {
    const parts = [];
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-semibold text-dark-900 dark:text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={match.index} className="px-1.5 py-0.5 rounded bg-dark-100 dark:bg-dark-800 text-primary-600 text-xs font-mono">
            {token.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Back Button */}
      <div className="flex justify-between items-center">
        <Link to="/prediction" className="inline-flex items-center text-sm font-semibold text-dark-500 hover:text-dark-800 dark:hover:text-white transition-smooth">
          <FiArrowLeft className="mr-1.5" /> Back to Predictor
        </Link>
        <span className="text-xs text-dark-400">Predicted on {new Date(prediction.createdAt || Date.now()).toLocaleDateString()}</span>
      </div>

      {/* Main Probability Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Probability Meter Card */}
        <Card className="flex flex-col items-center justify-center text-center space-y-4 md:col-span-1 glass-panel">
          <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-widest">
            Hiring Outlook
          </h3>
          <div className="relative flex items-center justify-center">
            {/* Circle Progress Bar */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                className="text-dark-100 dark:text-dark-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="64"
                cx="72"
                cy="72"
              />
              <circle
                className={isPlaced ? "text-green-500" : "text-amber-500"}
                strokeWidth="8"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * probPct) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="64"
                cx="72"
                cy="72"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-dark-900 dark:text-white leading-none">
                {probPct}%
              </span>
              <span className="text-[10px] text-dark-400 dark:text-dark-500 uppercase tracking-widest font-bold mt-1">
                Probability
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isPlaced
                ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
            }`}>
              {isPlaced ? <FiCheckCircle /> : <FiAlertTriangle />}
              <span>{isPlaced ? 'Placed Outcome' : 'Needs Optimization'}</span>
            </div>
            <p className="text-[11px] text-dark-400">
              AI Confidence rating: {Math.round(prediction.confidence * 100)}%
            </p>
          </div>
        </Card>

        {/* Salary Package and Insights */}
        <Card className="md:col-span-2 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-widest">
              AI Assessment Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-dark-50 dark:bg-dark-900/50 rounded-xl border border-dark-100 dark:border-dark-800/40">
                <span className="text-xs text-dark-500">Estimated CTC Offer</span>
                <h4 className="text-2xl font-black text-dark-900 dark:text-white mt-1">
                  ₹{prediction.expectedSalary.toFixed(1)} LPA
                </h4>
                <p className="text-[10px] text-dark-400 mt-1">
                  Estimated package based on Random Forest regression.
                </p>
              </div>

              <div className="p-4 bg-dark-50 dark:bg-dark-900/50 rounded-xl border border-dark-100 dark:border-dark-800/40">
                <span className="text-xs text-dark-500">Target Companies Eligibility</span>
                <h4 className="text-lg font-bold text-dark-900 dark:text-white mt-1">
                  Ready for companies
                </h4>
                <p className="text-[10px] text-dark-400 mt-1">
                  Check company requirements against your metrics.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-dark-200 dark:border-dark-800">
            {roadmapErr && (
              <span className="text-xs text-red-500 font-semibold">{roadmapErr}</span>
            )}
            <Button
              className="flex-1"
              onClick={handleGenerateRoadmap}
              loading={roadmapLoading}
            >
              Generate Skill-up Roadmap <FiCompass className="ml-2" />
            </Button>
            <Link to="/companies" className="flex-1">
              <Button variant="outline" className="w-full">
                Verify Company Eligibility <FiArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* FEATURE 3: EXPLAINABLE AI (XAI) SECTION */}
      <Card className="space-y-6 border-primary-200/60 dark:border-primary-900/40 bg-gradient-to-b from-primary-50/20 to-transparent dark:from-primary-950/10 dark:to-transparent">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-dark-100 dark:border-dark-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <FiZap className="text-primary-500 h-5 w-5" />
              <h3 className="text-lg font-bold text-dark-900 dark:text-white tracking-tight">
                Explainable AI (XAI) – Why This Prediction?
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                SHAP + LLM
              </span>
            </div>
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
              Direct mathematical breakdown of how your specific parameters pushed your placement chances and salary offer.
            </p>
          </div>

          {/* Refresh / Status button */}
          <button
            onClick={fetchExplanation}
            disabled={xaiLoading}
            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg border border-dark-200 dark:border-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-900 transition-smooth cursor-pointer disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-1.5 ${xaiLoading ? 'animate-spin' : ''}`} />
            Re-analyze
          </button>
        </div>

        {xaiLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2 text-xs text-dark-400">
            <FiLoader className="animate-spin text-primary-500 h-6 w-6" />
            <span>Computing SHAP Shapley values from Random Forest trees...</span>
          </div>
        ) : xaiError ? (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs flex items-center space-x-2">
            <FiAlertTriangle className="shrink-0" />
            <span>{xaiError}</span>
          </div>
        ) : xaiData ? (
          <div className="space-y-6">
            {/* Toggle between Placement Probability & Salary Impact */}
            <div className="flex border-b border-dark-200 dark:border-dark-800">
              <button
                onClick={() => setActiveXaiTab('placement')}
                className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-smooth cursor-pointer ${
                  activeXaiTab === 'placement'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-dark-500 hover:text-dark-800 dark:hover:text-dark-200'
                }`}
              >
                Placement Probability Drivers (SHAP)
              </button>
              <button
                onClick={() => setActiveXaiTab('salary')}
                className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-smooth cursor-pointer ${
                  activeXaiTab === 'salary'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-dark-500 hover:text-dark-800 dark:hover:text-dark-200'
                }`}
              >
                Salary Offer Drivers (SHAP LPA)
              </button>
            </div>

            {/* SHAP Contributions List */}
            {activeXaiTab === 'placement' ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-dark-500">
                  <span>Base expected placement probability: <strong>{Math.round((xaiData.shap?.baseProbability || 0.31) * 100)}%</strong></span>
                  <span>Final predicted probability: <strong className="text-primary-600 dark:text-primary-400">{probPct}%</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {xaiData.shap?.placementContributions?.map((contrib, i) => {
                    const isPositive = contrib.direction === 'positive';
                    const pctImpact = (contrib.impact * 100).toFixed(1);
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isPositive
                            ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200/80 dark:border-green-900/30'
                            : 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-200/80 dark:border-rose-900/30'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-dark-900 dark:text-white uppercase tracking-wider">
                            {contrib.feature}
                          </span>
                          <span className="text-[11px] text-dark-500 block">
                            Your value: <strong>{contrib.studentValue}</strong>
                          </span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center text-xs font-extrabold ${
                              isPositive ? 'text-green-600 dark:text-green-400' : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {isPositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                            {isPositive ? `+${pctImpact}%` : `${pctImpact}%`}
                          </span>
                          <span className="text-[10px] text-dark-400 uppercase tracking-wider block">
                            {isPositive ? 'Boosts Outcome' : 'Limits Score'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-dark-500">
                  <span>Base expected package: <strong>₹{(xaiData.shap?.baseSalary || 13.3).toFixed(1)} LPA</strong></span>
                  <span>Final expected package: <strong className="text-primary-600 dark:text-primary-400">₹{prediction.expectedSalary.toFixed(1)} LPA</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {xaiData.shap?.salaryContributions?.map((contrib, i) => {
                    const isPositive = contrib.direction === 'positive';
                    const lpaImpact = contrib.impact.toFixed(2);
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isPositive
                            ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200/80 dark:border-green-900/30'
                            : 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-200/80 dark:border-rose-900/30'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-dark-900 dark:text-white uppercase tracking-wider">
                            {contrib.feature}
                          </span>
                          <span className="text-[11px] text-dark-500 block">
                            Your value: <strong>{contrib.studentValue}</strong>
                          </span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center text-xs font-extrabold ${
                              isPositive ? 'text-green-600 dark:text-green-400' : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {isPositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                            {isPositive ? `+₹${lpaImpact} LPA` : `₹${lpaImpact} LPA`}
                          </span>
                          <span className="text-[10px] text-dark-400 uppercase tracking-wider block">
                            {isPositive ? 'CTC Boost' : 'CTC Reduction'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Natural Language Narrative */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 space-y-3">
              <div className="flex items-center space-x-2">
                <FiCpu className="text-primary-500" />
                <h4 className="text-sm font-bold text-dark-900 dark:text-white">
                  Ollama AI Natural Language Explanation
                </h4>
              </div>
              <div>{renderFormattedMarkdown(xaiData.explanation)}</div>
            </div>

            {/* Causality vs Model Attribution Disclaimer */}
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-dark-50 dark:bg-dark-900/40 border border-dark-100 dark:border-dark-800 text-[11px] text-dark-500 leading-normal">
              <FiInfo className="text-dark-400 shrink-0 mt-0.5" />
              <span>
                <strong>Methodology Disclaimer:</strong> These explanations are derived mathematically using SHAP (SHapley Additive exPlanations) directly on our trained Random Forest models. They describe internal model decision weights and feature contributions for this specific prediction rather than proof of real-world causality.
              </span>
            </div>
          </div>
        ) : null}
      </Card>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skill Matrix Radar */}
        <Card className="space-y-4">
          <h3 className="text-md font-bold text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-800 pb-3">
            Skill Radar (Your Rating vs Benchmark)
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#cbd5e1" className="dark:stroke-dark-800" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Radar name="Student" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <Radar name="Benchmark" dataKey="B" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Feature Contribution Chart */}
        <Card className="space-y-4">
          <h3 className="text-md font-bold text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-800 pb-3">
            AI Factor Contributions (Model Weights)
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importanceData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 11 }} width={80} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="weight" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Result;
