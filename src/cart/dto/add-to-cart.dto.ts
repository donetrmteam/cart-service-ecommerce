import { IsNotEmpty, IsString, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDetailsDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number; 

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  userId: string; 

  @ValidateNested()
  @Type(() => ProductDetailsDto)
  product: ProductDetailsDto;
} 