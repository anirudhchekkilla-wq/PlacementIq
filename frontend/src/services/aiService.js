import api from './api';

const aiService = {
  // Check Ollama service status
  getStatus: async () => {
    const response = await api.get('/ai/status');
    return response.data;
  },

  // Chat with AI Career Mentor
  chat: async (messages) => {
    const response = await api.post('/ai/chat', { messages });
    return response.data;
  },

  // Generate AI-powered roadmap recommendations
  generateRoadmap: async () => {
    const response = await api.post('/ai/roadmap');
    return response.data;
  },

  // Get SHAP-based feature explanations and AI narrative
  getExplanation: async (predictionId, predictionData) => {
    const response = await api.post('/explanation', { predictionId, predictionData });
    return response.data;
  },
};

export default aiService;
