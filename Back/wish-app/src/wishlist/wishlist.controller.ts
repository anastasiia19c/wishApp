import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('add') // POST /wishlist/add
  async create(@Body() dto: CreateWishlistDto) {
    return this.wishlistService.create(dto);
  }

  @Get() // GET /wishlist
  async findAll() {
    return this.wishlistService.findAll();
  }

  @Get(':id') // GET /wishlist/:id
  async findOne(@Param('id') id: string) {
    return this.wishlistService.findOne(id);
  }

  @Get('user/:userId') // GET /wishlist/user/:userId
  async findByUser(@Param('userId') userId: string) {
    return this.wishlistService.findByUser(userId);
  }

  @Get(':id/:userId')
  async findOneByUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.wishlistService.findOneByUser(id, userId);
  }

  @Put('update/:id') // PUT /wishlist/update/:id
  async update(@Param('id') id: string, @Body() dto: UpdateWishlistDto) {
    return this.wishlistService.update(id, dto);
  }

  @Delete('delete/:id') // DELETE /wishlist/delete/:id
  async remove(@Param('id') id: string) {
    return this.wishlistService.remove(id);
  }
}
