import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'tonSecretUltraSecret', // ⚠️ à mettre dans .env
      signOptions: { expiresIn: '1h' }, // durée de validité
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
