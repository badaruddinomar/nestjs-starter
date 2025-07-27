import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  ICreatePostResponse,
  IDeletePostResponse,
  IGetPostResponse,
  IGetPostsResponse,
  IUpdatePostResponse,
} from './post.interface';
import { CreatePostDto } from './post.dto';
import { Post as IPost } from './post.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPost(@Body() dto: CreatePostDto): Promise<ICreatePostResponse> {
    return this.postService.createPost(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getPost(@Param('id', ParseIntPipe) id: number): Promise<IGetPostResponse> {
    return this.postService.getPost(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getPosts(): Promise<IGetPostsResponse> {
    return this.postService.getPosts();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<IPost>,
  ): Promise<IUpdatePostResponse> {
    return this.postService.updatePost(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deletePost(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IDeletePostResponse> {
    return this.postService.deletePost(id);
  }
}
