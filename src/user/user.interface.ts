import { User } from './user.entity';

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    [key: string]: string;
  };
}

export type IProfileResponse = IApiResponse<Omit<User, 'password'>>;
export type IUsersResponse = IApiResponse<Omit<User, 'password'>[]>;
