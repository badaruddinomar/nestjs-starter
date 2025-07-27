import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { IRegisterResponse } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<IRegisterResponse> {
    const { name, email, password } = registerDto;
    console.log(registerDto);
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) throw new ConflictException('User already exists');

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashPassword,
    });
    const savedUser = await this.userRepository.save(newUser);
    const { password: _, ...userData } = savedUser;
    return {
      success: true,
      message: 'Registered successfully',
      data: userData,
    };
  }
}
