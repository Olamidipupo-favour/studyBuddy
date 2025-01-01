import { AuthOptions } from "next-auth";

export const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://studybuddy-backend-vj7d.onrender.com/api/v1'

// Add proper export type
export type AuthConfig = {
  authOptions: AuthOptions;
};

