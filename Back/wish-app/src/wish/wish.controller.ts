import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wish') // toutes les routes commencent par /wish
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @Post('add')
  async create(@Body() createWishDto: CreateWishDto) {
    return this.wishService.create(createWishDto);
  }

  @Get()
  async findAll() {
    return this.wishService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.wishService.findOne(id);
  }

  @Get('wishlist/:wishlistId')
  async findByWishlist(@Param('wishlistId') wishlistId: string) {
    return this.wishService.findByWishlist(wishlistId);
  }

  @Get('wishlist/:wishlistId/available')
  async findAvailableByWishlist(@Param('wishlistId') wishlistId: string) {
    return this.wishService.findAvailableByWishlist(wishlistId);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishService.update(id, updateWishDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.wishService.remove(id);
  }
}
