import { APIResponse } from "..";

export interface StatsResponse extends APIResponse {
  data: Stats;
}

interface Stats {
  products: number;
  totalUsers: number;
  normalUsers: number;
  adminUsers: number;
  totalOrders: number;
  completedOrders: number;
  unfinishedOrders: number;
  totalRevenue: number;
  revenue: number;
}
