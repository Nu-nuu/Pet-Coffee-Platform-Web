import api from "./api";

export const login = async (data) => {
    const response = await api.post(`/api/v1/auths/login`, data);
    return response.data;
};

export const loginGG = async (data) => {
    const response = await api.post(`/api/v1/auths/login/firebase`, data);
    return response.data;
};

export const sendOTP = async () => {
    const response = await api.get(`/api/v1/auths/resend/OTP`);
    return response.data;
};

export const checkEmail = async (email) => {
    const response = await api.get(`/api/v1/auths/checkemail/${email}`);
    return response.data;
};

export const sendOTPForgotPassword = async (email) => {
    const response = await api.get(
        `/api/v1/auths/forgotpassword/resend/OTP?Email=${email}`
    );
    return response.data;
};

export const newPassword = async (data) => {
    const response = await api.put(
        `/api/v1/auths/forgotpassword/password`,
        data
    );
    return response.data;
};

export const getUserData = async () => {
    const response = await api.get(`/api/v1/auths`);
    return response.data;
};

export const updateUserData = async (data) => {
    const response = await api.put(`/api/v1/auths`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getUserDetail = async (id) => {
    const response = await api.get(`/api/v1/auths/${id}`);
    return response.data;
};

export const signup = async (data) => {
    const response = await api.post(`/api/v1/auths/register`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const verifyUser = async (data) => {
    const response = await api.post(`/api/v1/auths/verify/otp`, data);
    return response.data;
};

export const verifyForgot = async (data) => {
    const response = await api.post(
        `/api/v1/auths/forgotpassword/verify/otp`,
        data
    );
    return response.data;
};

export const updatePassword = async (data) => {
    const response = await api.put(`/api/v1/auths/password`, data);
    return response.data;
};

export const updateStaffPassword = async (data) => {
    const response = await api.put(`/api/v1/auths/staffs/password`, data);
    return response.data;
};

export const getStaffs = async (id, pageNumber, pageSize) => {
    const response = await api.get(
        `/api/v1/auths/pet-coffee-shops/staffs?ShopId=${id}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const createStaff = async (data) => {
    const response = await api.post(
        `/api/v1/auths/pet-coffee-shops/staffs`,
        data
    );
    return response.data;
};

export const getAllAccounts = async (role, pageNumber, pageSize) => {
    const response = await api.get(
        `/api/v1/auths/accounts?Roles=${role}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const updateStatusAccount = async (data) => {
    const response = await api.put(`/api/v1/auths/accounts/status`, data);
    return response.data;
};
