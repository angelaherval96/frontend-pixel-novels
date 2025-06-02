import type { IUser } from "./IUser";
//Interfaz para el estado de autenticación en el store
export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
}