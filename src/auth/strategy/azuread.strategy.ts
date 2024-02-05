import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureADStrategy extends PassportStrategy(Strategy, 'AzureAD') {
  constructor(protected readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('CLIENT_ID'),
      issuer: `https://sts.windows.net/${configService.get(
        'TENANT_ID',
      )}/`,
      algorithms: ['RS256'],
      ignoreExpiration: true,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://login.microsoftonline.com/${configService.get(
          'TENANT_ID',
        )}/discovery/v2.0/keys`,
      }),
    });
  }

  validate(payload: any) {
    return payload;
  }
}
