import api from './api';

export const getAreasFromShop = async id => {
  const response = await api.get(`/api/v1/petcoffeeshops/${id}/areas`);
  return response.data;
};

export const getAreaDetail = async id => {
  const response = await api.get(`/api/v1/areas/${id}`);
  return response.data;
};

export const createArea = async data => {
  const response = await api.post(`/api/v1/Areas`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const editArea = async data => {
  const response = await api.put(`/api/v1/Areas`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteArea = async id => {
  const response = await api.delete(`/api/v1/Area/${id}`);
  return response.data;
};
