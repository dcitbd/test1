import { apiClient } from './client.js';

export const couponsApi = {
  async list(params) { return apiClient.request("coupons/list", params); },
  async get(id) { return apiClient.request("coupons/details", { id }); },
  async create(payload) { return apiClient.request("coupons/create", payload); },
  async update(payload) { return apiClient.request("coupons/update", payload); }
};
