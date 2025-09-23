import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Public } from 'src/auth/public.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('guest')
export class GuestController {
  constructor(
    private readonly guestService: GuestService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('add')
  async create(@Body() createGuestDto: CreateGuestDto) {
    const guest = await this.guestService.create(createGuestDto);

    // On génère un token avec l'ID du guest
    const payload = { role: 'guest' ,guest_id: guest._id.toString()};
    const token = this.jwtService.sign(payload);

    return { token, role: 'guest', guest };
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
