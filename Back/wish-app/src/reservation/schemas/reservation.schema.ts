import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
    @Prop({ required: true })
    user_id: string;  

    @Prop({ required: true })
    guest_id: string;

    @Prop({ type: [String], default: [] })
    wishes: string[];
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
