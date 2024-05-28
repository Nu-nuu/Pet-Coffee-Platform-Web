import api from "./api";

export const createTopup = async (data) => {
    const response = await api.post(`/api/v1/recharges`, data);
    return response.data;
};

export const updatePaymentData = async (id, status) => {
    const response = await api.put(
        `/api/v1/payments/callback/vnpay/${id}?Vnp_ResponseCode=${status}`
    );
    return response.data;
};
