import { IsString, IsArray } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  user_id: string;

  @IsString()
  wishlist_id: string;

  @IsString()
  guest_id: string;

  @IsArray()
  wishes: string[];
}
