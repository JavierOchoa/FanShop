export interface UpdateAccount {
  fullName?: string;
  email?: string;
  newPassword?: string;
  currentPassword: string;
}
