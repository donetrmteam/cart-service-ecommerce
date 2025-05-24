import { Controller, ParseUUIDPipe, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller()
export class CartController {
  private readonly logger = new Logger('CartController');

  constructor(private readonly cartService: CartService) {}

  @MessagePattern({ cmd: 'get_cart' })
  async getCart(@Payload() data: { userId: string }) {
    this.logger.log(`Received get cart request with data: ${JSON.stringify(data)}`);
    if (!data || !data.userId) {
      this.logger.error('Invalid request: userId is missing');
      throw new Error('userId is required');
    }
    const cart = await this.cartService.getCart(data.userId);
    this.logger.log(`Returning cart: ${JSON.stringify(cart)}`);
    return cart;
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