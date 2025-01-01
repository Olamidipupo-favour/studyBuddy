<<<<<<< HEAD
import { AuthOptions } from "next-auth";

export const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://studybuddy-backend-vj7d.onrender.com/api/v1'

// Add proper export type
export type AuthConfig = {
  authOptions: AuthOptions;
};
=======
export const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://studybuddy-backend-vj7d.onrender.com/api/v1'
>>>>>>> e2d2a210f47a12860b09a27cebd879afd7c277c5

