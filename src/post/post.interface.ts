export interface Post {
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
export type IGetPostResponse = IApiResponse<Post>;
export type ICreatePostResponse = IApiResponse<Post>;
