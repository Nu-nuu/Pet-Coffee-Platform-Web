import api from "./api";

export const getAllReports = async (pageNumber, pageSize) => {
    const response = await api.get(
        `/api/v1/reports?PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const getShopReports = async (id, pageNumber, pageSize) => {
    const response = await api.get(
        `/api/v1/shops/${id}/reports?PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const updateReportStatus = async (data) => {
    const response = await api.put(`/api/v1/reports/status`, data);
    return response.data;
};
