import api from "./api";

export const createEvent = async (data) => {
    const response = await api.post(`/api/v1/events`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateEvent = async (data) => {
    const response = await api.put(`/api/v1/events`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const createEventField = async (data) => {
    const response = await api.post(`/api/v1/events/fields`, data);
    return response.data;
};

export const updateEventField = async (data) => {
    const response = await api.put(`/api/v1/event-fields`, data);
    return response.data;
};

export const joinEvent = async (data) => {
    const response = await api.post(`/api/v1/events/joinevents`, data);
    return response.data;
};

export const getJoinEvents = async () => {
    const response = await api.get(`/api/v1/events/joinevents`);
    return response.data;
};

export const getEventDetail = async (id) => {
    const response = await api.get(`/api/v1/events/${id}`);
    return response.data;
};

export const deleteEvent = async (id) => {
    const response = await api.delete(`/api/v1/events/${id}`);
    return response.data;
};

export const getEventDetailForCustomer = async (id) => {
    const response = await api.get(`/api/v1/events/submitting-events/${id}`);
    return response.data;
};

export const deleteEventField = async (id) => {
    const response = await api.delete(`/api/v1/events-fields/${id}`);
    return response.data;
};

export const getEventsFromShop = async (id, pageNumber, pageSize) => {
    const response = await api.get(
        `/api/v1/petcoffeeshops/${id}/events?PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response.data;
};

export const getAllEventSubmits = async (id) => {
    const response = await api.get(`/api/v1/events/${id}/event-fields`);
    return response.data;
};
