import { IsString, IsMongoId, IsOptional, IsDateString } from 'class-validator';

export class CreateWishlistDto {
  @IsMongoId()
  user_id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  dateEvent: Date;

  @IsDateString()
  dateClosed?: Date;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
