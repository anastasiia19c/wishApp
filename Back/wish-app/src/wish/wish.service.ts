import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wish, WishDocument } from './schema/wish.schema';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wishlist, WishlistDocument } from '../wishlist/schemas/wishlist.schema';
import { WishGateway } from 'src/websocket/wish/wish.gateway';

@Injectable()
export class WishService {
  constructor(
    @InjectModel(Wish.name) private wishModel: Model<WishDocument>,
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
    private readonly gateway: WishGateway
  ) { }

  async create(createWishDto: CreateWishDto): Promise<Wish> {
    // Vérifier que l’ID est bien un ObjectId valide
    if (!Types.ObjectId.isValid(createWishDto.wishlist_id)) {
      throw new BadRequestException(`Invalid wishlist_id format`);
    }

    // Vérifier que la wishlist existe
    const wishlist = await this.wishlistModel.findById(createWishDto.wishlist_id).exec();

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with id ${createWishDto.wishlist_id} not found`);
    }

    try {
      const newWish = await this.wishModel.create({
        ...createWishDto,
        wishlist_id: new Types.ObjectId(createWishDto.wishlist_id)
      });
      this.gateway.emit('wish:created', newWish);
      return await newWish.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `This wishlist already contains a wish with title "${createWishDto.title}"`,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Wish[]> {
    return this.wishModel.find().exec();
  }

  async findOne(id: string): Promise<Wish> {
    const wish = await this.wishModel.findById(id).exec();
    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }
    return wish;
  }

  async findByWishlist(wishlistId: string): Promise<Wish[]> {
    return this.wishModel.find({ wishlist_id: new Types.ObjectId(wishlistId) }).exec();
  }

  async findAvailableByWishlist(wishlistId: string): Promise<Wish[]> {
    return this.wishModel.find({ wishlist_id: new Types.ObjectId(wishlistId), status: 'available', }).exec();
  }

  async update(id: string, updateWishDto: UpdateWishDto): Promise<Wish> {
    const updated = await this.wishModel.findByIdAndUpdate(id, updateWishDto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }
    this.gateway.emit('wish:updated', updated);
    return updated;
  }

  async remove(id: string): Promise<Wish> {
    const deleted = await this.wishModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }
    this.gateway.emit('wish:deleted', { id });
    return deleted;
  }
}
