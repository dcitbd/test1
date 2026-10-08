import { apiClient } from './client.js';

export const paymentsApi = {
  async list(params) { return apiClient.request("payments/list", params); },
  async get(id) { return apiClient.request("payments/details", { id }); },
  async create(payload) { return apiClient.request("payments/create", payload); },
  async update(payload) { return apiClient.request("payments/update", payload); }
};
