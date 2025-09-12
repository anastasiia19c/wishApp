import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {}

  async create(dto: CreateWishlistDto): Promise<Wishlist> {
    const wishlist = new this.wishlistModel(dto);
    return wishlist.save();
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistModel.find().populate('user_id').exec();
  }

  async findOne(id: string): Promise<Wishlist> {
    return this.wishlistModel.findById(id).populate('user_id').exec();
  }

  async update(id: string, dto: UpdateWishlistDto): Promise<Wishlist> {
    return this.wishlistModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string): Promise<Wishlist> {
    return this.wishlistModel.findByIdAndDelete(id).exec();
  }
}
