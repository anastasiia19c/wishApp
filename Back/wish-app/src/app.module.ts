import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WishModule } from './wish/wish.module';
import { ReservationModule } from './reservation/reservation.module';
import { GuestModule } from './guest/guest.module';
import { UserModule } from './user/user.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    WishModule,
    MongooseModule.forRoot(process.env.ME_CONFIG_MONGODB_URL),
    ReservationModule,
    GuestModule,
    UserModule,
    WishlistModule,
    JwtModule.register({
          secret: 'tonSecretUltraSecret', // ⚠️ à mettre dans .env
          signOptions: { expiresIn: '1h' }, // durée de validité
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
