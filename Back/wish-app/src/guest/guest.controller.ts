import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';

@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post('add') // POST /guest/add
  async create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestService.create(createGuestDto);
  }

  @Get() // GET /guest
  async findAll() {
    return this.guestService.findAll();
  }

  @Get(':id') // GET /guest/:id
  async findOne(@Param('id') id: string) {
    return this.guestService.findOne(id);
  }
}
