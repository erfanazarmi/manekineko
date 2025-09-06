import type { User, Category } from "./definitions";

const users: User[] = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    firstname: "John",
    lastname: "Doe",
    email: "user1@example.com",
    password: "123456",
    email_verified: true,
    verification_token: null,
    verification_expires: null,
  },
  {
    id: "b82f9c1a-7f1d-4b42-9c6f-2f1a7c2a8b1d",
    firstname: "Jane",
    lastname: "Smith",
    email: "user2@example.com",
    password: "123456",
    email_verified: false,
    verification_token: null,
    verification_expires: null,
  },
];

const categories: Category[] = [
  {
    id: "e33809e4-8cd9-410a-ae4f-69398ba66d75",
    user_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Food",
  },
  {
    id: "4fb57244-d2fd-4904-9da5-c1ab76255076",
    user_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Gift",
  },
];

export { users, categories };
