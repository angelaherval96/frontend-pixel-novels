export interface IUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'creator' | 'admin';
  avatar_url?: string | null; // URL del avatar, puede ser null si no tiene avatar.
  email_verified_at?: string | null; // Es un timestamp, vendrá como string (ISO 8601). Es nullable.
  created_at: string;
  updated_at: string; 
  
}