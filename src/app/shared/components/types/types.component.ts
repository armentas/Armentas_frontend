import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit, AfterViewInit {

  public products: Product[] = [];
  public collapse: boolean = true;
  public activeType: string;

  constructor(public productService: ProductService, private route: ActivatedRoute) { 
    this.productService.getProducts.subscribe(product => this.products = product);
  }

  ngOnInit(): void {
  }

  get filterbyType() {
    const type = [...new Set(this.products.map(product => product.type))]
    return type
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      this.activeType = params.type;
    })
  }

}
