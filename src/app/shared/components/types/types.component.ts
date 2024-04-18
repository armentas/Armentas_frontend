import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {

  public products: Product[] = [];
  public collapse: boolean = true;

  constructor(public productService: ProductService) { 
    this.productService.getProducts.subscribe(product => this.products = product);
  }

  ngOnInit(): void {
  }

  get filterbyType() {
    const type = [...new Set(this.products.map(product => product.type))]
    return type
  }

}
