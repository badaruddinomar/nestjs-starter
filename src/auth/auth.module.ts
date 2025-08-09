import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategies';
import { RolesGuard } from './guard/roles.guard';
import { UserModule } from 'src/user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoginThrottlerGuard } from './guard/login-throttler.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, //
          limit: 2, // limit to 100 requests per minute
        },
      ],
    }),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, LoginThrottlerGuard],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
