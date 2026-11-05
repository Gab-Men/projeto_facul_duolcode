export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  passwordHash: string;
}

export type NewUser = Omit<User, "id">;
export type UserUpdate = Pick<User, "name" | "cpf" | "passwordHash">;
export type PublicUser = Omit<User, "passwordHash">;
export interface AuthSession {
  token: string;
  user: PublicUser;
}

export function publicUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email, cpf: user.cpf };
}
