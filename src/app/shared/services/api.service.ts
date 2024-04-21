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
}
