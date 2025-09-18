import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Guest, GuestDocument } from './schemas/guest.schema';

@Injectable()
export class GuestService {
  constructor(@InjectModel(Guest.name) private guestModel: Model<GuestDocument>) {}

  async create(createGuestDto: CreateGuestDto): Promise<Guest> {
    const newGuest = new this.guestModel(createGuestDto);
    return newGuest.save();
  }

  async findAll(): Promise<Guest[]> {
    return this.guestModel.find().exec();
  }

  async findOne(id: string): Promise<Guest> {
    return this.guestModel.findById(id).exec();
  }
}
