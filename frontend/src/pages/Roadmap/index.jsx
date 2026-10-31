import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiCpu, FiMap, FiCheckSquare, FiPlay, FiLoader, FiExternalLink, FiClock, FiActivity } from 'react-icons/fi';
import roadmapService from '../../services/roadmapService';
import predictionService from '../../services/predictionService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await roadmapService.getRoadmap();
      setRoadmap(data);
    } catch (error) {
      console.log('Roadmap fetch error:', error);
      setErrorMsg('No career roadmap generated yet. Complete a prediction to get a roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMsg('');
    try {
      // Find latest prediction
      const history = await predictionService.getHistory();
      if (!history || history.length === 0) {
        setErrorMsg('Please run a placement prediction first before generating your roadmap.');
        return;
      }
      const rMap = await roadmapService.generateRoadmap(history[0]._id);
      setRoadmap(rMap);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Roadmap generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleStepStatusChange = async (stepId, newStatus) => {
    try {
      const updatedRoadmap = await roadmapService.updateStep(stepId, newStatus);
      setRoadmap(updatedRoadmap);
    } catch (error) {
      console.error('Failed to update step status:', error);
    }
  };

  // Resources helper based on step category
  const getResources = (category) => {
    const resourcesMap = {
      DSA: [
        { title: 'LeetCode Top Interview 150', url: 'https://leetcode.com/studyplan/top-interview-150/' },
        { title: 'Striver A2Z DSA Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/' }
      ],
      Development: [
        { title: 'MERN Stack Documentation', url: 'https://www.mongodb.com/mern-stack' },
        { title: 'Vite & React Guide', url: 'https://vite.dev' }
      ],
      Aptitude: [
        { title: 'IndiaBIX Quantitative Aptitude', url: 'https://www.indiabix.com/aptitude/questions-and-answers/' },
        { title: 'GeeksforGeeks Aptitude Prep', url: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/' }
      ],
      Communication: [
        { title: 'STAR Method for Interview Answers', url: 'https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-method-in-an-interview' },
        { title: 'Behavioral Questions Prep', url: 'https://leetcode.com/discuss/general-discussion/1114294/behavioral-interview-questions' }
      ],
      'System Design': [
        { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
        { title: 'ByteByteGo System Design', url: 'https://bytebytego.com' }
      ],
      ML: [
        { title: 'Scikit-Learn Tutorials', url: 'https://scikit-learn.org/stable/tutorial/index.html' },
        { title: 'Kaggle Machine Learning Courses', url: 'https://www.kaggle.com/learn' }
      ]
    };
    return resourcesMap[category] || [];
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card className="h-40 animate-pulse bg-dark-100 dark:bg-dark-900" />
        <Card className="h-60 animate-pulse bg-dark-100 dark:bg-dark-900" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <Card className="flex flex-col items-center justify-center text-center py-16 space-y-4 max-w-xl mx-auto glass-panel">
        <FiMap className="text-dark-300 dark:text-dark-700" size={48} />
        <h3 className="text-lg font-bold text-dark-900 dark:text-white">
          Career Roadmap Advisor
        </h3>
        <p className="text-sm text-dark-500 dark:text-dark-400">
          Analyze your skills matrix and generate a personalized step-by-step roadmap to cover your gaps and reach placement readiness.
        </p>
        {errorMsg && (
          <span className="text-xs text-amber-600 font-semibold block">{errorMsg}</span>
        )}
        <div className="pt-2">
          <Button onClick={handleGenerate} loading={generating}>
            Generate Personalized Roadmap <FiCpu className="ml-2" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Card */}
      <Card className="glass-panel border-primary-100 dark:border-primary-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 flex-1">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest">
              My Career Path
            </span>
            <h2 className="text-xl font-bold text-dark-900 dark:text-white leading-none">
              Roadmap Progress Overview
            </h2>
            <p className="text-xs text-dark-500">
              Complete each milestone to boost your placement probability scores.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-3xl font-black text-dark-900 dark:text-white">
                {roadmap.progress}%
              </span>
              <span className="text-[10px] text-dark-400 uppercase tracking-wider block">Completed</span>
            </div>
            <div className="h-16 w-1 bg-dark-100 dark:bg-dark-800 rounded-full" />
            <div className="flex flex-col text-xs text-dark-600 dark:text-dark-400 space-y-0.5">
              <span>
                Pending:{' '}
                <strong className="text-dark-900 dark:text-white font-bold">
                  {roadmap.steps.filter((s) => s.status === 'pending').length}
                </strong>
              </span>
              <span>
                In Progress:{' '}
                <strong className="text-primary-600 dark:text-primary-400 font-bold">
                  {roadmap.steps.filter((s) => s.status === 'in_progress').length}
                </strong>
              </span>
              <span>
                Completed:{' '}
                <strong className="text-green-600 dark:text-green-400 font-bold">
                  {roadmap.steps.filter((s) => s.status === 'completed').length}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="h-3 w-full bg-dark-100 dark:bg-dark-800 rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${roadmap.progress}%` }}
          />
        </div>
      </Card>

      {/* Steps List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-dark-500 uppercase tracking-widest px-1">
          Milestones & Action Steps
        </h3>

        <div className="space-y-4">
          {roadmap.steps.map((step, index) => {
            const stepResources = getResources(step.category);
            
            return (
              <Card
                key={step._id || step.title}
                className={`transition-all duration-300 ${
                  step.status === 'completed'
                    ? 'border-green-200 bg-green-50/10 dark:border-green-950/20 dark:bg-green-950/5'
                    : step.status === 'in_progress'
                    ? 'border-primary-200 bg-primary-50/10 dark:border-primary-950/20 dark:bg-primary-950/5'
                    : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Step Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="h-6 w-6 rounded-full bg-dark-100 dark:bg-dark-800 flex items-center justify-center text-xs font-bold text-dark-700 dark:text-dark-300">
                        {index + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        step.category === 'DSA' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400' :
                        step.category === 'Aptitude' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' :
                        'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                      }`}>
                        {step.category}
                      </span>
                      <span className="text-[10px] text-dark-500 flex items-center gap-1">
                        <FiClock /> {step.estimatedWeeks} Weeks
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-md font-bold text-dark-900 dark:text-white leading-tight">
                        {step.title}
                      </h4>
                      <p className="text-xs text-dark-500 dark:text-dark-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Resources */}
                    {stepResources.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-3 items-center">
                        <span className="text-[10px] font-semibold text-dark-400 uppercase">Resources:</span>
                        {stepResources.map((res) => (
                          <a
                            key={res.title}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:underline gap-0.5"
                          >
                            {res.title} <FiExternalLink size={10} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex flex-col space-y-1.5 shrink-0">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-dark-400">
                      Task Status
                    </label>
                    <select
                      value={step.status}
                      onChange={(e) => handleStepStatusChange(step._id, e.target.value)}
                      className={`rounded-lg border text-xs py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer font-bold ${
                        step.status === 'completed'
                          ? 'border-green-300 dark:border-green-800 bg-green-500 text-white'
                          : step.status === 'in_progress'
                          ? 'border-primary-300 dark:border-primary-800 bg-primary-600 text-white'
                          : 'border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 text-dark-700 dark:text-dark-300'
                      }`}
                    >
                      <option className="bg-white dark:bg-dark-900 text-dark-800 dark:text-dark-200" value="pending">Pending</option>
                      <option className="bg-white dark:bg-dark-900 text-dark-800 dark:text-dark-200" value="in_progress">In Progress</option>
                      <option className="bg-white dark:bg-dark-900 text-dark-800 dark:text-dark-200" value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
