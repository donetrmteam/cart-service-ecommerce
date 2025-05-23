import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern({ cmd: 'get_cart' })
  async getCart(@Payload('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @MessagePattern({ cmd: 'add_item_to_cart' })
  async addItemToCart(@Payload() addToCartDto: AddToCartDto) {
    return this.cartService.addItemToCart(addToCartDto);
  }

  @MessagePattern({ cmd: 'update_item_quantity' })
  async updateItemQuantity(@Payload() updateDto: UpdateCartItemDto) {
    return this.cartService.updateItemQuantity(updateDto);
  }

  @MessagePattern({ cmd: 'remove_item_from_cart' })
  async removeItemFromCart(
    @Payload('userId') userId: string,
    @Payload('productId') productId: string,
  ) {
    return this.cartService.removeItemFromCart(userId, productId);
  }

  @MessagePattern({ cmd: 'clear_cart' })
  async clearCart(@Payload('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
} 