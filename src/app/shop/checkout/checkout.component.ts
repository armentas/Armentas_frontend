import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { ApiService } from 'src/app/shared/services/api.service';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { NgbAlert, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  modal: boolean = false;
  public checkoutForm: UntypedFormGroup;
  public products: Product[] = [];

  public payment: string = 'Stripe';
  public amount: any;
  elements: any;
  clientId: string;

  isLoading: boolean = false;
  stripeMessage: string = '';

  staticAlertClosed: boolean = true;
  alert: Alert = {
    type: 'primary',
    message: ''
  };

  stripe: Stripe;

  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  // @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert;

  constructor(private fb: UntypedFormBuilder,
    public productService: ProductService,
    private orderService: OrderService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private router: Router,
    config: NgbModalConfig) {
    this.checkoutForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalcode: ['', Validators.required]
    });
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripe_token);

    this.productService.cartItems.subscribe(response => {
      this.products = response      
    });
    this.getTotal.subscribe(amount => this.amount = amount);
    this.initConfig();    

    this.checkPayStatus()
  }


  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  // Stripe Payment Gateway
  async initPay() {
    try {
      localStorage.setItem("shippingData", JSON.stringify(this.checkoutForm.value));
      this.openModal();
      console.log(this.amount);
      
      const response = await this.apiService.onProceedToPay2(this.amount);
      this.clientId = response.clientId;

      this.elements = this.stripe.elements({
        clientSecret: response.clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            fontWeightNormal: '500',
            borderRadius: '0px',
            colorPrimary: '#5469d4',
            tabIconSelectedColor: '#fff',
            gridRowSpacing: '16px'
          },
        }
      });

      const paymentElementOptions = {
        layout: "tabs",
      };

      const options = { mode: 'billing' };
      const paymentElement = this.elements.create("payment", paymentElementOptions);
      const addressElement = this.elements.create('address', options);
      paymentElement.mount("#payment-element");
      addressElement.mount('#address-element');

    } catch (error) {
      console.log(error);
    }
  }

  async doPay(e) {
    try {
      this.stripeMessage = '';
      e.preventDefault();
      this.isLoading = true;

      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${environment.returnUrl}/shop/checkout`
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        this.stripeMessage = error.message;
      } else {
        this.stripeMessage = "An unexpected error occurred.";
      }

      this.isLoading = false;

    } catch (error) {
      console.log(error.message)
    }
  }

  async checkPayStatus() {
    try {
      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );

      if (!clientSecret) {
        return;
      }

      const { paymentIntent } = await this.stripe.retrievePaymentIntent(clientSecret);           

      switch (paymentIntent.status) {
        case "succeeded": {
          const shippingData = JSON.parse(localStorage.getItem('shippingData'));

          await this.apiService.updatePaymentIntentShipping(paymentIntent.id, shippingData)
          
          this.orderService.createOrder(this.products, this.checkoutForm.value, this.orderIDGenerator(), this.amount);
          // localStorage.removeItem("cartItems");
          this.router.navigate(['/shop/checkout/success/data'], { queryParams: { client_secret: paymentIntent.client_secret } });
          break;
        }
        case "processing": {
          this.alert = {
            type: 'primary',
            message: 'Your payment is processing.',
          }
          this.staticAlertClosed = false
          break;
        }
        case "requires_payment_method": {
          this.alert = {
            type: 'danger',
            message: 'Your payment was not successful, please try again.',
          }
          this.staticAlertClosed = false
          break;
        }
        default:
          {
            this.alert = {
              type: 'danger',
              message: 'Something went wrong.',
            }
            this.staticAlertClosed = false
            break;
          }
      }
    } catch (error) {
      console.log(error)
    }
  }

  orderIDGenerator() {
    const prefijo = 'AR-';
    const fecha = new Date();
  
    // Obtenemos los componentes de la fecha
    const year = fecha.getFullYear().toString().slice(-2);
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const day = ('0' + fecha.getDate()).slice(-2);
    const hours = ('0' + fecha.getHours()).slice(-2);
    const minutes = ('0' + fecha.getMinutes()).slice(-2);
    const seconds = ('0' + fecha.getSeconds()).slice(-2);
    const milliseconds = ('00' + fecha.getMilliseconds()).slice(-3);
  
    // Construimos el código
    const codigo = `${prefijo}${year}${month}${day}-${hours}${minutes}${seconds}${milliseconds}`;
  
    return codigo;
  }

  async closeModal() {
    const status = await this.apiService.cancelPaymentIntent(this.clientId);
    console.log(status);
    this.modal = false;
  }

  // Función para abrir el modal
  openModal() {
    this.modal = true;
  }


  // Paypal Payment Gateway
  private initConfig(): void {
  }

}
