import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCpu, FiAlertTriangle, FiCheckCircle, FiArrowRight, FiArrowLeft, FiCompass } from 'react-icons/fi';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import roadmapService from '../../services/roadmapService';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [roadmapLoading, setRoadmapLoading] = React.useState(false);
  const [roadmapErr, setRoadmapErr] = React.useState('');

  const prediction = location.state?.prediction;

  // Redirect back if no prediction data passed
  React.useEffect(() => {
    if (!prediction) {
      navigate('/prediction');
    }
  }, [prediction, navigate]);

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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Back Button */}
      <div className="flex justify-between items-center">
        <Link to="/prediction" className="inline-flex items-center text-sm font-semibold text-dark-500 hover:text-dark-800 dark:hover:text-white transition-smooth">
          <FiArrowLeft className="mr-1.5" /> Back to Predictor
        </Link>
        <span className="text-xs text-dark-400">Predicted on {new Date(prediction.createdAt).toLocaleDateString()}</span>
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
                  Estimated average package for similar profile trends.
                </p>
              </div>

              <div className="p-4 bg-dark-50 dark:bg-dark-900/50 rounded-xl border border-dark-100 dark:border-dark-800/40">
                <span className="text-xs text-dark-500">Target Companies Eligibility</span>
                <h4 className="text-lg font-bold text-dark-900 dark:text-white mt-1">
                  Ready for companies
                </h4>
                <p className="text-[10px] text-dark-400 mt-1">
                  You are eligible for most partner companies. Check eligibility page.
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
