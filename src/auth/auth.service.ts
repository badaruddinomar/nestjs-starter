import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
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
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) throw new ConflictException('User already exists');

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashPassword,
    });
    const savedUser = await this.userRepository.save(newUser);
    return {
      success: true,
      message: 'Registered successfully',
      data: savedUser,
    };
  }

  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // explicitly select password
      .where('user.email = :email', { email })
      .getOne();

    if (!user) throw new BadRequestException('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    const { accessToken, refreshToken } = this.generateToken(user, 'BOTH');

    return {
      success: true,
      message: 'Login successfull',
      data: user,
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
}
