export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  email_verified: boolean;
  verification_token?: string | null;
  verification_expires?: string | null;
};
