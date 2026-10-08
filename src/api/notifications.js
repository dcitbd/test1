import { apiClient } from './client.js';

export const notificationsApi = {
  async list(params) { return apiClient.request("notifications/list", params); },
  async get(id) { return apiClient.request("notifications/details", { id }); },
  async create(payload) { return apiClient.request("notifications/create", payload); },
  async update(payload) { return apiClient.request("notifications/update", payload); }
};
