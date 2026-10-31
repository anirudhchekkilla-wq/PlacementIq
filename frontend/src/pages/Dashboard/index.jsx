import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiCpu, FiTrendingUp, FiBookOpen, FiActivity, FiMapPin, FiCheckSquare, FiAlertCircle } from 'react-icons/fi';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import predictionService from '../../services/predictionService';
import roadmapService from '../../services/roadmapService';
import companyService from '../../services/companyService';

const Dashboard = () => {
  const { user } = useAuth();
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch prediction history
        const predictions = await predictionService.getHistory();
        if (predictions && predictions.length > 0) {
          // Sort by date desc and pick latest
          setLatestPrediction(predictions[0]);
        }

        // Fetch roadmap
        try {
          const rMap = await roadmapService.getRoadmap();
          setRoadmap(rMap);
        } catch (e) {
          console.log('No roadmap generated yet');
        }

        // Fetch companies
        const comps = await companyService.getCompanies();
        setCompanies(comps.slice(0, 3)); // show top 3 on dashboard
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Check if profile is complete (needs CGPA, branch, etc.)
  const isProfileComplete = user?.profile?.college && user?.profile?.branch && user?.profile?.cgpa > 0;

  // Determine eligibility status for a seeded company
  const checkEligibility = (company) => {
    if (!user?.profile) return { eligible: false, reason: 'Profile not complete' };
    const p = user.profile;

    if (p.cgpa < company.minCGPA) {
      return { eligible: false, reason: `Requires min ${company.minCGPA} CGPA (You: ${p.cgpa})` };
    }
    if (p.backlogs > company.maxBacklogs) {
      return { eligible: false, reason: `Max ${company.maxBacklogs} backlogs allowed (You: ${p.backlogs})` };
    }
    
    // Check skills
    if (company.requiredSkills && company.requiredSkills.length > 0) {
      // Find missing skills
      const studentSkills = [
        p.codingSkills?.dsa >= 60 ? 'Data Structures & Algorithms' : '',
        p.codingSkills?.communication >= 60 ? 'Communication' : '',
        p.codingSkills?.aptitude >= 60 ? 'Aptitude & Reasoning' : '',
        p.codingSkills?.systemDesign >= 60 ? 'System Design' : '',
        p.codingSkills?.mlKnowledge >= 60 ? 'Machine Learning' : '',
      ].filter(Boolean);

      const missing = company.requiredSkills.filter(s => !studentSkills.includes(s));
      if (missing.length > 0) {
        return { eligible: false, reason: `Improve skills: ${missing.slice(0, 1).join('')}` };
      }
    }

    return { eligible: true, reason: 'Eligible to apply' };
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-primary-500/10">
        <div className="absolute top-[-40%] right-[-10%] w-[40%] h-[150%] rounded-full bg-white/5 blur-[50px] transform rotate-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Hello, {user?.name}!
            </h2>
            <p className="text-primary-100 text-sm md:text-base max-w-xl">
              {isProfileComplete
                ? "Your academic profile is ready. Run the prediction model to evaluate your placement eligibility."
                : "Complete your academic profile and skills matrix to unlock placement predictions and roadmaps."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!isProfileComplete && (
              <Link to="/profile">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Complete Profile
                </Button>
              </Link>
            )}
            <Link to="/prediction">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Predict Placement <FiCpu className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Placement Probability"
          value={latestPrediction ? `${Math.round(latestPrediction.probability * 100)}%` : 'N/A'}
          description={latestPrediction ? (latestPrediction.prediction ? 'Placed (High Chance)' : 'Needs Improvement') : 'No predictions yet'}
          icon={FiActivity}
          loading={loading}
          trend={latestPrediction ? { type: latestPrediction.probability >= 0.75 ? 'up' : 'down', value: `${Math.round(latestPrediction.probability * 100)}%` } : null}
        />
        <StatCard
          title="Estimated Salary"
          value={latestPrediction ? `₹${latestPrediction.expectedSalary.toFixed(1)} LPA` : 'N/A'}
          description="Average package estimation"
          icon={FiTrendingUp}
          loading={loading}
        />
        <StatCard
          title="CGPA Status"
          value={user?.profile?.cgpa ? user.profile.cgpa.toFixed(2) : '0.00'}
          description={`${user?.profile?.backlogs || 0} active backlogs`}
          icon={FiBookOpen}
          loading={loading}
        />
        <StatCard
          title="Roadmap Progress"
          value={roadmap ? `${roadmap.progress}%` : '0%'}
          description={roadmap ? `${roadmap.steps.filter(s => s.status === 'completed').length}/${roadmap.steps.length} tasks completed` : 'Roadmap not generated'}
          icon={FiCheckSquare}
          loading={loading}
        />
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill Matrix */}
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-dark-200 dark:border-dark-800 pb-4">
            <h3 className="text-lg font-bold text-dark-900 dark:text-white">Technical Skills Profile</h3>
            <Link to="/profile" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              Edit Skills
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Data Structures & Algorithms', score: user?.profile?.codingSkills?.dsa || 0, color: 'bg-primary-500' },
              { label: 'Communication Skills', score: user?.profile?.codingSkills?.communication || 0, color: 'bg-indigo-500' },
              { label: 'Quantitative Aptitude', score: user?.profile?.codingSkills?.aptitude || 0, color: 'bg-emerald-500' },
              { label: 'System Design', score: user?.profile?.codingSkills?.systemDesign || 0, color: 'bg-cyan-500' },
              { label: 'Machine Learning Knowledge', score: user?.profile?.codingSkills?.mlKnowledge || 0, color: 'bg-amber-500' },
            ].map((skill) => (
              <div key={skill.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-dark-700 dark:text-dark-300">{skill.label}</span>
                  <span className="text-dark-900 dark:text-white">{skill.score}/100</span>
                </div>
                <div className="h-2.5 w-full bg-dark-100 dark:bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Key Weaknesses / Active Roadmap & Company Preview */}
        <div className="space-y-6">
          {/* Active Roadmap Step Widget */}
          <Card className="space-y-4">
            <h3 className="text-md font-bold text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-800 pb-3">
              Next Roadmap Task
            </h3>
            {roadmap && roadmap.steps.filter(s => s.status !== 'completed').length > 0 ? (
              <div className="space-y-3">
                {roadmap.steps.filter(s => s.status !== 'completed').slice(0, 1).map((step) => (
                  <div key={step._id || step.title} className="p-3 bg-dark-50 dark:bg-dark-900/50 rounded-lg border border-dark-200/50 dark:border-dark-800/50 space-y-1">
                    <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wide">
                      {step.category}
                    </span>
                    <h4 className="text-xs font-bold text-dark-900 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-dark-500 dark:text-dark-400">
                      {step.description}
                    </p>
                  </div>
                ))}
                <Link to="/roadmap">
                  <Button variant="outline" className="w-full text-xs py-1.5 mt-1">
                    Go to Full Roadmap
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <FiAlertCircle className="mx-auto text-dark-400" size={28} />
                <p className="text-xs text-dark-500">
                  {latestPrediction ? 'You have completed all goals or need to update your roadmap.' : 'Generate your first placement prediction to receive a roadmap.'}
                </p>
                {latestPrediction && !roadmap && (
                  <Link to="/roadmap">
                    <Button size="sm" className="w-full text-xs">Generate Roadmap</Button>
                  </Link>
                )}
              </div>
            )}
          </Card>

          {/* Company Eligibility Widget */}
          <Card className="space-y-4">
            <h3 className="text-md font-bold text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-800 pb-3">
              Hiring Companies Status
            </h3>
            <div className="space-y-3">
              {companies.length > 0 ? (
                companies.map((company) => {
                  const { eligible, reason } = checkEligibility(company);
                  return (
                    <div key={company._id || company.name} className="flex items-center justify-between p-2 rounded-lg border border-dark-100 dark:border-dark-800/40">
                      <div>
                        <h4 className="text-xs font-bold text-dark-900 dark:text-white">{company.name}</h4>
                        <span className="text-[10px] text-dark-500">Package: {company.salary} LPA</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          eligible
                            ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                            : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                        }`}
                      >
                        {eligible ? 'Eligible' : 'Not Eligible'}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-xs text-dark-400 py-3">
                  No company database found.
                </div>
              )}
              <Link to="/companies">
                <Button variant="outline" className="w-full text-xs py-1.5">
                  Check All Eligibility
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
