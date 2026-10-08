import { apiClient } from './client.js';

export const sellersApi = {
  async list(params) { return apiClient.request("sellers/list", params); },
  async get(id) { return apiClient.request("sellers/details", { id }); },
  async create(payload) { return apiClient.request("sellers/create", payload); },
  async update(payload) { return apiClient.request("sellers/update", payload); }
};
