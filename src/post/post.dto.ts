import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { PaginationQueryDto } from 'src/common/dto/pagination.query.dto';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(50, { message: 'Title must be at most 50 characters long' })
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(3, { message: 'Content must be at least 3 characters long' })
  @MaxLength(1000, { message: 'Content must be at most 1000 characters long' })
  content: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class GetPostsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: 'Title must be at most 100 characters long' })
  title?: string;
}
