import api from './api';

export const getFollowShops = async (
  searchQuery,
  type,
  latitude,
  longitude,
  pageNumber,
  pageSize,
) => {
  const response = await api.get(
    `/api/followshops/petcoffeeshops/followshops?Latitude=${latitude}&Longitude=${longitude}&ShopType=${type}&Search=${searchQuery}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
  );
  return response.data;
};

export const getAllFollowShops = async () => {
  const response = await api.get(`/api/followshops/petcoffeeshops/followshops`);
  return response.data;
};

export const getAllFollowShopsDistance = async (latitude, longitude) => {
  const response = await api.get(
    `/api/followshops/petcoffeeshops/followshops?Latitude=${latitude}&Longitude=${longitude}`,
  );
  return response.data;
};

export const followShops = async id => {
  const response = await api.post(`/api/followshops/${id}`);
  return response.data;
};

export const unfollowShops = async id => {
  const response = await api.delete(`/api/followshops/${id}`);
  return response.data;
};
