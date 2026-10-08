import { apiClient } from './client.js';

export const authApi = {
  async list(params) { return apiClient.request("auth/list", params); },
  async get(id) { return apiClient.request("auth/details", { id }); },
  async create(payload) { return apiClient.request("auth/create", payload); },
  async update(payload) { return apiClient.request("auth/update", payload); }
};
