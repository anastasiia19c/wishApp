import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('add') // POST /reservation/add
  async create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get() // GET /reservation
  async findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id') // GET /reservation/:id
  async findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }
}
