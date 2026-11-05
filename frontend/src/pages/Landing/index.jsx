import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCpu,
  FiTrendingUp,
  FiMap,
  FiBriefcase,
  FiArrowRight,
  FiSun,
  FiMoon,
  FiShield,
  FiZap,
} from 'react-icons/fi';
import Button from '../../components/common/Button';
import SplineRobot from '../../components/common/SplineRobot';
import PlacementIQLogo from '../../components/common/PlacementIQLogo';
import { useTheme } from '../../context/ThemeContext';

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen text-dark-900 dark:text-white overflow-hidden relative transition-colors duration-300">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-dark-200/60 dark:border-[rgba(88,101,242,0.2)] relative z-20 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <PlacementIQLogo size={40} />
          <span className="text-xl font-black bg-gradient-to-r from-dark-900 via-[#5865F2] to-[#00E5FF] dark:from-white dark:via-[#00E5FF] dark:to-[#A855F7] bg-clip-text text-transparent tracking-tight">
            PlacementIQ
          </span>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-dark-200 dark:border-[rgba(88,101,242,0.3)] bg-white/80 dark:bg-[#10172A]/80 backdrop-blur-md text-dark-600 dark:text-[#00E5FF] hover:text-dark-900 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-[#17223B] shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun className="h-4.5 w-4.5 text-[#00E5FF]" /> : <FiMoon className="h-4.5 w-4.5 text-[#5865F2]" />}
          </button>

          <Link
            to="/login"
            className="text-sm font-semibold text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-[#00E5FF] transition-all"
          >
            Sign In
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Main Hero Section with Spline 3D Robot */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* Left Column: Heading and Description */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 text-center lg:text-left space-y-6"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[rgba(0,229,255,0.4)] bg-[rgba(88,101,242,0.12)] text-[#00E5FF] text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.25)]"
            >
              <FiZap className="animate-pulse" />
              <span>AI-Powered Career Intelligence</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-dark-900 dark:text-white"
            >
              Predict Your Placement.{' '}
              <span className="block mt-1 bg-gradient-to-r from-[#5865F2] via-[#A855F7] to-[#00E5FF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,229,255,0.35)]">
                Elevate Your Career.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-dark-600 dark:text-[#94A3B8] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Analyze your profile against thousands of verified university placement datasets. Get instant ML placement probability, expected CTC packages, Explainable AI insights, and an AI learning roadmap.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Predict Now <FiArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  View Demo Dashboard
                </Button>
              </Link>
            </motion.div>

            {/* Quick Stats Pill Badges */}
            <motion.div
              variants={itemVariants}
              className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-dark-500 dark:text-[#94A3B8]"
            >
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-[#10172A]/70 border border-dark-200 dark:border-[rgba(88,101,242,0.25)]">
                <span className="h-2 w-2 rounded-full bg-[#00E5FF] animate-ping" />
                <span>Dual Random Forest ML</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-[#10172A]/70 border border-dark-200 dark:border-[rgba(88,101,242,0.25)]">
                <FiCpu className="text-[#A855F7]" />
                <span>Explainable AI (SHAP)</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-[#10172A]/70 border border-dark-200 dark:border-[rgba(88,101,242,0.25)]">
                <FiShield className="text-[#5865F2]" />
                <span>Ollama Career Mentor</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Spline 3D Animated Robot Floating Interactively */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 flex items-center justify-center relative min-h-[500px] lg:min-h-[620px]"
          >
            <SplineRobot
              height="600px"
              className="w-full"
            />
          </motion.div>
        </div>

        {/* Feature Grid with Futuristic Glow Cards */}
        <section className="mt-24 sm:mt-32 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-dark-200/80 dark:border-[rgba(88,101,242,0.25)] bg-white/80 dark:bg-[#10172A]/75 backdrop-blur-xl shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-left space-y-4 hover:border-[#00E5FF] hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] transition-all group">
            <div className="p-3 bg-primary-50 dark:bg-[rgba(88,101,242,0.15)] border border-primary-200 dark:border-[rgba(88,101,242,0.3)] text-[#5865F2] dark:text-[#00E5FF] rounded-xl w-fit group-hover:scale-110 transition-transform">
              <FiCpu size={22} />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white">Placement Probability</h3>
            <p className="text-sm text-dark-600 dark:text-[#94A3B8]">
              Run your academic records, projects, and skills through our ML model to check your hiring probability.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-dark-200/80 dark:border-[rgba(88,101,242,0.25)] bg-white/80 dark:bg-[#10172A]/75 backdrop-blur-xl shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-left space-y-4 hover:border-[#A855F7] hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] transition-all group">
            <div className="p-3 bg-purple-50 dark:bg-[rgba(168,85,247,0.15)] border border-purple-200 dark:border-[rgba(168,85,247,0.3)] text-[#A855F7] rounded-xl w-fit group-hover:scale-110 transition-transform">
              <FiTrendingUp size={22} />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white">Salary Estimation</h3>
            <p className="text-sm text-dark-600 dark:text-[#94A3B8]">
              Estimate your expected package based on historical placement distributions and skill alignments.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-dark-200/80 dark:border-[rgba(88,101,242,0.25)] bg-white/80 dark:bg-[#10172A]/75 backdrop-blur-xl shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-left space-y-4 hover:border-[#00E5FF] hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] transition-all group">
            <div className="p-3 bg-emerald-50 dark:bg-[rgba(0,229,255,0.15)] border border-emerald-200 dark:border-[rgba(0,229,255,0.3)] text-[#00E5FF] rounded-xl w-fit group-hover:scale-110 transition-transform">
              <FiMap size={22} />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white">Roadmap Generator</h3>
            <p className="text-sm text-dark-600 dark:text-[#94A3B8]">
              Receive a step-by-step personalized learning roadmap mapping directly to your profile weaknesses.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-dark-200/80 dark:border-[rgba(88,101,242,0.25)] bg-white/80 dark:bg-[#10172A]/75 backdrop-blur-xl shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-left space-y-4 hover:border-[#5865F2] hover:shadow-[0_0_25px_rgba(88,101,242,0.25)] transition-all group">
            <div className="p-3 bg-rose-50 dark:bg-[rgba(88,101,242,0.15)] border border-rose-200 dark:border-[rgba(88,101,242,0.3)] text-[#5865F2] rounded-xl w-fit group-hover:scale-110 transition-transform">
              <FiBriefcase size={22} />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white">Company Eligibility</h3>
            <p className="text-sm text-dark-600 dark:text-[#94A3B8]">
              Check your eligibility status and criteria breakdown for top-tier hiring companies.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
