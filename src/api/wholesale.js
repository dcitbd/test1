import { apiClient } from './client.js';

export const wholesaleApi = {
  async list(params) { return apiClient.request("wholesale/list", params); },
  async get(id) { return apiClient.request("wholesale/details", { id }); },
  async create(payload) { return apiClient.request("wholesale/create", payload); },
  async update(payload) { return apiClient.request("wholesale/update", payload); }
};
