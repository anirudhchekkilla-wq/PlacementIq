import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiTrendingUp, FiCpu, FiAward, FiBook, FiCode, FiBriefcase } from 'react-icons/fi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import predictionService from '../../services/predictionService';

const Prediction = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cgpa: user?.profile?.cgpa || '',
      backlogs: user?.profile?.backlogs || 0,
      dsa: user?.profile?.codingSkills?.dsa || '',
      communication: user?.profile?.codingSkills?.communication || '',
      aptitude: user?.profile?.codingSkills?.aptitude || '',
      projects: user?.profile?.projects || 0,
      internships: user?.profile?.internships || 0,
      collegeTier: user?.profile?.collegeTier || 3,
    },
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const payload = {
        cgpa: parseFloat(data.cgpa),
        backlogs: parseInt(data.backlogs),
        dsa: parseInt(data.dsa),
        communication: parseInt(data.communication),
        aptitude: parseInt(data.aptitude),
        projects: parseInt(data.projects),
        internships: parseInt(data.internships),
        collegeTier: parseInt(data.collegeTier),
      };
      
      const result = await predictionService.predict(payload);
      
      // Update local profile state
      await updateProfile({
        profile: {
          cgpa: payload.cgpa,
          backlogs: payload.backlogs,
          codingSkills: {
            dsa: payload.dsa,
            communication: payload.communication,
            aptitude: payload.aptitude,
          },
          projects: payload.projects,
          internships: payload.internships,
          collegeTier: payload.collegeTier,
        }
      });

      // Redirect to results page, passing the prediction document
      navigate('/prediction/result', { state: { prediction: result } });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-dark-900 dark:text-white">
          Placement Predictor
        </h2>
        <p className="text-sm text-dark-500 dark:text-dark-400">
          Enter your current academic metrics and skill ratings to check your hiring outlook.
        </p>
      </div>

      <Card className="glass-panel">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Academics */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider flex items-center gap-2">
              <FiBook /> Academic Background
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Cumulative GPA (CGPA)"
                type="number"
                step="0.01"
                placeholder="e.g. 8.4"
                error={errors.cgpa}
                {...register('cgpa', {
                  required: 'CGPA is required',
                  min: { value: 0, message: 'CGPA cannot be negative' },
                  max: { value: 10, message: 'CGPA cannot exceed 10.0' },
                })}
              />

              <Input
                label="Active Backlogs"
                type="number"
                placeholder="e.g. 0"
                error={errors.backlogs}
                {...register('backlogs', {
                  required: 'Backlogs field is required',
                  min: { value: 0, message: 'Backlogs cannot be negative' },
                })}
              />

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wider">
                  College Tier
                </label>
                <select
                  className="block w-full rounded-lg border border-dark-200 dark:border-dark-800 text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-900 text-dark-900 dark:text-white"
                  {...register('collegeTier', { required: true })}
                >
                  <option value={1}>Tier 1 (IITs, NITs, Top Universities)</option>
                  <option value={2}>Tier 2 (State Govt Colleges, Reputed Private)</option>
                  <option value={3}>Tier 3 (Other affiliated colleges)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Technical & Soft Skills */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider flex items-center gap-2">
              <FiCode /> Skill Assessment (Scores out of 100)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="DSA Rating"
                type="number"
                placeholder="e.g. 75"
                error={errors.dsa}
                {...register('dsa', {
                  required: 'DSA rating is required',
                  min: { value: 0, message: 'Cannot be negative' },
                  max: { value: 100, message: 'Cannot exceed 100' },
                })}
              />

              <Input
                label="Communication Rating"
                type="number"
                placeholder="e.g. 80"
                error={errors.communication}
                {...register('communication', {
                  required: 'Communication score is required',
                  min: { value: 0, message: 'Cannot be negative' },
                  max: { value: 100, message: 'Cannot exceed 100' },
                })}
              />

              <Input
                label="Aptitude & Reasoning"
                type="number"
                placeholder="e.g. 85"
                error={errors.aptitude}
                {...register('aptitude', {
                  required: 'Aptitude score is required',
                  min: { value: 0, message: 'Cannot be negative' },
                  max: { value: 100, message: 'Cannot exceed 100' },
                })}
              />
            </div>
          </div>

          {/* Section 3: Internships & Projects */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider flex items-center gap-2">
              <FiBriefcase /> Projects & Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Number of Projects Built"
                type="number"
                placeholder="e.g. 3"
                error={errors.projects}
                {...register('projects', {
                  required: 'Projects count is required',
                  min: { value: 0, message: 'Cannot be negative' },
                })}
              />

              <Input
                label="Number of Internships Completed"
                type="number"
                placeholder="e.g. 1"
                error={errors.internships}
                {...register('internships', {
                  required: 'Internships count is required',
                  min: { value: 0, message: 'Cannot be negative' },
                })}
              />
            </div>
          </div>

          <div className="border-t border-dark-200 dark:border-dark-800 pt-6 flex justify-end">
            <Button type="submit" size="lg" loading={loading} className="px-8">
              Generate AI Analysis <FiCpu className="ml-2" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Prediction;
