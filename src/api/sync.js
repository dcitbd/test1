import { apiClient } from './client.js';

export const syncApi = {
  async list(params) { return apiClient.request("sync/list", params); },
  async get(id) { return apiClient.request("sync/details", { id }); },
  async create(payload) { return apiClient.request("sync/create", payload); },
  async update(payload) { return apiClient.request("sync/update", payload); }
};
