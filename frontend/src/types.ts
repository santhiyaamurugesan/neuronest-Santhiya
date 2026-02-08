export interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface Product {
    _id: string;
    name: string;
    image: string;
    description: string;
    brand: string;
    category: string;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
    purity?: string;
    weight?: number;
    stone?: string;
}

export interface CartItem extends Product {
    qty: number;
}

export interface UserInfo {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    isAdmin: boolean;
    token: string;
}

export interface CartState {
    cartItems: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: string;
    shippingPrice: string;
    taxPrice: string;
    totalPrice: string;
}

export interface AuthState {
    userInfo: UserInfo | null;
}

export interface WishlistState {
    wishlistItems: Product[];
}

export interface Order {
    _id: string;
    user: UserInfo;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentResult?: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: string;
    isDelivered: boolean;
    deliveredAt: string;
    isCancelled: boolean;
    cancelledAt?: string;
    createdAt: string;
}

export interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
}

export interface CreateOrderRequest {
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
}

export interface RootState {
    cart: CartState;
    auth: AuthState;
    wishlist: WishlistState;
    [key: string]: any;
}

export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    email_address?: string;
}

export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
}
