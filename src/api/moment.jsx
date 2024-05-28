import api from './api';

export const getMomentsFromPet = async id => {
  const response = await api.get(`/api/v1/pets/${id}/moments`);
  return response.data;
};

export const getMomentDetail = async id => {
  const response = await api.get(`/api/v1/moments/${id}`);
  return response.data;
};

export const createMoment = async data => {
  const response = await api.post(`/api/v1/moments`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const editMoment = async data => {
  const response = await api.put(`/api/v1/moments`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteMoment = async id => {
  const response = await api.delete(`/api/v1/moments/${id}`);
  return response.data;
};
