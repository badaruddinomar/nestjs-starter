import { Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ICreatePostResponse,
  IDeletePostResponse,
  IGetPostResponse,
  IGetPostsResponse,
  IUpdatePostResponse,
} from './post.interface';
import { CreatePostDto, GetPostsQueryDto } from './post.dto';
import { Post } from './post.entity';
import { Post as IPost } from './post.entity';
import { User } from 'src/user/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export class PostService {
  private cacheKey: Set<string> = new Set();
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private generatePostscacheKey(query: GetPostsQueryDto): string {
    const { page = 1, limit = 10, title } = query;
    return `posts:${page}:${limit}:${title || 'all'}`;
  }
  private generatePostcacheKey(id: number): string {
    return `post:${id}`;
  }
  private async invalidateCache() {
    const keysToDelete = Array.from(this.cacheKey);
    await Promise.all(keysToDelete.map((key) => this.cacheManager.del(key)));
    this.cacheKey.clear();
  }
  async createPost(
    data: CreatePostDto,
    user: User,
  ): Promise<ICreatePostResponse> {
    const postData = {
      ...data,
      user: { id: user.id },
    };
    const newPost = this.postRepository.create(postData);
    await this.postRepository.save(newPost);
    // Invalidate cache
    await this.invalidateCache();
    return {
      success: true,
      message: 'Post created successfully',
      data: newPost,
    };
  }
  async getPosts(query: GetPostsQueryDto): Promise<IGetPostsResponse> {
    // Get query
    const { page = 1, limit = 10, title } = query;
    const skip = (page - 1) * limit;
    // Check cache first
    const cacheKey = this.generatePostscacheKey(query);
    this.cacheKey.add(cacheKey);
    const cachedPosts =
      await this.cacheManager.get<IGetPostsResponse>(cacheKey);
    // Return cached data if available
    if (cachedPosts) return cachedPosts;
    // Query database
    const qb = this.postRepository.createQueryBuilder('post');
    if (title) qb.andWhere('post.title ILIKE :title', { title: `%${title}%` });
    const [posts, total] = await qb
      .leftJoinAndSelect('post.user', 'user')
      .skip(skip)
      .take(limit)
      .orderBy('post.createdAt', 'DESC')
      .getManyAndCount();
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const response = {
      success: true,
      message: 'Posts retrived successfully',
      data: posts,
      meta: {
        currentpage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
    // Set cache
    await this.cacheManager.set(cacheKey, response);
    // Send response
    return response;
  }

  async getPost(id: number): Promise<IGetPostResponse> {
    // Check cache first
    const cacheKey = this.generatePostcacheKey(id);
    this.cacheKey.add(cacheKey);
    const cachedPost = await this.cacheManager.get<IGetPostResponse>(cacheKey);
    // Return cached data if available
    if (cachedPost) return cachedPost;
    // Query database
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) throw new NotFoundException('Post not found');
    const response = {
      success: true,
      message: 'Post retrived successfully',
      data: post,
    };
    // Set cache
    await this.cacheManager.set(cacheKey, response);
    // Send response
    return response;
  }

  async updatePost(
    id: number,
    data: Partial<IPost>,
  ): Promise<IUpdatePostResponse> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    await this.postRepository.update(id, data);
    const updatedPost = await this.postRepository.findOneBy({ id });
    // Invalidate cache
    await this.invalidateCache();
    // Send response
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
    // Invalidate cache
    await this.invalidateCache();
    // Send response
    return {
      success: true,
      message: 'Post deleted successfully',
      data: null,
    };
  }
}
