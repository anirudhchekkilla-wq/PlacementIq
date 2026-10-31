import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiCheckCircle, FiXCircle, FiBriefcase, FiAward, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import companyService from '../../services/companyService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

const Companies = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await companyService.getCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const isProfileComplete = user?.profile?.cgpa > 0;

  // Real-time eligibility evaluation helper
  const evaluateEligibility = (company) => {
    if (!isProfileComplete) {
      return { eligible: false, reasons: ['Profile academic parameters are not complete'] };
    }

    const p = user.profile;
    const reasons = [];

    // CGPA Check
    const cgpaOk = p.cgpa >= company.minCGPA;
    if (!cgpaOk) {
      reasons.push(`CGPA is ${p.cgpa} (Required: ${company.minCGPA})`);
    }

    // Backlog Check
    const backlogsOk = p.backlogs <= company.maxBacklogs;
    if (!backlogsOk) {
      reasons.push(`You have ${p.backlogs} active backlogs (Max allowed: ${company.maxBacklogs})`);
    }

    // Skills Check
    const studentSkills = [
      p.codingSkills?.dsa >= 60 ? 'Data Structures & Algorithms' : '',
      p.codingSkills?.communication >= 60 ? 'Communication' : '',
      p.codingSkills?.aptitude >= 60 ? 'Aptitude & Reasoning' : '',
      p.codingSkills?.systemDesign >= 60 ? 'System Design' : '',
      p.codingSkills?.mlKnowledge >= 60 ? 'Machine Learning' : '',
    ].filter(Boolean);

    // Map company required skills to matches
    const skillMatches = company.requiredSkills.map(skill => {
      // Fuzzy match or exact match
      const hasSkill = studentSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()));
      return { name: skill, matched: hasSkill };
    });

    const missingSkills = skillMatches.filter(s => !s.matched).map(s => s.name);
    if (missingSkills.length > 0) {
      reasons.push(`Missing required skills: ${missingSkills.join(', ')}`);
    }

    const eligible = cgpaOk && backlogsOk && missingSkills.length === 0;

    return {
      eligible,
      reasons,
      checks: {
        cgpa: { ok: cgpaOk, current: p.cgpa, required: company.minCGPA },
        backlogs: { ok: backlogsOk, current: p.backlogs, required: company.maxBacklogs },
        skills: skillMatches,
      }
    };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 4].map((i) => (
          <Card key={i} className="h-64 animate-pulse bg-dark-100 dark:bg-dark-900" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-dark-900 dark:text-white">
          Eligible Hiring Partners
        </h2>
        <p className="text-sm text-dark-500 dark:text-dark-400">
          Check your real-time criteria eligibility breakdown for active technology companies.
        </p>
      </div>

      {!isProfileComplete && (
        <Card className="border-amber-200 bg-amber-50/20 dark:border-amber-900/50 dark:bg-amber-950/10 flex items-center space-x-4 p-4 rounded-xl">
          <FiAlertCircle className="text-amber-500 shrink-0" size={24} />
          <div className="flex-1 text-xs md:text-sm text-amber-700 dark:text-amber-400 font-medium">
            Complete your college academic scorecards and coding rating scales in your Profile to check eligibility.
          </div>
          <Link to="/profile">
            <Button size="sm">Go to Profile</Button>
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company) => {
          const { eligible, reasons, checks } = evaluateEligibility(company);

          return (
            <Card
              key={company._id || company.name}
              className={`flex flex-col justify-between hover:shadow-lg transition-smooth ${
                isProfileComplete
                  ? eligible
                    ? 'border-green-200 dark:border-green-950/20'
                    : 'border-red-200 dark:border-red-950/20'
                  : ''
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold text-dark-900 dark:text-white flex items-center gap-1.5">
                      <FiBriefcase className="text-primary-500" size={18} /> {company.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-[10px] text-dark-500">
                      <span>Salary: ₹{company.salary} LPA</span>
                      <span>•</span>
                      <span>Branches: {company.branches.join(', ')}</span>
                    </div>
                  </div>

                  {isProfileComplete && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        eligible
                          ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                          : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                      }`}
                    >
                      {eligible ? 'Eligible' : 'Ineligible'}
                    </span>
                  )}
                </div>

                {/* Eligibility Breakdown */}
                {isProfileComplete && checks && (
                  <div className="border-y border-dark-100 dark:border-dark-800/60 py-3.5 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-dark-400 block">
                      Criteria Breakdown
                    </span>

                    {/* CGPA */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-dark-700 dark:text-dark-300">
                        {checks.cgpa.ok ? (
                          <FiCheckCircle className="text-green-500" />
                        ) : (
                          <FiXCircle className="text-red-500" />
                        )}
                        <span>CGPA requirement (Min: {checks.cgpa.required})</span>
                      </div>
                      <span className="font-bold text-dark-950 dark:text-white">
                        {checks.cgpa.current.toFixed(2)}
                      </span>
                    </div>

                    {/* Backlogs */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-dark-700 dark:text-dark-300">
                        {checks.backlogs.ok ? (
                          <FiCheckCircle className="text-green-500" />
                        ) : (
                          <FiXCircle className="text-red-500" />
                        )}
                        <span>Backlog Limit (Max: {checks.backlogs.required})</span>
                      </div>
                      <span className="font-bold text-dark-950 dark:text-white">
                        {checks.backlogs.current}
                      </span>
                    </div>

                    {/* Skills */}
                    {checks.skills && checks.skills.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-dark-500 block">Required Skills Match:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {checks.skills.map((s) => (
                            <span
                              key={s.name}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                s.matched
                                  ? 'bg-green-50/50 text-green-600 border border-green-200 dark:bg-green-950/10 dark:text-green-400 dark:border-green-900/40'
                                  : 'bg-red-50/50 text-red-600 border border-red-200 dark:bg-red-950/10 dark:text-red-400 dark:border-red-900/40'
                              }`}
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Reasons if Not Eligible */}
              {isProfileComplete && !eligible && reasons && reasons.length > 0 && (
                <div className="mt-4 p-3 bg-red-50/10 dark:bg-red-950/5 rounded-lg border border-red-200/50 dark:border-red-950/30">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide block mb-1">
                    Issues to Solve:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-dark-600 dark:text-dark-400 space-y-0.5">
                    {reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Apply / Career path Link */}
              {isProfileComplete && (
                <div className="pt-4 mt-4 border-t border-dark-100 dark:border-dark-800/40">
                  {eligible ? (
                    <Button className="w-full text-xs py-1.5 bg-green-600 hover:bg-green-700">
                      Apply Now <FiArrowRight className="ml-1.5" />
                    </Button>
                  ) : (
                    <Link to="/roadmap" className="w-full">
                      <Button variant="outline" className="w-full text-xs py-1.5 border-red-200 hover:bg-red-50/20 text-red-600 dark:border-red-950/40 dark:text-red-400 dark:hover:bg-red-950/10">
                        Check Roadmap Guide
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Companies;
