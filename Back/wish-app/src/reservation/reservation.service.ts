import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Guest, GuestDocument } from '../guest/schemas/guest.schema';
import { Wish, WishDocument } from '../wish/schema/wish.schema';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Guest.name)
    private guestModel: Model<GuestDocument>,
    @InjectModel(Wish.name)
    private wishModel: Model<WishDocument>,
  ) {}

  async create(dto: CreateReservationDto): Promise<Reservation> {
    // 1. Vérifier user_id ou guest_id
    if (dto.user_id && dto.guest_id) {
      throw new BadRequestException(
        'Reservation must have either a user_id OR a guest_id, not both',
      );
    }
    if (!dto.user_id && !dto.guest_id) {
      throw new BadRequestException('Reservation must include a user_id or a guest_id');
    }

    if (dto.user_id) {
      if (!Types.ObjectId.isValid(dto.user_id)) {
        throw new BadRequestException(`Invalid user_id format`);
      }
      const user = await this.userModel.findById(dto.user_id).exec();
      if (!user) {
        throw new NotFoundException(`User with id ${dto.user_id} not found`);
      }
    }

    if (dto.guest_id) {
      if (!Types.ObjectId.isValid(dto.guest_id)) {
        throw new BadRequestException(`Invalid guest_id format`);
      }
      const guest = await this.guestModel.findById(dto.guest_id).exec();
      if (!guest) {
        throw new NotFoundException(`Guest with id ${dto.guest_id} not found`);
      }
    }

    // 2. Vérifier les wishes
    for (const wishId of dto.wishes) {
      if (!Types.ObjectId.isValid(wishId)) {
        throw new BadRequestException(`Invalid wish_id format: ${wishId}`);
      }
      const wish = await this.wishModel.findById(wishId).exec();
      if (!wish) {
        throw new NotFoundException(`Wish with id ${wishId} not found`);
      }
      if (wish.status !== 'available') {
        throw new BadRequestException(`Wish "${wish.title}" is already reserved`);
      }
    }

    // 3. Créer la réservation
    const reservation = new this.reservationModel(dto);
    const saved = await reservation.save();

    // 4. Mettre à jour les wishes en "reserved"
    await this.wishModel.updateMany({ _id: { $in: dto.wishes } }, { $set: { status: 'reserved' } });

    return saved;
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find().exec();
  }

  async findOne(id: string): Promise<Reservation> {
    return this.reservationModel.findById(id).exec();
  }
  async findByUser(userId: string): Promise<Reservation[]> {
    // Vérifier si le user existe
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Retourner les réservations associées
    return this.reservationModel.find({ user_id: userId }).populate('wishes').exec();
  }

  async findByGuest(guestId: string): Promise<Reservation[]> {
    return this.reservationModel.find({ guest_id: guestId }).populate('wishes').exec();
  }

  async findOneByUser(userId: string, reservationId: string): Promise<Reservation> {
    // Vérifier que l’utilisateur existe
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Chercher la réservation
    const reservation = await this.reservationModel
      .findOne({ _id: reservationId, user_id: userId })
      .populate('wishes')
      .exec();

    if (!reservation) {
      throw new NotFoundException(`Reservation ${reservationId} not found for user ${userId}`);
    }

    return reservation;
  }
}
