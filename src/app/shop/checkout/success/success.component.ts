import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

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
    private orderService: OrderService) { }

  async ngOnInit() {
    this.today = new Date().toDateString();
    this.stripe = await loadStripe(environment.stripe_token);

    this.orderService.checkoutItems.subscribe(response => {
      this.orderDetails = response;
      console.log(this.orderDetails);
    });


    const clientSecret = new URLSearchParams(window.location.search).get(
      "client_secret"
    );

    if (!clientSecret) {
      return;
    }
    this.retrievePaymentIntent = await this.stripe.retrievePaymentIntent(clientSecret);
  }

  calculateDate(): string {
    const currentDate = new Date();

    // Add 5 days to the current date
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 5);

    return futureDate.toDateString();
  }

}
