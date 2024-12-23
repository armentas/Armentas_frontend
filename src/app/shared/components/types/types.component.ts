import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Collection } from '../../classes/collection';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit, AfterViewInit {

  public products: Product[] = [];
  public all_collections: Collection[] = [];
  public collapse: boolean = true;
  public activeCollection: string;

  constructor(public productService: ProductService, private route: ActivatedRoute, private apiService: ApiService) { 
    // this.productService.getProducts.subscribe(product => this.products = product);
    this.apiService.getAllCollections.subscribe( response => {
      this.all_collections = response  });
  }

  ngOnInit(): void {
  }

  get filterbyCollection() {
    // const collection = [...new Set(this.products.map(product => product.collection))]
    const collection = this.all_collections.map(col => {
      if(col.code == 'GG')
        return 'All';
      return col.name;
    })
    return collection
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      this.activeCollection = params.collection;
    })
  }

}
