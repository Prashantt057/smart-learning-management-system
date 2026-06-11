import { User } from "../user/user";

export interface AuthResponse {
    
  success: boolean;
  message: string;
  user?:User
}

