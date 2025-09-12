import { IsString } from 'class-validator';

export class CreateGuestDto {
  @IsString()
  pseudo: string;

  @IsString()
  token: string;
}
