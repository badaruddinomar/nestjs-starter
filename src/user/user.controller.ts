import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(): string {
    return this.userService.getUser();
  }

  @Get('/profile/:id')
  getProfile(@Param('id', ParseIntPipe) id: number): string {
    return this.userService.getProfile(id);
  }

  @Get('/test')
  getQuery(@Query('name') name: string): string {
    return this.userService.getWithQuery(name);
  }
}
