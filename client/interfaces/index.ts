export * from "./admin";
export * from "./auth";
export * from "./products";
export * from "./CountryListResponse";
export * from "./user";

export interface APIResponse {
  successful: boolean;
  message: string;
}

export interface errorStatus {
  status: boolean;
  message: string;
}
