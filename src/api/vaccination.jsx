import api from './api';

export const getVaccinationsFromPet = async id => {
  const response = await api.get(`/api/v1/pets/${id}/Vaccinations`);
  return response.data;
};

export const getVaccinationDetail = async id => {
  const response = await api.get(`/api/v1/Vaccinations/${id}`);
  return response.data;
};

export const createVaccination = async data => {
  const response = await api.post(`/api/v1/Vaccination`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const editVaccination = async data => {
  const response = await api.put(`/api/v1/Vaccination`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response?.data;
};

export const deleteVaccination = async id => {
  const response = await api.delete(`/api/v1/Vaccination/${id}`);
  return response.data;
};
