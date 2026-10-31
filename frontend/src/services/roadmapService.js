import api from './api';

const roadmapService = {
  getRoadmap: async () => {
    const response = await api.get('/roadmap');
    return response.data;
  },

  generateRoadmap: async (predictionId) => {
    const response = await api.post('/roadmap', { predictionId });
    return response.data;
  },

  updateStep: async (stepId, status) => {
    const response = await api.put('/roadmap/step', { stepId, status });
    return response.data;
  },
};

export default roadmapService;
