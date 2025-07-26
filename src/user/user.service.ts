import { Injectable } from '@nestjs/common';
import { PostService } from 'src/post/post.service';

@Injectable()
export class UserService {
  constructor(private readonly postService: PostService) {}
  getUser(): string {
    return 'Hi i am user';
  }
  getProfile(id: number): string {
    return `Hi i am user ${id}`;
  }
  getWithQuery(name: string): string {
    return `Hi i am user ${name}`;
  }
}
