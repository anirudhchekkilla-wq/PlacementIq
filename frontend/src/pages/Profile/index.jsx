import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { FiCheckCircle, FiUser, FiBook, FiCode, FiAward, FiBriefcase } from 'react-icons/fi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      college: user?.profile?.college || '',
      branch: user?.profile?.branch || '',
      collegeTier: user?.profile?.collegeTier || 3,
      cgpa: user?.profile?.cgpa || '',
      backlogs: user?.profile?.backlogs || 0,
      dsa: user?.profile?.codingSkills?.dsa || 0,
      communication: user?.profile?.codingSkills?.communication || 0,
      aptitude: user?.profile?.codingSkills?.aptitude || 0,
      systemDesign: user?.profile?.codingSkills?.systemDesign || 0,
      mlKnowledge: user?.profile?.codingSkills?.mlKnowledge || 0,
      internships: user?.profile?.internships || 0,
      projects: user?.profile?.projects || 0,
      certifications: user?.profile?.certifications || 0,
      hackathons: user?.profile?.hackathons || 0,
      openSource: user?.profile?.openSource || 0,
      extracurricular: user?.profile?.extracurricular || 0,
    },
  });

  const onSubmit = async (data) => {
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);
    try {
      await updateProfile({
        name: data.name,
        profile: {
          college: data.college,
          branch: data.branch,
          collegeTier: parseInt(data.collegeTier),
          cgpa: parseFloat(data.cgpa),
          backlogs: parseInt(data.backlogs),
          codingSkills: {
            dsa: parseInt(data.dsa),
            communication: parseInt(data.communication),
            aptitude: parseInt(data.aptitude),
            systemDesign: parseInt(data.systemDesign),
            mlKnowledge: parseInt(data.mlKnowledge),
          },
          internships: parseInt(data.internships),
          projects: parseInt(data.projects),
          certifications: parseInt(data.certifications),
          hackathons: parseInt(data.hackathons),
          openSource: parseInt(data.openSource),
          extracurricular: parseInt(data.extracurricular),
        },
      });
      setSuccessMsg('Academic profile successfully updated.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-dark-900 dark:text-white">
          My Academic Profile
        </h2>
        <p className="text-sm text-dark-500 dark:text-dark-400">
          Manage your academic parameters, technical skills ratings, and accomplishments.
        </p>
      </div>

      {successMsg && (
        <Card className="border-green-200 bg-green-50/20 dark:border-green-950/20 dark:bg-green-950/10 flex items-center space-x-2.5 p-4 rounded-xl">
          <FiCheckCircle className="text-green-500" size={20} />
          <span className="text-xs md:text-sm text-green-700 dark:text-green-400 font-semibold">
            {successMsg}
          </span>
        </Card>
      )}

      {errorMsg && (
        <Card className="border-red-200 bg-red-50/20 dark:border-red-900/50 dark:bg-red-950/10 flex items-center space-x-2.5 p-4 rounded-xl">
          <FiCheckCircle className="text-red-500" size={20} />
          <span className="text-xs md:text-sm text-red-700 dark:text-red-400 font-semibold">
            {errorMsg}
          </span>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic & Academics */}
        <Card className="space-y-6">
          <h3 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider flex items-center gap-2 border-b border-dark-100 dark:border-dark-850 pb-3">
            <FiBook /> General & Academic Background
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              error={errors.name}
              {...register('name', { required: 'Name is required' })}
            />
            <Input
              label="College Name"
              type="text"
              placeholder="e.g. Stanford University"
              error={errors.college}
              {...register('college', { required: 'College name is required' })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Department/Branch"
                type="text"
                placeholder="e.g. Computer Science"
                error={errors.branch}
                {...register('branch', { required: 'Branch is required' })}
              />
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wider">
                College Tier
              </label>
              <select
                className="block w-full rounded-lg border border-dark-200 dark:border-dark-800 text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-900 text-dark-900 dark:text-white"
                {...register('collegeTier', { required: true })}
              >
                <option value={1}>Tier 1</option>
                <option value={2}>Tier 2</option>
                <option value={3}>Tier 3</option>
              </select>
            </div>

            <Input
              label="CGPA"
              type="number"
              step="0.01"
              error={errors.cgpa}
              {...register('cgpa', {
                required: 'CGPA is required',
                min: { value: 0, message: 'Invalid' },
                max: { value: 10, message: 'Max 10.0' },
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Active Backlogs"
              type="number"
              error={errors.backlogs}
              {...register('backlogs', { required: 'Required', min: 0 })}
            />
          </div>
        </Card>

        {/* Section 2: Technical Ratings */}
        <Card className="space-y-6">
          <h3 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider flex items-center gap-2 border-b border-dark-100 dark:border-dark-850 pb-3">
            <FiCode /> Skill Ratings Matrix (Out of 100)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="DSA Score"
              type="number"
              error={errors.dsa}
              {...register('dsa', { min: 0, max: 100 })}
            />
            <Input
              label="Communication"
              type="number"
              error={errors.communication}
              {...register('communication', { min: 0, max: 100 })}
            />
            <Input
              label="Aptitude"
              type="number"
              error={errors.aptitude}
              {...register('aptitude', { min: 0, max: 100 })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="System Design Score"
              type="number"
              error={errors.systemDesign}
              {...register('systemDesign', { min: 0, max: 100 })}
            />
            <Input
              label="Machine Learning Knowledge"
              type="number"
              error={errors.mlKnowledge}
              {...register('mlKnowledge', { min: 0, max: 100 })}
            />
          </div>
        </Card>

        {/* Section 3: Activities & Accomplishments */}
        <Card className="space-y-6">
          <h3 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider flex items-center gap-2 border-b border-dark-100 dark:border-dark-850 pb-3">
            <FiAward /> Experience & Accomplishments
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Internships Completed"
              type="number"
              error={errors.internships}
              {...register('internships', { min: 0 })}
            />
            <Input
              label="Projects Completed"
              type="number"
              error={errors.projects}
              {...register('projects', { min: 0 })}
            />
            <Input
              label="Certifications Count"
              type="number"
              error={errors.certifications}
              {...register('certifications', { min: 0 })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Hackathons Participated"
              type="number"
              error={errors.hackathons}
              {...register('hackathons', { min: 0 })}
            />
            <Input
              label="Open Source Contributions"
              type="number"
              error={errors.openSource}
              {...register('openSource', { min: 0 })}
            />
            <Input
              label="Extracurricular Events"
              type="number"
              error={errors.extracurricular}
              {...register('extracurricular', { min: 0 })}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="px-8" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
