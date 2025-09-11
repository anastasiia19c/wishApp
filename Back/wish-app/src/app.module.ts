import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WishModule } from './wish/wish.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [WishModule, MongooseModule.forRoot(process.env.MONGODB_URI), ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
