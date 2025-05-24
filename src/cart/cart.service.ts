import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Cart, CartItem } from './interfaces/cart.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger('CartService');
  private carts: Map<string, Cart> = new Map(); 

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  async getCart(userId: string): Promise<Cart> {
    this.logger.log(`Getting cart for user ${userId}`);
    const cart = this.carts.get(userId);
    
    if (!cart) {
      this.logger.log(`No cart found for user ${userId}, creating new cart`);
      const newCart: Cart = { userId, items: [], totalAmount: 0 };
      this.carts.set(userId, newCart);
      return newCart;
    }

    this.logger.log(`Cart found for user ${userId}: ${JSON.stringify(cart)}`);
    return cart;
  }

  async addItemToCart(addToCartDto: AddToCartDto): Promise<Cart> {
    const { userId, product } = addToCartDto;
    let cart = this.carts.get(userId);

    if (!cart) {
      cart = { userId, items: [], totalAmount: 0 };
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === product.productId,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += product.quantity;
    } else {
      cart.items.push({
        productId: product.productId,
        quantity: product.quantity,
        price: product.price, 
        name: product.name,   
      });
    }

    cart.totalAmount = this.calculateTotal(cart.items);
    this.carts.set(userId, cart);
    return cart;
  }

  async updateItemQuantity(updateDto: UpdateCartItemDto): Promise<Cart> {
    const { userId, productId, quantity } = updateDto;
    const cart = this.carts.get(userId);

    if (!cart) {
      throw new NotFoundException(`Cart not found for user ${userId}`);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException(`Product ${productId} not found in cart`);
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.totalAmount = this.calculateTotal(cart.items);
    this.carts.set(userId, cart);
    return cart;
  }

  async removeItemFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = this.carts.get(userId);
    if (!cart) {
      throw new NotFoundException(`Cart not found for user ${userId}`);
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.productId !== productId);

    if (cart.items.length === initialLength) {
      throw new NotFoundException(`Product ${productId} not found in cart`);
    }

    cart.totalAmount = this.calculateTotal(cart.items);
    this.carts.set(userId, cart);
    return cart;
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = this.carts.get(userId);
    if (!cart) {
      return { userId, items: [], totalAmount: 0 };
    }
    cart.items = [];
    cart.totalAmount = 0;
    this.carts.set(userId, cart);
    return cart;
  }
} 