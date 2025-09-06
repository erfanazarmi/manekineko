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

export type Category = {
  id: string;
  user_id: string;
  name: string;
};
