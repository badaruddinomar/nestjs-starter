import { Post } from './post.entity';

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    [key: string]: string;
  };
}

export type ICreatePostResponse = IApiResponse<Post>;
export type IGetPostResponse = IApiResponse<Post>;
export type IGetPostsResponse = IApiResponse<Post[]>;
export type IUpdatePostResponse = IApiResponse<Post>;
export type IDeletePostResponse = IApiResponse<null>;
