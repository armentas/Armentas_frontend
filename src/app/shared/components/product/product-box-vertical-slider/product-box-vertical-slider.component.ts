import { Component, OnInit, Input } from '@angular/core';
import { NewProductSlider } from '../../../data/slider';
import { Product } from '../../../classes/product';
import { ProductService } from '../../../services/product.service';
import { log } from 'console';

@Component({
  selector: 'app-product-box-vertical-slider',
  templateUrl: './product-box-vertical-slider.component.html',
  styleUrls: ['./product-box-vertical-slider.component.scss']
})
export class ProductBoxVerticalSliderComponent implements OnInit {

  @Input() title: string = 'New Product'; // Default
  @Input() type: string = 'Piñata'; // Default Fashion

  public products: Product[] = [];

  public NewProductSliderConfig: any = NewProductSlider;

  constructor(public productService: ProductService) {
    this.productService.getProducts.subscribe(response => {
      if (this.type !== 'All')
        this.products = response.filter(item => item.type == this.type && item.new)
      else
        this.products = response;
    });
  }

  ngOnInit(): void {
  }

  getProductRoute(product: Product): string {
    const cleanedTitle = product.title.replace(/ /g, '-').trim();
    const code = product.sku || ''; // Asegurándonos de que code tenga un valor
    return `/shop/product/right/sidebar/${cleanedTitle}-${code}`;
  }
}
