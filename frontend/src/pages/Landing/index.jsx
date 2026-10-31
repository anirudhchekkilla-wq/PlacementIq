import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCpu, FiTrendingUp, FiMap, FiBriefcase, FiArrowRight, FiSun, FiMoon } from 'react-icons/fi';
import Button from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white overflow-hidden relative transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-400/15 dark:bg-primary-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/15 dark:bg-indigo-900/20 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-dark-200/60 dark:border-white/5 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20 text-lg">
            P
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-dark-900 to-primary-600 dark:from-white dark:to-dark-300 bg-clip-text text-transparent tracking-tight">
            PlacementIQ
          </span>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-dark-200 dark:border-white/10 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-white/5 transition-all cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun className="h-4.5 w-4.5 text-amber-400" /> : <FiMoon className="h-4.5 w-4.5 text-primary-600" />}
          </button>

          <Link to="/login" className="text-sm font-semibold text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white transition-smooth">
            Sign In
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-primary-500/30 bg-primary-100/60 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider"
          >
            <FiCpu className="animate-pulse" />
            <span>AI-Powered Career Intelligence</span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-dark-950 via-dark-800 to-dark-600 dark:from-white dark:to-dark-400 bg-clip-text text-transparent leading-none"
          >
            Predict Your Placement.<br />
            <span className="bg-gradient-to-r from-primary-500 to-indigo-500 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Elevate Your Career.
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed"
          >
            Analyze your profile against thousands of student datasets. Get placement probability, expected salary ranges, skill gap analysis, and a personalized roadmap instantly.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Predict Now <FiArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-dark-300 dark:border-white/10 hover:bg-dark-100 dark:hover:bg-white/5 text-dark-800 dark:text-white">
                View Demo Dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <section className="mt-32 w-full grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-dark-200/80 dark:border-white/5 bg-white/80 dark:bg-white/[0.02] shadow-sm dark:shadow-none backdrop-blur-md text-left space-y-4 hover:border-primary-500/30 hover:shadow-md transition-all">
            <div className="p-3 bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl w-fit">
              <FiCpu size={22} />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white">Placement Probability</h3>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              Run your academic records, projects, and skills through our ML model to check your hiring probability.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-dark-200/80 dark:border-white/5 bg-white/80 dark:bg-white/[0.02] shadow-sm dark:shadow-none backdrop-blur-md text-left space-y-4 hover:border-indigo-500/30 hover:shadow-md transition-all">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
              <FiTrendingUp size={22} />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white">Salary Estimation</h3>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              Estimate your expected package based on historical placement distributions and skill alignments.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-dark-200/80 dark:border-white/5 bg-white/80 dark:bg-white/[0.02] shadow-sm dark:shadow-none backdrop-blur-md text-left space-y-4 hover:border-emerald-500/30 hover:shadow-md transition-all">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
              <FiMap size={22} />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white">Roadmap Generator</h3>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              Receive a step-by-step personalized learning roadmap mapping directly to your profile weaknesses.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-dark-200/80 dark:border-white/5 bg-white/80 dark:bg-white/[0.02] shadow-sm dark:shadow-none backdrop-blur-md text-left space-y-4 hover:border-rose-500/30 hover:shadow-md transition-all">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl w-fit">
              <FiBriefcase size={22} />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white">Company Eligibility</h3>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              Check your eligibility status and criteria breakdown for top-tier hiring companies.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
