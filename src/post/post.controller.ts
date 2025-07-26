import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ICreatePostResponse, IGetPostResponse } from './post.interface';
import { CreatePostDto } from './post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPost(@Body() dto: CreatePostDto): ICreatePostResponse {
    return this.postService.createPost(dto);
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number): IGetPostResponse {
    return this.postService.getPost(id);
  }
}
