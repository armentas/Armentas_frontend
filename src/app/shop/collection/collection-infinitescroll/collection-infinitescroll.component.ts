import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from "../../../shared/services/product.service";
import { Product } from '../../../shared/classes/product';
import * as _ from 'lodash'
import { ApiService } from 'src/app/shared/services/api.service';
import { response } from 'express';

@Component({
  selector: 'app-collection-infinitescroll',
  templateUrl: './collection-infinitescroll.component.html',
  styleUrls: ['./collection-infinitescroll.component.scss']
})
export class CollectionInfinitescrollComponent implements OnInit {

  public grid: string = 'col-lg-3 col-6';
  public layoutView: string = 'grid-view';
  public all_products: any[] = [];
  public all_collections: any[] = [];
  public products: any[] = [];
  public brands: any[] = [];
  public colors: any[] = [];
  public size: any[] = [];
  public minPrice: number = 0;
  public maxPrice: number = 1200;
  public tags: any[] = [];
  public categories: any[] = [];
  public collection: string;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order
  public search: string; // Search param
  public mobileSidebar: boolean = false;
  public loader: boolean = true;
  public finished: boolean = false  // boolean when end of data is reached
  public addItemCount = 8;

  public collectionBanner: string = '';
  public collectionTitle: string = '';
  public collectionDescription: string = '';

  loading: boolean = false;


  constructor(private route: ActivatedRoute, private router: Router,
    private viewScroller: ViewportScroller, public productService: ProductService, private apiService: ApiService) { }

  ngOnInit() {
    // Get Query params..
    this.route.queryParams.subscribe(params => {
      this.loading = true;
      this.products = [];
      this.finished = false;

      this.categories = params.category ? params.category.split(",") : [];
      this.colors = params.color ? params.color.split(",") : [];
      this.minPrice = params.minPrice ? params.minPrice : this.minPrice;
      this.maxPrice = params.maxPrice ? params.maxPrice : this.maxPrice;
      this.tags = [...this.categories, ...this.colors]; // All Tags Array
      this.collection = params.collection ? params.collection : null;
      this.search = params.search ? params.search : null;
      this.sortBy = params.sortBy ? params.sortBy : 'ascending';

      // Get Filtered Products..
      this.productService.filterProducts(this.tags).subscribe(response => {

        // All Products
        this.all_products = response;

        // Sorting Filter
        this.all_products = this.productService.sortProducts(response, this.sortBy);

        // Type Filter
        if (params.collection) {
          if (this.collection !== 'All')
            this.all_products = this.all_products.filter(item => item.collection == this.collection);
        }

        // Price Filter
        this.all_products = this.all_products.filter(item => item.price >= this.minPrice && item.price <= this.maxPrice)

        // Search Filter
        if (this.search) {
          const searchTerm = this.search.toLowerCase();
          this.all_products = this.all_products.filter(item =>
            item.title?.toLowerCase().includes(searchTerm)
          );
        }

        this.addItems();
        this.loading = false;
      }, error => {
        // Manejo de error
        console.error(error);
        this.loading = false;
      })
    });

    this.apiService.getAllCollections.subscribe(response => {
      this.all_collections = response;

      this.route.queryParams.subscribe(params => {
        if (params.collection !== 'All' && !params.search) {
          const coll = this.all_collections.filter(col => col.name === params.collection);
          console.log(this.all_collections);
          this.collectionBanner = coll[0].image;
          this.collectionTitle = coll[0].title;
          this.collectionDescription = coll[0].description;
        } else {
          const coll = this.all_collections.filter(col => col.code === 'GG');
          this.collectionBanner = coll[0].image;
          this.collectionTitle = coll[0].title;
          this.collectionDescription = coll[0].description;
        }
      })
    })
  }

  addItems() {
    if (this.all_products.length == this.products.length) {
      this.finished = true;
      return
    }
    this.products = this.all_products.slice(0, this.addItemCount);
  }

  // Infinite scroll
  public onScroll() {
    // add another items
    this.addItemCount += 8;
    this.addItems();
  }

  // Append filter value to Url
  updateFilter(tags: any) {
    tags.page = null; // Reset Pagination
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: tags,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // SortBy Filter
  sortByFilter(value) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sortBy: value ? value : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Remove Tag
  removeTag(tag) {

    this.categories = this.categories.filter(val => val !== tag);
    this.colors = this.colors.filter(val => val !== tag);

    let params = {
      category: this.categories.length ? this.categories.join(",") : null,
      color: this.colors.length ? this.colors.join(",") : null,
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Clear Tags
  removeAllTags() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: 'All' },
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }



  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if (value == 'list-view')
      this.grid = 'col-lg-12 col-6';
    else
      this.grid = 'col-xl-3 col-6';
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

}
