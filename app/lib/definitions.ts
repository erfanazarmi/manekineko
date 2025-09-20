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

export type Transaction = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category_id: string;
  description?: string | null;
  date: string;
  created_at?: string;
};

export type TransactionsTable = {
  id: string;
  title: string;
  amount: number;
  category_id: string | null;
  category_name: string | null;
  description: string | null;
  date: string;
}
