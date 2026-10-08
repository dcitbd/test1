import { apiClient } from './client.js';

export const productsApi = {
  async list(params) { return apiClient.request("products/list", params); },
  async get(id) { return apiClient.request("products/details", { id }); },
  async create(payload) { return apiClient.request("products/create", payload); },
  async update(payload) { return apiClient.request("products/update", payload); }
};
