import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wish, WishDocument } from './schema/wish.schema';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishService {
  constructor(
    @InjectModel(Wish.name) private wishModel: Model<WishDocument>,
  ) {}

  async create(createWishDto: CreateWishDto): Promise<Wish> {
    const newWish = new this.wishModel(createWishDto);
    return newWish.save();
  }

  async findAll(): Promise<Wish[]> {
    return this.wishModel.find().exec();
  }

  async findOne(id: string): Promise<Wish> {
    return this.wishModel.findById(id).exec();
  }

  async update(id: string, updateWishDto: UpdateWishDto): Promise<Wish> {
    return this.wishModel.findByIdAndUpdate(id, updateWishDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Wish> {
    return this.wishModel.findByIdAndDelete(id).exec();
  }
}
