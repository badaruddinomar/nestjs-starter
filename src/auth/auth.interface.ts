import { User } from './user.entity';

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type IRegisterResponse = IApiResponse<Omit<User, 'password'>>;
