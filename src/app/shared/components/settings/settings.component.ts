import { Component, OnInit, Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from "../../services/product.service";
import { Product } from "../../classes/product";
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public products: Product[] = [];
  public search: boolean = false;

  searchInput: string = '';

  public languages = [{
    name: 'English',
    code: 'en'
  }, {
    name: 'French',
    code: 'fr'
  }];

  public currencies = [{
    name: 'Euro',
    currency: 'EUR',
    price: 0.90 // price of euro
  }, {
    name: 'Rupees',
    currency: 'INR',
    price: 70.93 // price of inr
  }, {
    name: 'Pound',
    currency: 'GBP',
    price: 0.78 // price of euro
  }, {
    name: 'Dollar',
    currency: 'USD',
    price: 1 // price of usd
  }]

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    public productService: ProductService,
    private router: Router) {
    this.productService.cartItems.subscribe(response => this.products = response);
  }

  ngOnInit(): void {
  }

  searchToggle() {
    this.search = !this.search;
  }

  changeLanguage(code) {
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(code)
    }
  }

  get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  removeItem(product: any) {
    this.productService.removeCartItem(product);
  }

  changeCurrency(currency: any) {
    this.productService.Currency = currency
  }

  getProductRoute(product: Product): string {
    const cleanedTitle = product.title.replace(/ /g, '-').trim();
    const code = product.sku || ''; // Asegurándonos de que code tenga un valor
    // return `/shop/product/left/sidebar/${cleanedTitle}-${code}`;
    return `/shop/product/left/sidebar/${cleanedTitle}-${code}`;
  }

  searchProduct(event?: KeyboardEvent) {
  // Si existe evento y no es Enter, salimos
  if (event && event.key !== 'Enter') return;

  if (this.searchInput && this.searchInput.trim() !== '') {
    const rutaConQueryParam = '/shop/collection/infinitescroll';
    const queryParams = { search: this.searchInput.trim() };

    this.router.navigate([rutaConQueryParam], { queryParams });
    this.searchToggle();
  }
}

}
