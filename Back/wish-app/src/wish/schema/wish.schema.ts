import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WishDocument = Wish & Document;

@Schema({ timestamps: true }) // ajoute createdAt et updatedAt automatiquement
export class Wish {

    @Prop({ required: true })
    wishlist_id: string;

    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop()
    url: string;

    @Prop()
    image: string;

    @Prop()
    price: number;

    @Prop({ enum: ['available', 'reserved'], default: 'available' })
    status: string;
}

export const WishSchema = SchemaFactory.createForClass(Wish);
