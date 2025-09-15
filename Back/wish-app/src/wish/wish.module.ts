import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import { Wish, WishSchema } from './schema/wish.schema';
import { Wishlist, WishlistSchema } from 'src/wishlist/schemas/wishlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wish.name, schema: WishSchema },
      { name: Wishlist.name, schema: WishlistSchema },
    ]),
  ],
  controllers: [WishController],
  providers: [WishService],
})
export class WishModule {}
