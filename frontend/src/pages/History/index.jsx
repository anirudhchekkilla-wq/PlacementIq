import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCpu, FiClock, FiCheckCircle, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import predictionService from '../../services/predictionService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await predictionService.getHistory();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching prediction history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-32 animate-pulse bg-dark-100 dark:bg-dark-900" />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center text-center py-16 space-y-4 max-w-xl mx-auto glass-panel">
        <FiClock className="text-dark-300 dark:text-dark-700" size={48} />
        <h3 className="text-lg font-bold text-dark-900 dark:text-white">
          No Prediction History
        </h3>
        <p className="text-sm text-dark-500 dark:text-dark-400">
          You haven't run any placement predictions yet. Enter your metrics to see your historical trends.
        </p>
        <div className="pt-2">
          <Link to="/prediction">
            <Button>Predict Placement Now</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-dark-900 dark:text-white">
          Placement Prediction History
        </h2>
        <p className="text-sm text-dark-500 dark:text-dark-400">
          Track and review all your previous AI-generated placement outcome evaluations.
        </p>
      </div>

      <div className="space-y-4">
        {history.map((item) => {
          const probPct = Math.round(item.probability * 100);
          const isPlaced = item.prediction;

          return (
            <Card key={item._id} className="hover:border-primary-300 dark:hover:border-primary-800 transition-smooth">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Probability Outcome */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex items-center justify-center h-16 w-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        className="text-dark-100 dark:text-dark-800"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="28"
                        cx="32"
                        cy="32"
                      />
                      <circle
                        className={isPlaced ? "text-green-500" : "text-amber-500"}
                        strokeWidth="4"
                        strokeDasharray={176}
                        strokeDashoffset={176 - (176 * probPct) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="28"
                        cx="32"
                        cy="32"
                      />
                    </svg>
                    <span className="absolute text-sm font-extrabold text-dark-900 dark:text-white">
                      {probPct}%
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-bold text-dark-900 dark:text-white">
                        {isPlaced ? 'Placed Outlook' : 'Needs Optimization'}
                      </span>
                      <span className={`h-2.5 w-2.5 rounded-full ${isPlaced ? 'bg-green-500' : 'bg-amber-500'}`} />
                    </div>
                    <span className="text-[10px] text-dark-400">
                      Run on {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Parameters Breakdown */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 flex-1 text-center bg-dark-50 dark:bg-dark-900/40 p-3 rounded-xl border border-dark-100 dark:border-dark-800/40">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-dark-400 block">CGPA</span>
                    <span className="text-xs font-bold text-dark-800 dark:text-dark-200">{item.cgpa}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-dark-400 block">Backlogs</span>
                    <span className="text-xs font-bold text-dark-800 dark:text-dark-200">{item.backlogs}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-dark-400 block">DSA</span>
                    <span className="text-xs font-bold text-dark-800 dark:text-dark-200">{item.dsa}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-dark-400 block">COMM</span>
                    <span className="text-xs font-bold text-dark-800 dark:text-dark-200">{item.communication}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-dark-400 block">APT</span>
                    <span className="text-xs font-bold text-dark-800 dark:text-dark-200">{item.aptitude}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-dark-400 block">PROJ</span>
                    <span className="text-xs font-bold text-dark-800 dark:text-dark-200">{item.projects}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-dark-400 block">INTERN</span>
                    <span className="text-xs font-bold text-dark-800 dark:text-dark-200">{item.internships}</span>
                  </div>
                </div>

                {/* Salary Package & Details Button */}
                <div className="flex items-center justify-between lg:flex-col lg:items-end lg:justify-center gap-4">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-dark-500 uppercase">Estimated Salary</span>
                    <h4 className="text-md font-extrabold text-dark-900 dark:text-white">₹{item.expectedSalary.toFixed(1)} LPA</h4>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-fit"
                    onClick={() => navigate('/prediction/result', { state: { prediction: item } })}
                  >
                    View Details <FiArrowRight className="ml-1.5" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default History;
