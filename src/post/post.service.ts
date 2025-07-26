import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { ICreatePostResponse, IGetPostResponse, Post } from './post.interface';
import { CreatePostDto } from './post.dto';

@Injectable()
export class PostService {
  private readonly posts: Post[] = [
    {
      id: 1,
      title: 'First Post',
      content: 'This is the first post',
      authorName: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  createPost(data: CreatePostDto): ICreatePostResponse {
    const newPost: Post = {
      id: this.posts.length + 1,
      title: data.title,
      content: data.content,
      authorName: data.authorName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.push(newPost);
    return {
      success: true,
      message: 'Post created successfully',
      data: newPost,
    };
  }

  getPost(id: number): IGetPostResponse {
    const post = this.posts.find((post) => post.id === id);
    if (!post) throw new NotFoundException('Post not found');
    return {
      success: true,
      message: 'Post retrived successfully',
      data: post,
    };
  }
}
