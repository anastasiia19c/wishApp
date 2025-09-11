import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Types } from 'mongoose';
import { Guest } from '../../guest/schemas/guest.schema';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
    @Prop({ required: true })
    user_id: string;  

    @Prop({ type: Types.ObjectId, ref: Guest.name, required: true })
    guest_id: Types.ObjectId;

    @Prop({ type: [String], default: [] })
    wishes: string[];
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
