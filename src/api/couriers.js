import { apiClient } from './client.js';

export const couriersApi = {
  async list(params) { return apiClient.request("couriers/list", params); },
  async get(id) { return apiClient.request("couriers/details", { id }); },
  async create(payload) { return apiClient.request("couriers/create", payload); },
  async update(payload) { return apiClient.request("couriers/update", payload); }
};
