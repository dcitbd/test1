import { apiClient } from './client.js';

export const resellersApi = {
  async list(params) { return apiClient.request("resellers/list", params); },
  async get(id) { return apiClient.request("resellers/details", { id }); },
  async create(payload) { return apiClient.request("resellers/create", payload); },
  async update(payload) { return apiClient.request("resellers/update", payload); }
};
