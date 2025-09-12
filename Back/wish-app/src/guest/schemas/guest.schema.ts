import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GuestDocument = Guest & Document;

@Schema({ timestamps: true })
export class Guest {
    @Prop({ required: true })
    pseudo: string;

    @Prop({ required: true, unique: true })
    token: string;
}

export const GuestSchema = SchemaFactory.createForClass(Guest);
