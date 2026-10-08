import { apiClient } from './client.js';

export const ordersApi = {
  async list(params) { return apiClient.request("orders/list", params); },
  async get(id) { return apiClient.request("orders/details", { id }); },
  async create(payload) { return apiClient.request("orders/create", payload); },
  async update(payload) { return apiClient.request("orders/update", payload); }
};
