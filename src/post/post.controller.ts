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
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  ICreatePostResponse,
  IDeletePostResponse,
  IGetPostResponse,
  IGetPostsResponse,
  IUpdatePostResponse,
} from './post.interface';
import { CreatePostDto, GetPostsQueryDto } from './post.dto';
import { Post as IPost } from './post.entity';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { User } from 'src/user/user.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createPost(
    @Body() data: CreatePostDto,
    @CurrentUser() user: User,
  ): Promise<ICreatePostResponse> {
    return this.postService.createPost(data, user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getPost(@Param('id', ParseIntPipe) id: number): Promise<IGetPostResponse> {
    return this.postService.getPost(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getPosts(@Query() query: GetPostsQueryDto): Promise<IGetPostsResponse> {
    return this.postService.getPosts(query);
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
