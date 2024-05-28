import api from "./api";

export const getWallet = async () => {
    const response = await api.get(`/api/v1/account/wallet`);
    return response.data;
};

export const getManagerIncome = async () => {
    const response = await api.get(`/api/v1/account/wallet/income?Months=6`);
    return response.data;
};
export const getManagerOutcome = async () => {
    const response = await api.get(`/api/v1/account/wallet/outcome?Months=6`);
    return response.data;
};
export const getShopMonthIncome = async (from, to, id) => {
    const response = await api.get(
        `/api/v1/account/wallet/month/income?From=${from}&To=${to}&ShopId=${id}`
    );
    return response.data;
};
export const getShopMonthOutcome = async (from, to, id) => {
    const response = await api.get(
        `/api/v1/account/wallet/month/outcome?From=${from}&To=${to}&ShopId=${id}`
    );
    return response.data;
};
export const getManagerMonthIncome = async (from, to) => {
    const response = await api.get(
        `/api/v1/account/wallet/month/income?From=${from}&To=${to}`
    );
    return response.data;
};
export const getManagerMonthOutcome = async (from, to) => {
    const response = await api.get(
        `/api/v1/account/wallet/month/outcome?From=${from}&To=${to}`
    );
    return response.data;
};

export const getPlatformIncome = async () => {
    const response = await api.get(
        `/api/v1/account/wallet/platform/income?Months=6`
    );
    return response.data;
};

export const getPlatformMonthIncome = async (from, to) => {
    const response = await api.get(
        `/api/v1/account/wallet/platform/month/income?From=${from}&To=${to}`
    );
    return response.data;
};

export const getShopIncome = async (id) => {
    const response = await api.get(
        `/api/v1/account/wallet/shop/income?ShopId=${id}&Months=6`
    );
    return response.data;
};

export const getShopOutcome = async (id) => {
    const response = await api.get(
        `/api/v1/account/wallet/shop/outcome?ShopId=${id}&Months=6`
    );
    return response.data;
};
