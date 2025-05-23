import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateCartItemDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
} 