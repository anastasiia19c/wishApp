import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { Guest, GuestSchema } from './schemas/guest.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Guest.name, schema: GuestSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tonSecretUltraSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
