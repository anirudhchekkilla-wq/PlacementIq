import api from './api';

const companyService = {
  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },
  
  createCompany: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },

  deleteCompany: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  }
};

export default companyService;
