import api from './api';

const predictionService = {
  predict: async (profileSnapshot) => {
    const response = await api.post('/prediction', profileSnapshot);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/prediction/history');
    return response.data;
  },
};

export default predictionService;
