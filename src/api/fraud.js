import { apiClient } from './client.js';

export const fraudApi = {
  async list(params) { return apiClient.request("fraud/list", params); },
  async get(id) { return apiClient.request("fraud/details", { id }); },
  async create(payload) { return apiClient.request("fraud/create", payload); },
  async update(payload) { return apiClient.request("fraud/update", payload); }
};
