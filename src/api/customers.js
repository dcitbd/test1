import { apiClient } from './client.js';

export const customersApi = {
  async list(params) { return apiClient.request("customers/list", params); },
  async get(id) { return apiClient.request("customers/details", { id }); },
  async create(payload) { return apiClient.request("customers/create", payload); },
  async update(payload) { return apiClient.request("customers/update", payload); }
};
