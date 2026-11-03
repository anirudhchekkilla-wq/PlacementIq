import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FiCpu,
  FiMap,
  FiCheckSquare,
  FiPlay,
  FiLoader,
  FiExternalLink,
  FiClock,
  FiActivity,
  FiZap,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiTarget,
} from 'react-icons/fi';
import roadmapService from '../../services/roadmapService';
import predictionService from '../../services/predictionService';
import aiService from '../../services/aiService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // AI Roadmap States
  const [aiRoadmap, setAiRoadmap] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

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

  const handleGenerateAIRoadmap = async () => {
    setAiLoading(true);
    setAiError('');
    try {
      const res = await aiService.generateRoadmap();
      if (res?.success) {
        setAiRoadmap(res);
      }
    } catch (err) {
      console.error('AI Roadmap error:', err);
      setAiError(
        err.response?.data?.message ||
        err.message ||
        'Failed to generate AI recommendations. Please ensure Ollama is running.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Helper to parse formatting in AI output
  const renderFormattedMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return (
      <div className="space-y-2 text-sm leading-relaxed text-dark-800 dark:text-dark-200">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-base text-dark-900 dark:text-white mt-4 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-bold text-lg text-primary-600 dark:text-primary-400 mt-5 mb-2 border-b border-dark-100 dark:border-dark-800 pb-1">
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('# ')) {
            return (
              <h2 key={idx} className="font-extrabold text-xl text-dark-900 dark:text-white mt-5 mb-2">
                {line.replace('# ', '')}
              </h2>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const parsed = parseBoldAndCode(line.replace(/^[-*]\s+/, ''));
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span className="text-primary-500 font-bold mt-1 text-xs">•</span>
                <span className="flex-1">{parsed}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            const match = line.match(/^(\d+\.)\s+(.*)/);
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span className="text-primary-500 font-bold text-xs mt-0.5">{match[1]}</span>
                <span className="flex-1">{parseBoldAndCode(match[2])}</span>
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1" />;
          }
          return <p key={idx}>{parseBoldAndCode(line)}</p>;
        })}
      </div>
    );
  };

  const parseBoldAndCode = (text) => {
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
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-dark-100 dark:bg-dark-800 text-primary-600 dark:text-primary-400 text-xs font-mono"
          >
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

      {/* AI Strategist Recommendations Section (NEW Feature 2) */}
      <Card className="border-indigo-100 dark:border-indigo-950/40 bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-950/20 dark:to-transparent space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-dark-100 dark:border-dark-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <FiZap className="text-indigo-500" />
              <h3 className="text-base font-bold text-dark-900 dark:text-white">
                AI Learning Strategist Recommendations
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                Ollama LLM
              </span>
            </div>
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">
              Generates tailored weekly milestones and study targets directly mapped to your verified profile gaps.
            </p>
          </div>

          <Button
            onClick={handleGenerateAIRoadmap}
            loading={aiLoading}
            size="sm"
            className="shrink-0"
          >
            {aiRoadmap ? <FiRefreshCw className="mr-1.5" /> : <FiZap className="mr-1.5" />}
            {aiRoadmap ? 'Regenerate AI Plan' : 'Generate AI Plan'}
          </Button>
        </div>

        {aiError && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs flex items-center space-x-2">
            <FiAlertCircle className="shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {aiRoadmap ? (
          <div className="space-y-4 pt-1">
            {/* Detected Skill Gaps Tags */}
            {aiRoadmap.studentGaps && aiRoadmap.studentGaps.length > 0 && (
              <div className="p-3 rounded-xl bg-dark-50 dark:bg-dark-900/50 border border-dark-100 dark:border-dark-800">
                <span className="text-[11px] font-bold text-dark-500 uppercase tracking-wider block mb-2">
                  Target Weaknesses Analyzed:
                </span>
                <div className="space-y-1">
                  {aiRoadmap.studentGaps.map((gap, i) => (
                    <div key={i} className="text-xs text-dark-700 dark:text-dark-300 flex items-start space-x-2">
                      <FiTarget className="text-amber-500 shrink-0 mt-0.5 text-xs" />
                      <span>{gap.replace(/^-\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Generated Markdown Body */}
            <div className="p-4 rounded-xl bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800">
              {renderFormattedMarkdown(aiRoadmap.recommendation)}
            </div>
          </div>
        ) : !aiLoading ? (
          <div className="text-center py-6 text-xs text-dark-400 space-y-1">
            <p>Click "Generate AI Plan" to synthesize a personalized multi-week learning plan based on your current metrics.</p>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center space-y-2 text-xs text-dark-400">
            <FiLoader className="animate-spin text-primary-500 h-6 w-6" />
            <span>Analyzing student metrics and formulating AI curriculum...</span>
          </div>
        )}
      </Card>

      {/* Steps List (Existing Rule-based steps preserved completely) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-dark-500 uppercase tracking-widest px-1">
          Standard Curriculum Milestones
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
