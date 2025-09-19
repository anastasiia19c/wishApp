import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // récupère le token "Bearer xxx"
      ignoreExpiration: false, // rejette si le token est expiré
      secretOrKey: 'tonSecretUltraSecret', // même secret que dans JwtModule (mets ça dans .env)
    });
  }

  async validate(payload: any) {
    // Ce que tu retournes ici sera injecté comme `req.user`
    return { userId: payload.sub, email: payload.email };
  }
}
