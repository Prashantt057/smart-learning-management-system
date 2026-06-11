import { UserRole } from "./user-role";

export interface User {
  id ?: string;
  username?: string;
  email: string;
  password: string;
  name: string;
  role: UserRole
  learningPreferences: string[];
  skillSummary: string;
  // isActive: boolean;
  createdAt: string;
}

