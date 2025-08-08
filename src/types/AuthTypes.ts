import type { User, Session } from "next-auth";

export interface ExtendedUser extends User {
  id: string;
}

export interface ExtendedSession extends Session {
  user: ExtendedUser;
}

export interface AuthError {
  message: string;
  code?: string;
}
