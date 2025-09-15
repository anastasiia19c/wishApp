import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Guest, GuestSchema } from 'src/guest/schemas/guest.schema';
import { Wish, WishSchema } from 'src/wish/schema/wish.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: User.name, schema: UserSchema },
      { name: Guest.name, schema: GuestSchema },
      { name: Wish.name, schema: WishSchema },
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
