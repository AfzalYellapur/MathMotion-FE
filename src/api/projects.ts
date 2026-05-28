import apiClient from './axios-client';

export const getProjects = () => {
  return apiClient.get('/api/projects');
};

export const createProject = () => {
  return apiClient.post('/api/projects/new');
};

export const deleteProject = (id: string) => {
  return apiClient.delete(`/api/projects/${id}`);
};

export const activateProject = (id: string) => {
  return apiClient.put(`/api/projects/${id}/activate`);
};

export const sendChat = (id: string, prompt: string) => {
  return apiClient.post(`/api/projects/${id}/chat`, { prompt });
};

export const cancelGeneration = (id: string) => {
  return apiClient.post(`/api/projects/${id}/cancel-generation`);
};

export const saveCode = (id: string, code: string) => {
  return apiClient.put(`/api/projects/${id}/code`, { code });
};

export const buildProject = (id: string, fileClass?: string) => {
  return apiClient.post(`/api/projects/${id}/build`, { fileClass: fileClass || 'MainScene' });
};

export const cancelRender = (id: string) => {
  return apiClient.post(`/api/projects/${id}/cancel-render`);
};
