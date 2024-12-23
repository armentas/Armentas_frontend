import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { environment } from 'src/environments/environment';
import { from, lastValueFrom, map, Observable } from 'rxjs';
import { Collection } from '../classes/collection';
import { Category } from '../classes/category';

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

  /* ----------------------- Collection -------------------- */

  private async collections(): Promise<Collection[]> {
    try {
      const response = await lastValueFrom(this.http.get<{ data: Collection[] }>(`${environment.baseUrl}/collections/getAllCollections`));
      const collections = response.data;
  
      localStorage['collections'] = JSON.stringify(collections);
  
      return collections;
    } catch (error) {
      // Manejar errores aquí según tus necesidades
      console.error('Error al obtener colecciones:', error);
      throw error;
    }
  }

  public get getAllCollections(): Observable<Collection[]> {
    return from(this.collections());
  }

  /* ----------------------- Categories -------------------- */

  private async categories(): Promise<Category[]> {
    try {
      const response = await lastValueFrom(this.http.get<{ data: Category[] }>(`${environment.baseUrl}/categories/getAllCategories`));
      const categories = response.data;
  
      localStorage['categories'] = JSON.stringify(categories);
  
      return categories;
    } catch (error) {
      // Manejar errores aquí según tus necesidades
      console.error('Error al obtener colecciones:', error);
      throw error;
    }
  }

  public get getAllCategories(): Observable<Category[]> {
    return from(this.categories());
  }
}
