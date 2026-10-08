import { apiClient } from './client.js';

export const categoriesApi = {
  async list(params) { return apiClient.request("categories/list", params); },
  async get(id) { return apiClient.request("categories/details", { id }); },
  async create(payload) { return apiClient.request("categories/create", payload); },
  async update(payload) { return apiClient.request("categories/update", payload); }
};
