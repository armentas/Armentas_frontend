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
  retrievePaymentIntent: any;
  stripe: Stripe;
  today: string;

  constructor(public productService: ProductService, public route: ActivatedRoute,
    private orderService: OrderService, public apiService: ApiService) { }

  async ngOnInit() {
    this.today = new Date().toDateString();
    this.stripe = await loadStripe(environment.stripe_token);

    this.orderService.checkoutItems.subscribe(response => {
      this.orderDetails = response;
    });

    const clientSecret = new URLSearchParams(window.location.search).get("client_secret");
    if (!clientSecret) {
      return;
    }

    this.retrievePaymentIntent = await this.stripe.retrievePaymentIntent(clientSecret);

    const { paymentMethod } = await this.apiService.getPaymentMethod(this.retrievePaymentIntent.paymentIntent.payment_method);

    await this.saveOrder(paymentMethod.billing_details.name, paymentMethod.billing_details.phone, paymentMethod.type);

  }

  calculateDate(): string {
    const currentDate = new Date();

    // Add 5 days to the current date
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 5);

    return futureDate.toDateString();
  }

  async saveOrder(billingName: string, billingPhone: string, paymentType: string) {
    try {
      const paymentIntent = this.retrievePaymentIntent.paymentIntent;

      const result = await Promise.all(this.orderDetails.product.map(async (prod) => {
        const newOrder = {
          site_name: 'Armentas Distribution-Shop',
          site_order_id: this.orderDetails.orderId,
          buyer: billingName,
          phone: billingPhone,
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
      }));

    } catch (error) {
      console.log(error);
    }
  }
}
