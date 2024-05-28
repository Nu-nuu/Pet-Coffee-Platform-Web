import api from './api';

export const getPetsFromShop = async shopId => {
  const response = await api.get(
    `/api/v1/petCoffeeShops/pets?ShopId=${shopId}`,
  );
  return response.data;
};

export const getPetDetail = async id => {
  const response = await api.get(`/api/v1/pets/${id}`);
  return response.data;
};

export const getPetsFromArea = async areaId => {
  const response = await api.get(`/api/v1/area/pets?AreaId=${areaId}`);
  return response.data;
};

export const updatePetsFromArea = async data => {
  const response = await api.put(`/api/v1/areas/pets`,data);
  return response.data;
};

export const createPet = async data => {
  const response = await api.post(`/api/v1/pets`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePet = async data => {
  const response = await api.put(`/api/v1/pets`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePet = async id => {
  const response = await api.delete(`/api/v1/Pets/${id}`);
  return response.data;
};
