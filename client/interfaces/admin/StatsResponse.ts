import { APIResponse } from "./ProductPostResponse";

export interface StatsResponse extends APIResponse {
  data: Stats;
}

interface Stats {
  products: number;
  totalUsers: number;
  normalUsers: number;
  adminUsers: number;
}
