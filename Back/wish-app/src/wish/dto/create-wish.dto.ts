import { IsString, IsOptional, IsNumber, IsEnum, IsUrl } from 'class-validator';

export class CreateWishDto {
    @IsString()
    user_id: string;

    @IsString()
    wishlist_id: string;

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUrl()
    url?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsEnum(['available', 'reserved'])
    status: string;
}
