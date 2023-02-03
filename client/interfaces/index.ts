export * from "./admin";
export * from "./auth";
export * from "./products";

export interface APIResponse {
  successful: boolean;
  message: string;
}

export interface errorStatus {
  status: boolean;
  message: string;
}
