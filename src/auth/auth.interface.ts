import { User } from './user.entity';

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    [key: string]: string;
  };
}

export type IRegisterResponse = IApiResponse<Omit<User, 'password'>>;
export type ILoginResponse = IApiResponse<Omit<User, 'password'>>;
export type IProfileResponse = IApiResponse<Omit<User, 'password'>>;
export type IUsersResponse = IApiResponse<Omit<User, 'password'>[]>;

export interface IJwtPayload {
  id: number;
  email: string;
  role: string;
}
