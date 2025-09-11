import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import { Wish, WishSchema } from './schema/wish.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wish.name, schema: WishSchema }]),
  ],
  controllers: [WishController],
  providers: [WishService],
})
export class WishModule {}
