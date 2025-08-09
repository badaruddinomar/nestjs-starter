import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req.body?.email || 'anonymous';
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown-ip';
    return `login-${email}-${ip}`; // track by email+IP
  }

  protected getLimit(): Promise<number> {
    return Promise.resolve(5); // max 5 requests
  }

  protected getTTL(): Promise<number> {
    return Promise.resolve(60000); // 60 seconds
  }

  protected async throwThrottlingException(): Promise<void> {
    console.log('🚨 Custom throttler triggered!');
    throw new ThrottlerException('Too many requests. Please try again later.');
  }
}
