import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true, versionKey: false })
export class Wishlist {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user_id: Types.ObjectId; // propriétaire

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  dateEvent: Date;

  @Prop()
  dateClosed?: Date;

  @Prop()
  coverImage?: string;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

WishlistSchema.index({ user_id: 1, title: 1 }, { unique: true });
