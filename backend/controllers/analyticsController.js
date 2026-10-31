import Prediction from '../models/Prediction.js';
import User from '../models/User.js';
import Company from '../models/Company.js';

// @desc    Get analytics for logged in student
// @route   GET /api/analytics
// @access  Private
export const getStudentAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all predictions for this student
    const predictions = await Prediction.find({ userId }).sort({ createdAt: 1 });

    if (!predictions || predictions.length === 0) {
      return res.json({
        hasData: false,
        message: 'No prediction history found. Run prediction first.',
      });
    }

    // Calculations
    const totalPredictions = predictions.length;
    const placedPredictions = predictions.filter((p) => p.prediction).length;
    const successRate = Math.round((placedPredictions / totalPredictions) * 100);
    
    // Average and max probability
    const avgProbability = Math.round(
      (predictions.reduce((acc, p) => acc + p.probability, 0) / totalPredictions) * 100
    );
    const maxProbability = Math.round(
      Math.max(...predictions.map((p) => p.probability)) * 100
    );

    // Expected package metrics
    const avgSalary =
      predictions.reduce((acc, p) => acc + p.expectedSalary, 0) / totalPredictions;
    const maxSalary = Math.max(...predictions.map((p) => p.expectedSalary));

    // Format data for timeline (line/area charts)
    const timelineData = predictions.map((p) => ({
      date: new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      probability: Math.round(p.probability * 100),
      salary: p.expectedSalary,
    }));

    // Format latest skills for radar/bar charts
    const latest = predictions[predictions.length - 1];
    const skillData = [
      { subject: 'DSA', score: latest.dsa, benchmark: 85 },
      { subject: 'Communication', score: latest.communication, benchmark: 80 },
      { subject: 'Aptitude', score: latest.aptitude, benchmark: 80 },
      { subject: 'Projects', score: Math.min(latest.projects * 25, 100), benchmark: 75 },
      { subject: 'Experience', score: Math.min(latest.internships * 50, 100), benchmark: 75 },
    ];

    res.json({
      hasData: true,
      stats: {
        totalPredictions,
        successRate,
        avgProbability,
        maxProbability,
        avgSalary: Math.round(avgSalary * 10) / 10,
        maxSalary: Math.round(maxSalary * 10) / 10,
      },
      timelineData,
      skillData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform-wide admin analytics
// @route   GET /api/analytics/admin
// @access  Private/Admin
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalPredictions = await Prediction.countDocuments();
    const totalCompanies = await Company.countDocuments();

    // Overall Success rate
    const predictions = await Prediction.find({});
    const totalRuns = predictions.length;
    const placedRuns = predictions.filter((p) => p.prediction).length;
    const overallSuccessRate = totalRuns > 0 ? Math.round((placedRuns / totalRuns) * 100) : 0;

    // Average salary package
    const avgSalary = totalRuns > 0 
      ? Math.round((predictions.reduce((acc, p) => acc + p.expectedSalary, 0) / totalRuns) * 10) / 10
      : 0;

    // Calculate average skills across all students
    const usersWithProfile = await User.find({ 'profile.cgpa': { $gt: 0 } });
    let skillAverages = { dsa: 0, communication: 0, aptitude: 0, systemDesign: 0, mlKnowledge: 0 };
    
    if (usersWithProfile.length > 0) {
      usersWithProfile.forEach((u) => {
        skillAverages.dsa += u.profile.codingSkills?.dsa || 0;
        skillAverages.communication += u.profile.codingSkills?.communication || 0;
        skillAverages.aptitude += u.profile.codingSkills?.aptitude || 0;
        skillAverages.systemDesign += u.profile.codingSkills?.systemDesign || 0;
        skillAverages.mlKnowledge += u.profile.codingSkills?.mlKnowledge || 0;
      });

      const count = usersWithProfile.length;
      skillAverages.dsa = Math.round(skillAverages.dsa / count);
      skillAverages.communication = Math.round(skillAverages.communication / count);
      skillAverages.aptitude = Math.round(skillAverages.aptitude / count);
      skillAverages.systemDesign = Math.round(skillAverages.systemDesign / count);
      skillAverages.mlKnowledge = Math.round(skillAverages.mlKnowledge / count);
    }

    // Weakest skills rank
    const weakestSkills = Object.entries(skillAverages)
      .map(([key, val]) => ({ name: key.toUpperCase(), averageScore: val }))
      .sort((a, b) => a.averageScore - b.averageScore);

    res.json({
      totalUsers,
      totalPredictions,
      totalCompanies,
      overallSuccessRate,
      avgSalary,
      skillAverages,
      weakestSkills,
    });
  } catch (error) {
    next(error);
  }
};
