import { Component, OnInit } from '@angular/core';
import { Buyer, Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  public orderDetails: Order = {};
  public total: number;
  retrievePaymentIntent: any;
  stripe: Stripe;
  today: string;

  constructor(public productService: ProductService, public route: ActivatedRoute,
    private orderService: OrderService, public apiService: ApiService) { }

  async ngOnInit() {
    try {
      const billingEmail = JSON.parse(localStorage.getItem('billingEmail'));
      this.today = new Date().toDateString();
      this.stripe = await loadStripe(environment.stripe_token);

      this.orderService.checkoutItems.subscribe(response => {
        this.orderDetails = response;
      });

      this.total = this.orderDetails.totalAmount + this.orderDetails.shippingAmount;

      const clientSecret = new URLSearchParams(window.location.search).get("client_secret");
      if (!clientSecret) {
        return;
      }

      this.retrievePaymentIntent = await this.stripe.retrievePaymentIntent(clientSecret);

      const { paymentMethod } = await this.apiService.getPaymentMethod(this.retrievePaymentIntent.paymentIntent.payment_method);

      await this.saveOrder(billingEmail, paymentMethod.billing_details.name, paymentMethod.type);

      this.cleanCart();
    } catch (error) {
      console.log(error);

    }
  }

  cleanCart() {
    const items = JSON.parse(localStorage.getItem("cartItems"));

    for (let i = 0; i < items.length; i++) {
      this.productService.removeCartItem(items[i]);
    }
  }

  calculateDate(): string {
    const currentDate = new Date();

    // Add 5 days to the current date
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 5);

    return futureDate.toDateString();
  }

  async saveOrder(billingEmail: string, billingName: string, paymentType: string) {
    try {
      const paymentIntent = this.retrievePaymentIntent.paymentIntent;

      const result = await Promise.all(this.orderDetails.product.map(async (prod) => {
        const newOrder = {
          site_name: 'PinArtes',
          site_order_id: this.orderDetails.orderId,
          buyer: billingName,
          contact: billingEmail,
          sku: prod.sku,
          order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
          order_total: this.orderDetails.totalAmount,
          proportional: prod.price * prod.quantity,
          quantity: prod.quantity,
          price: prod.price,
          title: prod.title,
          shipping_status: 'Awaiting shipment',
          street_1: paymentIntent.shipping.address.line1,
          shipping_city: paymentIntent.shipping.address.city,
          shipping_postal_code: paymentIntent.shipping.address.postal_code,
          shipping_state_province: paymentIntent.shipping.address.state,
          shipping_country: paymentIntent.shipping.address.country,
          shipping_target_name: paymentIntent.shipping.name,
          shipping_target_phone: paymentIntent.shipping.phone,
          tracking_number: '',
          carrier: '',
          service_code: '',
          payment_id: paymentIntent.id,
          payment_type: paymentType,
          payment_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
          promotional_code: ''
        }
        await this.apiService.saveOrder(newOrder);

        // Actualizar el stock de cada uno de los productos
        await this.updateStock(newOrder.sku, newOrder.quantity);

      }));

      // Enviar mensaje de Confirmacion de Orden
      await this.sendOrderConfirmation(billingEmail, billingName, paymentType)

    } catch (error) {
      console.log(error);
    }
  }

  async sendOrderConfirmation(billingEmail: string, billingName: string, paymentType: string) {
    try {
      const data = {
        "email": billingEmail,
        "fullOrder": {
          "site_name": "PinArtes",
          "site_order_id": this.orderDetails.orderId,
          "buyer": billingName,
          "contact": billingEmail,
          "order_date": new Date().toISOString().slice(0, 19).replace('T', ' '),
          "order_total": this.orderDetails.totalAmount,
          "shipping_amount": this.orderDetails.shippingAmount,
          "shipping_status": "Awaiting shipment",
          "street_1": this.retrievePaymentIntent.paymentIntent.shipping.address.line1,
          "shipping_city": this.retrievePaymentIntent.paymentIntent.shipping.address.city,
          "shipping_postal_code": this.retrievePaymentIntent.paymentIntent.shipping.address.postal_code,
          "shipping_state_province": this.retrievePaymentIntent.paymentIntent.shipping.address.state,
          "shipping_country": this.retrievePaymentIntent.paymentIntent.shipping.address.country,
          "shipping_target_name": this.retrievePaymentIntent.paymentIntent.shipping.name,
          "shipping_target_phone": this.retrievePaymentIntent.paymentIntent.shipping.phone,
          "payment_type": paymentType,
          "product": this.orderDetails.product
        }
      }

      await this.apiService.sendOrderConfirmation(data);

    } catch (error) {
      console.log(error);
    }

  }

  async updateStock(sku: string, quantity: number) {
    try {
      const { data } = await this.apiService.getProductbySKU(sku);

      if (data.length > 0)
        await this.apiService.updateProductStock(data[0].id, data[0].stock - quantity);

    } catch (error) {
      console.log(error);

    }

  }
}
