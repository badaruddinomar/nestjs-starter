export interface IPost {
  id: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ICreatePostResponse = IApiResponse<IPost>;
export type IGetPostResponse = IApiResponse<IPost>;
export type IGetPostsResponse = IApiResponse<IPost[]>;
export type IUpdatePostResponse = IApiResponse<IPost>;
export type IDeletePostResponse = IApiResponse<null>;
