import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiZap,
  FiTarget,
  FiCode,
  FiLayers,
  FiCpu,
  FiRefreshCw,
  FiArrowRight,
  FiBookOpen,
} from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import aiService from '../../services/aiService';

const SAMPLE_RESUME = `ANIRUDH CHOPRA
Email: anirudh@example.com | GitHub: github.com/anirudh | LinkedIn: linkedin.com/in/anirudh

EDUCATION
B.Tech in Computer Science & Engineering (2022 - 2026) | CGPA: 8.4/10

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), Python, C++, Java, SQL
- Frontend: React.js, Next.js, Tailwind CSS, Redux Toolkit, HTML5, CSS3
- Backend: Node.js, Express.js, FastAPI, REST APIs, GraphQL
- Databases: MongoDB, PostgreSQL, Redis
- Tools & Cloud: Git, Docker, AWS (S3, EC2), Postman, Linux

PROJECTS
1. PlacementIQ – AI Career & Placement Intelligence Engine
   - Built a full-stack platform using React, Node.js, and Python FastAPI for campus hiring readiness.
   - Integrated Random Forest Classifier (88% accuracy) for placement probability and Random Forest Regressor for salary predictions.
   - Incorporated Explainable AI (SHAP) and local LLM guidance for personalized learning roadmaps.

2. CloudFlow – Microservices Task Orchestrator
   - Designed a distributed job scheduling service in Node.js and Redis Pub/Sub handling 5,000+ tasks/sec.
   - Containerized with Docker and deployed on AWS EC2 with auto-scaling and monitoring.

INTERNSHIP EXPERIENCE
Software Developer Intern – TechCorp Labs (June 2025 – August 2025)
- Developed and maintained microservices using Express.js and PostgreSQL.
- Optimized database indexing, improving API response latency by 28%.
- Collaborated in an Agile sprint team of 6 engineers with daily standups and code reviews.

ACHIEVEMENTS & CERTIFICATIONS
- Solved 350+ problems across LeetCode and Codeforces (Max Rating: 1540).
- Finalist in Smart India Hackathon 2024.`;

const POPULAR_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'Data Scientist / ML Engineer',
  'Cloud / DevOps Engineer',
];

