import { Controller, Get, Post, Body, Param, BadRequestException } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('add')
  async create(@Body() createReservationDto: CreateReservationDto) {
    const reservation = await this.reservationService.create(createReservationDto);
    return {
      id: reservation._id,
    };
  }

  @Post('sync-offline')
  async syncOffline(@Body() dtos: CreateReservationDto[]) {
    if (!Array.isArray(dtos)) {
      throw new BadRequestException('dtos must be an array');
    }

    const saved = [];
    for (const dto of dtos) {
      const created = await this.reservationService.create(dto);
      saved.push(created);
    }
    return saved;
  }


  @Get() // GET /reservation
  async findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id') // GET /reservation/:id
  async findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.reservationService.findByUser(userId);
  }

  @Get('guest/:guestId')
  async findByGuest(@Param('guestId') guestId: string) {
    return this.reservationService.findByGuest(guestId);
  }

  @Get(':reservationId/user/:userId')
  async findOneByUser(
    @Param('userId') userId: string,
    @Param('reservationId') reservationId: string,
  ) {
    return this.reservationService.findOneByUser(userId, reservationId);
  }
}
