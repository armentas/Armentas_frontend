import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { environment } from 'src/environments/environment';
import { lastValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  onProceedToPay(products: Product[]): any {
    return lastValueFrom(this.http.post(`${environment.baseUrl}/payment/checkout`, { items: products }));
  }

  onProceedToPay2(amount: number): any {
    return lastValueFrom(this.http.post(`${environment.baseUrl}/payment/payment-intent`, { amount }));
  }

  cancelPaymentIntent(paymentIntentId: string): any {
    return lastValueFrom(this.http.get(`${environment.baseUrl}/payment/cancel-payment-intent/${paymentIntentId}`));
  }

  updatePaymentIntentShipping(paymentIntentId: string, data: any): any {
    return lastValueFrom(this.http.post(`${environment.baseUrl}/payment/update-payment-intent-shipping/${paymentIntentId}`, { data } ));
  }

  getPaymentMethod(paymentMethodId: string): any {
    return lastValueFrom(this.http.get(`${environment.baseUrl}/payment/get-payment-method/${paymentMethodId}`));
  }

  saveOrder(data: any): any {
    return lastValueFrom(this.http.post(`${environment.baseUrl}/payment/save-order`, { data }));
  }
}
