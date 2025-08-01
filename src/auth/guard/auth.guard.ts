import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// protect routes
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
