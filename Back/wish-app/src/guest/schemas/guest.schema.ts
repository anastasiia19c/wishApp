import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GuestDocument = Guest & Document;

@Schema({ timestamps: true })
export class Guest {
  @Prop({ required: true, unique: true })
  pseudo: string;
}

export const GuestSchema = SchemaFactory.createForClass(Guest);
GuestSchema.index({ pseudo: 1 }, { unique: true });
