import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateWishlistDto): Promise<Wishlist> {
    // Vérifier que user_id est un ObjectId valide
    if (!Types.ObjectId.isValid(dto.user_id)) {
      throw new BadRequestException(`Invalid user_id format`);
    }

    // Vérifier que le user existe
    const user = await this.userModel.findById(dto.user_id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${dto.user_id} not found`);
    }

    try {
      // Créer la wishlist
      const wishlist = new this.wishlistModel(dto);
      return await wishlist.save();
    } catch (error: any) {
      if (error.code === 11000) {
        // Erreur MongoDB : clé dupliquée
        throw new BadRequestException(`This user already has a wishlist with title "${dto.title}"`);
      }
      throw error; // toute autre erreur → 500
    }
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistModel.find().exec();
  }

  async findOne(id: string): Promise<Wishlist> {
    return this.wishlistModel.findById(id).exec();
  }

  async findByUser(userId: string): Promise<Wishlist[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException(`Invalid user_id format`);
    }

    const wishlists = await this.wishlistModel.find({ user_id: new Types.ObjectId(userId) }).exec();
    if (!wishlists || wishlists.length === 0) {
      throw new NotFoundException(`No wishlists found for user ${userId}`);
    }

    return wishlists;
  }

  async findOneByUser(id: string, userId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistModel.findOne({
      _id: new Types.ObjectId(id),
      user_id: new Types.ObjectId(userId),
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist ${id} not found for user ${userId}`);
    }

    return wishlist;
  }

  async update(id: string, dto: UpdateWishlistDto): Promise<Wishlist> {
    return this.wishlistModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string): Promise<Wishlist> {
    return this.wishlistModel.findByIdAndDelete(id).exec();
  }
}
