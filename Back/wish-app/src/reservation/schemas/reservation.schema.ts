import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Guest } from '../../guest/schemas/guest.schema';
import { User } from '../../user/schemas/user.schema';
import { Wishlist } from '../../wishlist/schemas/wishlist.schema';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true, versionKey: false })
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user_id: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: Wishlist.name, required: true })
  wishlist_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Guest.name, default: null })
  guest_id: Types.ObjectId | null;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Wish' }], required: true })
  wishes: string[];
  
  @Prop({ default: false })
  synced?: boolean;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.pre('validate', function (next) {
  if ((this.user_id && this.guest_id) || (!this.user_id && !this.guest_id)) {
    return next(new Error('Reservation must have either a user_id or a guest_id, but not both.'));
  }
  next();
});
