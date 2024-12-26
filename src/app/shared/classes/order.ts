import { Product } from './product';

// Order
export interface Order {
    shippingDetails?: any;
    product?: Product[];
    orderId?: any;
    totalAmount?: any;
    shippingAmount?: any;
}

export interface Buyer {
    name?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
    postal_code?: string;
    street?: string;
}