const ResumeAnalyser = () => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setErrorMsg('Please paste your resume content (at least 50 characters) to analyze.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await aiService.analyzeResume(resumeText, targetRole);
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
      } else {
        setErrorMsg('Could not parse resume analysis. Please try again.');
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
        err.message ||
        'Failed to connect to AI Resume Engine. Ensure Ollama is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setErrorMsg('');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-[#00E5FF] from-[#00E5FF] to-[#5865F2]';
    if (score >= 60) return 'text-[#A855F7] from-[#A855F7] to-[#5865F2]';
    return 'text-amber-400 from-amber-400 to-red-500';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#00E5FF] uppercase tracking-widest mb-1">
            <FiCpu className="animate-pulse" />
            <span>AI Intelligence Engine</span>
          </div>
          <h1 className="text-3xl font-black text-dark-900 dark:text-white tracking-tight">
            AI Resume <span className="bg-gradient-to-r from-[#5865F2] via-[#A855F7] to-[#00E5FF] bg-clip-text text-transparent">Analyser</span>
          </h1>
          <p className="text-sm text-dark-500 dark:text-[#94A3B8] mt-1">
            Scan your resume against target industry roles using our local AI model to evaluate ATS compatibility, identify keyword gaps, and receive recruiter-grade bullet point enhancements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-[rgba(88,101,242,0.35)] bg-white/70 dark:bg-[#10172A]/70 backdrop-blur-md text-xs font-bold text-[#5865F2] dark:text-[#00E5FF] hover:bg-[#5865F2]/10 transition-all cursor-pointer shadow-sm flex items-center space-x-2"
        >
          <FiBookOpen />
          <span>Load Sample Resume</span>
        </button>
      </div>

      {/* Input Section */}
      <Card className="relative overflow-hidden">
        <div className="space-y-6">
          {/* Target Role Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-600 dark:text-[#94A3B8] mb-2 flex items-center space-x-1.5">
              <FiTarget className="text-[#00E5FF]" />
              <span>Target Job Role</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {POPULAR_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    targetRole === role
                      ? 'bg-gradient-to-r from-[#5865F2] to-[#00E5FF] text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                      : 'bg-dark-100 dark:bg-[#17223B]/60 text-dark-600 dark:text-[#94A3B8] hover:text-dark-900 dark:hover:text-white border border-transparent hover:border-[rgba(88,101,242,0.3)]'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Or enter custom role (e.g., SDE-2, DevOps Architect)"
              className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-[rgba(88,101,242,0.25)] bg-white dark:bg-[#080B16]/80 text-dark-900 dark:text-white text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
            />
          </div>

          {/* Resume Text Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-600 dark:text-[#94A3B8] flex items-center space-x-1.5">
                <FiFileText className="text-[#A855F7]" />
                <span>Resume Text / Plaintext Copy</span>
              </label>
              <span className="text-[11px] text-dark-400 dark:text-[#64748B]">
                {resumeText.length} characters
              </span>
            </div>
            <textarea
              rows={9}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your plain-text resume here (include Education, Skills, Projects, Experience, and Achievements)..."
              className="w-full p-4 rounded-2xl border border-dark-200 dark:border-[rgba(88,101,242,0.25)] bg-white dark:bg-[#080B16]/80 text-dark-900 dark:text-white font-mono text-xs leading-relaxed focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all resize-y"
            />
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center space-x-2">
              <FiAlertTriangle className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end">
            <Button
              onClick={handleAnalyze}
              loading={loading}
              size="lg"
              className="w-full sm:w-auto"
            >
              <FiZap className="mr-2" />
              <span>{loading ? 'AI Scanning Resume...' : 'Analyze Resume with AI'}</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Analysis Results Display */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ATS Score Gauge Card */}
            <Card className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-white/90 to-primary-50/30 dark:from-[#10172A]/90 dark:to-[#080B16]/90">
              <span className="text-xs font-bold uppercase tracking-widest text-dark-500 dark:text-[#94A3B8] mb-3">
                ATS Compatibility Score
              </span>
              <div className="relative flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-dark-200 dark:text-dark-800"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * (analysis.atsScore || 70)) / 100}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ${
                      analysis.atsScore >= 80
                        ? 'text-[#00E5FF]'
                        : analysis.atsScore >= 60
                        ? 'text-[#A855F7]'
                        : 'text-amber-400'
                    }`}
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-dark-900 dark:text-white">
                    {analysis.atsScore || 70}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-dark-400 dark:text-[#94A3B8]">
                    out of 100
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    analysis.atsScore >= 80
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : analysis.atsScore >= 60
                      ? 'bg-[#5865F2]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {analysis.readinessLevel || 'Moderate Readiness'}
                </span>
              </div>
            </Card>

            {/* Target Role & Summary Card */}
            <Card className="md:col-span-2 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-dark-500 dark:text-[#94A3B8]">
                    Target Profile Match
                  </span>
                  <span className="text-xs font-bold text-[#00E5FF] px-2.5 py-1 rounded-lg bg-[#5865F2]/15 border border-[#5865F2]/30">
                    {analysis.targetRole || targetRole}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">
                  Executive Assessment
                </h3>
                <p className="text-sm text-dark-600 dark:text-[#94A3B8] leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* Missing Keywords Section */}
              <div className="pt-4 border-t border-dark-100 dark:border-[rgba(88,101,242,0.2)]">
                <span className="block text-xs font-bold uppercase tracking-widest text-[#A855F7] mb-2 flex items-center space-x-1.5">
                  <FiAlertTriangle />
                  <span>High-Priority Missing Keywords for ATS Screening</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords?.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#A855F7]/15 border border-[#A855F7]/35 text-[#A855F7] dark:text-[#D8B4FE]"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Strengths & Actionable Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Strengths */}
            <Card className="p-6">
              <h3 className="text-md font-bold text-dark-900 dark:text-white mb-4 flex items-center space-x-2 text-emerald-500 dark:text-emerald-400">
                <FiCheckCircle size={20} />
                <span>Identified Resume Strengths</span>
              </h3>
              <ul className="space-y-3">
                {analysis.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-dark-700 dark:text-[#CBD5E1]">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      ✓
                    </span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Recruiter-Grade Actionable Improvements */}
            <Card className="p-6">
              <h3 className="text-md font-bold text-dark-900 dark:text-white mb-4 flex items-center space-x-2 text-[#00E5FF]">
                <FiTrendingUp size={20} />
                <span>Actionable Metric-Driven Improvements</span>
              </h3>
              <ul className="space-y-3">
                {analysis.actionableImprovements?.map((imp, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-dark-700 dark:text-[#CBD5E1]">
                    <span className="h-5 w-5 rounded-full bg-[#5865F2]/20 text-[#00E5FF] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Section-by-Section Review */}
          {analysis.sectionFeedback && (
            <Card className="p-6">
              <h3 className="text-md font-bold text-dark-900 dark:text-white mb-4 flex items-center space-x-2">
                <FiLayers className="text-[#5865F2]" />
                <span>Section-by-Section Technical Review</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-dark-100 dark:border-[rgba(88,101,242,0.2)] bg-dark-50/60 dark:bg-[#080B16]/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00E5FF] block mb-1">
                    Projects Section
                  </span>
                  <p className="text-xs text-dark-600 dark:text-[#94A3B8] leading-relaxed">
                    {analysis.sectionFeedback.projects || 'Projects are well documented.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-dark-100 dark:border-[rgba(88,101,242,0.2)] bg-dark-50/60 dark:bg-[#080B16]/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7] block mb-1">
                    Skills Breakdown
                  </span>
                  <p className="text-xs text-dark-600 dark:text-[#94A3B8] leading-relaxed">
                    {analysis.sectionFeedback.skills || 'Categorization is strong.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-dark-100 dark:border-[rgba(88,101,242,0.2)] bg-dark-50/60 dark:bg-[#080B16]/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5865F2] block mb-1">
                    Work / Internships
                  </span>
                  <p className="text-xs text-dark-600 dark:text-[#94A3B8] leading-relaxed">
                    {analysis.sectionFeedback.experience || 'Industry exposure outlined.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-dark-100 dark:border-[rgba(88,101,242,0.2)] bg-dark-50/60 dark:bg-[#080B16]/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Education & Courses
                  </span>
                  <p className="text-xs text-dark-600 dark:text-[#94A3B8] leading-relaxed">
                    {analysis.sectionFeedback.education || 'Academic metrics clear.'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ResumeAnalyser;

