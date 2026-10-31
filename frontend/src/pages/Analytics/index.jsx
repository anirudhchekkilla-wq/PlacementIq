import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiTrendingUp, FiActivity, FiAward, FiBarChart2, FiBookOpen } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import api from '../../services/api';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics');
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <StatCard key={i} loading={true} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-80 animate-pulse bg-dark-100 dark:bg-dark-900" />
          <Card className="h-80 animate-pulse bg-dark-100 dark:bg-dark-900" />
        </div>
      </div>
    );
  }

  if (!analytics || !analytics.hasData) {
    return (
      <Card className="flex flex-col items-center justify-center text-center py-16 space-y-4 max-w-xl mx-auto glass-panel">
        <FiBarChart2 className="text-dark-300 dark:text-dark-700" size={48} />
        <h3 className="text-lg font-bold text-dark-900 dark:text-white">
          No Analytics Data Available
        </h3>
        <p className="text-sm text-dark-500 dark:text-dark-400">
          Run your first placement prediction to unlock detailed trends, salary packages, and skill gap analyses.
        </p>
        <div className="pt-2">
          <Link to="/prediction">
            <Button>Predict Placement Now</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const { stats, timelineData, skillData } = analytics;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Avg Placement Chance"
          value={`${stats.avgProbability}%`}
          description={`Peak chance: ${stats.maxProbability}%`}
          icon={FiActivity}
        />
        <StatCard
          title="Avg Package Prediction"
          value={`₹${stats.avgSalary.toFixed(1)} LPA`}
          description={`Peak CTC: ₹${stats.maxSalary.toFixed(1)} LPA`}
          icon={FiTrendingUp}
        />
        <StatCard
          title="Placement Success Rate"
          value={`${stats.successRate}%`}
          description="Runs categorized as 'Placed'"
          icon={FiAward}
        />
        <StatCard
          title="Prediction Checks"
          value={stats.totalPredictions}
          description="Total attempts saved in history"
          icon={FiBookOpen}
        />
      </div>

      {/* Row 1: Probability Trend (Area Chart) */}
      <Card className="space-y-4">
        <h3 className="text-md font-bold text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-800 pb-3">
          Placement Probability Trend over Runs
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-dark-800" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Area type="monotone" dataKey="probability" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorProbability)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Row 2: Skill Radar vs Salary Estimator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skill Gap Analysis Radar */}
        <Card className="space-y-4">
          <h3 className="text-md font-bold text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-800 pb-3">
            Current Skill Matrix vs Target Benchmark
          </h3>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#cbd5e1" className="dark:stroke-dark-800" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Radar name="My Rating" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <Radar name="Target Benchmark" dataKey="benchmark" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Salary Package Trend */}
        <Card className="space-y-4">
          <h3 className="text-md font-bold text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-800 pb-3">
            Expected CTC Projection Package
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-dark-800" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="salary" name="CTC (LPA)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
