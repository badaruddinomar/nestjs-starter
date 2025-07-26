import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PostModule } from 'src/post/post.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PostModule],
})
export class UserModule {}
