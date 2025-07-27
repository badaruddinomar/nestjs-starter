import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ICreatePostResponse,
  IDeletePostResponse,
  IGetPostResponse,
  IGetPostsResponse,
  IUpdatePostResponse,
} from './post.interface';
import { CreatePostDto } from './post.dto';
import { Post } from './post.entity';
import { Post as IPost } from './post.entity';

export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async createPost(data: CreatePostDto): Promise<ICreatePostResponse> {
    const newPost = this.postRepository.create(data);
    await this.postRepository.save(newPost);
    return {
      success: true,
      message: 'Post created successfully',
      data: newPost,
    };
  }
  async getPosts(): Promise<IGetPostsResponse> {
    const posts = await this.postRepository.find();
    return {
      success: true,
      message: 'Posts retrived successfully',
      data: posts,
    };
  }

  async getPost(id: number): Promise<IGetPostResponse> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    return {
      success: true,
      message: 'Post retrived successfully',
      data: post,
    };
  }

  async updatePost(
    id: number,
    data: Partial<IPost>,
  ): Promise<IUpdatePostResponse> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    await this.postRepository.update(id, data);
    const updatedPost = await this.postRepository.findOneBy({ id });
    return {
      success: true,
      message: 'Post updated successfully',
      data: updatedPost!,
    };
  }

  async deletePost(id: number): Promise<IDeletePostResponse> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    await this.postRepository.remove(post);
    return {
      success: true,
      message: 'Post deleted successfully',
      data: null,
    };
  }
}
