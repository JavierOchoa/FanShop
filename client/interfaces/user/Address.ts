import { APIResponse } from "../";

export interface AddressesResponse extends APIResponse {
  data: AddressBody[];
}

export interface AddressBody {
  id?: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface AddressBodyValidations {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
}
