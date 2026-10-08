import { apiClient } from './client.js';

export const reportsApi = {
  async list(params) { return apiClient.request("reports/list", params); },
  async get(id) { return apiClient.request("reports/details", { id }); },
  async create(payload) { return apiClient.request("reports/create", payload); },
  async update(payload) { return apiClient.request("reports/update", payload); }
};
