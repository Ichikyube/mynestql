import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy/local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from '../../common/serializers/session.serializer';
import { AuthController } from './auth.controller';
import authConstants from 'src/common/constants/auth-constants';
@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
      defaultStrategy: 'jwt',
      secretOrPrivateKey: authConstants.jwt.secret,
    }),
    JwtModule.register({
      secret: authConstants.jwt.secret,
    })
  ],
  providers: [LocalStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
