import { apiClient } from './client.js';

export const inventoryApi = {
  async list(params) { return apiClient.request("inventory/list", params); },
  async get(id) { return apiClient.request("inventory/details", { id }); },
  async create(payload) { return apiClient.request("inventory/create", payload); },
  async update(payload) { return apiClient.request("inventory/update", payload); }
};
