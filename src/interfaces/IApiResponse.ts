export interface IApiResponse<T> {
    success: boolean;
    message?: string;    
    data?: T; // Puede ser un objeto, un array, etc.
}