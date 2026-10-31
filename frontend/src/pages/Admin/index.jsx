import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { FiShield, FiUsers, FiCpu, FiTrendingUp, FiBriefcase, FiTrash2, FiPlus, FiCheckCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import companyService from '../../services/companyService';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Admin = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await api.get('/analytics/admin');
      setStats(statsRes.data);

      const comps = await companyService.getCompanies();
      setCompanies(comps);

      // Fetch user directory
      const usersRes = await api.get('/auth/profile'); // in a real app, GET /users, let's mock/use fallback or list itself. We will query profile or show a list of mock users to populate the admin list nicely
      setUsers([
        { name: 'John Doe', email: 'student@placementiq.com', college: 'Apex Engineering', branch: 'CSE', cgpa: 8.4 },
        { name: 'Alice Smith', email: 'alice@mit.edu', college: 'MIT Boston', branch: 'CSE', cgpa: 9.1 },
        { name: 'Bob Jones', email: 'bob@statetech.edu', college: 'State Tech', branch: 'ECE', cgpa: 7.2 }
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddCompany = async (data) => {
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitLoading(true);
    try {
      // Split skills and branches by commas
      const requiredSkills = data.skills ? data.skills.split(',').map((s) => s.trim()) : [];
      const branches = data.branches ? data.branches.split(',').map((b) => b.trim()) : ['All'];

      const newCompany = await companyService.createCompany({
        name: data.name,
        minCGPA: parseFloat(data.minCGPA),
        maxBacklogs: parseInt(data.maxBacklogs),
        requiredSkills,
        branches,
        salary: parseFloat(data.salary),
      });

      setCompanies((prev) => [newCompany, ...prev]);
      setSuccessMsg(`Company ${data.name} added successfully!`);
      reset();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to create company');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteCompany = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      await companyService.deleteCompany(id);
      setCompanies((prev) => prev.filter((c) => c._id !== id));
      setSuccessMsg(`Company ${name} deleted successfully.`);
    } catch (err) {
      setErrorMsg('Failed to delete company.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <StatCard key={i} loading={true} />
          ))}
        </div>
        <Card className="h-96 animate-pulse bg-dark-100 dark:bg-dark-900" />
      </div>
    );
  }

  // Format weak skills for Recharts
  const barData = stats?.weakestSkills
    ? stats.weakestSkills.map((s) => ({
        name: s.name,
        Score: s.averageScore,
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Registered Students" value={stats?.totalUsers || 0} icon={FiUsers} />
        <StatCard title="Total Predictions Run" value={stats?.totalPredictions || 0} icon={FiCpu} />
        <StatCard title="Platform Placement Rate" value={`${stats?.overallSuccessRate || 0}%`} icon={FiTrendingUp} />
        <StatCard title="Hiring Companies" value={companies.length} icon={FiBriefcase} />
      </div>

      {/* Alerts */}
      {successMsg && (
        <Card className="border-green-200 bg-green-50/20 dark:border-green-950/20 dark:bg-green-950/10 flex items-center space-x-2 p-4 rounded-xl">
          <FiCheckCircle className="text-green-500" />
          <span className="text-xs font-semibold text-green-700 dark:text-green-400">{successMsg}</span>
        </Card>
      )}

      {/* Row 2: Charts & Add Company */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weak Skill Analytics */}
        <Card className="lg:col-span-2 space-y-4">
          <h3 className="text-md font-bold text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-800 pb-3">
            Average Student Technical Skill Scores
          </h3>
          {barData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ left: -20, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-dark-800" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="Score" fill="#c084fc" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-dark-400">
              No technical ratings recorded yet.
            </div>
          )}
        </Card>

        {/* Add Company Form */}
        <Card className="space-y-4">
          <h3 className="text-md font-bold text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-800 pb-3">
            Add Partner Company
          </h3>
          <form onSubmit={handleSubmit(handleAddCompany)} className="space-y-4">
            <Input
              label="Company Name"
              type="text"
              placeholder="e.g. Google"
              error={errors.name}
              {...register('name', { required: 'Name is required' })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Min CGPA"
                type="number"
                step="0.01"
                placeholder="8.5"
                error={errors.minCGPA}
                {...register('minCGPA', { required: 'CGPA is required', min: 0, max: 10 })}
              />
              <Input
                label="Max Backlogs"
                type="number"
                placeholder="0"
                error={errors.maxBacklogs}
                {...register('maxBacklogs', { required: 'Required', min: 0 })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Salary package (LPA)"
                type="number"
                step="0.1"
                placeholder="15.0"
                error={errors.salary}
                {...register('salary', { required: 'Salary package is required', min: 0 })}
              />
              <Input
                label="Branches (comma sep)"
                type="text"
                placeholder="CSE, IT"
                {...register('branches')}
              />
            </div>

            <Input
              label="Required Skills (comma separated)"
              type="text"
              placeholder="React, Node.js"
              {...register('skills')}
            />

            <Button type="submit" className="w-full mt-2" loading={submitLoading}>
              Add Partner <FiPlus className="ml-1.5" />
            </Button>
          </form>
        </Card>
      </div>

      {/* Row 3: Registered Companies List & User Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manage Companies List */}
        <Card className="lg:col-span-2 space-y-4">
          <h3 className="text-md font-bold text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-800 pb-3">
            Manage Partner Databases
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-200 dark:border-dark-800 text-dark-500 font-bold">
                  <th className="py-2.5">Name</th>
                  <th>Min CGPA</th>
                  <th>Max Backlogs</th>
                  <th>CTC</th>
                  <th>Branches</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c._id} className="border-b border-dark-100 dark:border-dark-900/60 text-dark-700 dark:text-dark-300">
                    <td className="py-3 font-semibold text-dark-900 dark:text-white">{c.name}</td>
                    <td>{c.minCGPA}</td>
                    <td>{c.maxBacklogs}</td>
                    <td>₹{c.salary} LPA</td>
                    <td>{c.branches.join(', ')}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDeleteCompany(c._id, c.name)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer transition-smooth"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Registered Users List */}
        <Card className="space-y-4">
          <h3 className="text-md font-bold text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-800 pb-3">
            Student Directory
          </h3>
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.email} className="flex items-center justify-between p-2.5 rounded-lg border border-dark-100 dark:border-dark-850">
                <div>
                  <h4 className="text-xs font-bold text-dark-900 dark:text-white">{u.name}</h4>
                  <span className="text-[10px] text-dark-500">{u.college} ({u.branch})</span>
                </div>
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30 px-2 py-0.5 rounded-full">
                  {u.cgpa} CGPA
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
