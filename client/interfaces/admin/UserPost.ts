import { errorStatus } from "..";

export interface UserPost {
  id?: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
  password?: string;
}

export interface ErrorUserState {
  fullName: errorStatus;
  email: errorStatus;
  password?: errorStatus;
}
