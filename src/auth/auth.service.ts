import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import {
  IRegisterResponse,
  ILoginResponse,
  IJwtPayload,
  IProfileResponse,
  IUsersResponse,
} from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new BadRequestException('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    const { accessToken, refreshToken } = this.generateToken(user, 'BOTH');

    const { password: _, ...userData } = user;

    return {
      success: true,
      message: 'Login successfull',
      data: userData,
      meta: {
        ...(accessToken && { accessToken }),
        ...(refreshToken && { refreshToken }),
      },
    };
  }
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      const user = await this.userRepository.findOneBy({ id: payload.id });
      if (!user) throw new UnauthorizedException('Unauthorized');
      const { accessToken } = this.generateToken(user, 'ACCESS');
      return {
        success: true,
        message: 'Refresh token successfull',
        data: { accessToken },
      };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }
  private generateToken(user: User, generate: 'ACCESS' | 'REFRESH' | 'BOTH') {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const accessTokenExpiry = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRY',
    );
    const refreshTokenExpiry = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRY',
    );
    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const result: Partial<{ accessToken: string; refreshToken: string }> = {};

    if (generate === 'ACCESS' || generate === 'BOTH') {
      result.accessToken = this.jwtService.sign(payload, {
        secret: jwtSecret,
        expiresIn: accessTokenExpiry,
      });
    }

    if (generate === 'REFRESH' || generate === 'BOTH') {
      result.refreshToken = this.jwtService.sign(payload, {
        secret: jwtSecret,
        expiresIn: refreshTokenExpiry,
      });
    }
    return result;
  }
  async getProfile(id: number): Promise<IProfileResponse> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    const { password: _, ...userData } = user;
    return {
      success: true,
      message: 'Profile retrived successfully',
      data: userData,
    };
  }
  async getUsers(): Promise<IUsersResponse> {
    const users = await this.userRepository.find();
    const userData = users.map((user) => {
      const { password: _, ...userData } = user;
      return userData;
    });
    return {
      success: true,
      message: 'Users retrived successfully',
      data: userData,
    };
  }
}
