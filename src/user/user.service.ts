import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUsersResponse } from 'src/auth/auth.interface';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { IProfileResponse } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getUsers(): Promise<IUsersResponse> {
    const users = await this.userRepository.find();
    return {
      success: true,
      message: 'Users retrived successfully',
      data: users,
    };
  }

  async getProfile(userId: number): Promise<IProfileResponse> {
    const profile = await this.userRepository.findOneBy({ id: userId });
    if (!profile) throw new NotFoundException('User not found');
    return {
      success: true,
      message: 'Profile retrived successfully',
      data: profile,
    };
  }
}
