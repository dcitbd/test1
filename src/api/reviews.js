import { apiClient } from './client.js';

export const reviewsApi = {
  async list(params) { return apiClient.request("reviews/list", params); },
  async get(id) { return apiClient.request("reviews/details", { id }); },
  async create(payload) { return apiClient.request("reviews/create", payload); },
  async update(payload) { return apiClient.request("reviews/update", payload); }
};
