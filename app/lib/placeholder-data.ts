import type { User } from "./definitions";

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

export { users };
