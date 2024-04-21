import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from "../../../shared/services/product.service";
import { Product } from '../../../shared/classes/product';
import * as _ from 'lodash'

@Component({
  selector: 'app-collection-infinitescroll',
  templateUrl: './collection-infinitescroll.component.html',
  styleUrls: ['./collection-infinitescroll.component.scss']
})
export class CollectionInfinitescrollComponent implements OnInit {

  public grid: string = 'col-lg-2';
  public layoutView: string = 'grid-view';
  public all_products: any[] = [];
  public products: any[] = [];
  public brands: any[] = [];
  public colors: any[] = [];
  public size: any[] = [];
  public minPrice: number = 0;
  public maxPrice: number = 1200;
  public tags: any[] = [];
  public categories: any[] = [];
  public type: string;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order
  public mobileSidebar: boolean = false;
  public loader: boolean = true;
  public finished: boolean = false  // boolean when end of data is reached
  public addItemCount = 8;
  public imageBanner: string = '';

  contentSelected: any;
  content: any[] = [
    {
      title: 'Piñatas',
      description: `Welcome to our exclusive piñata paradise! Immerse yourself in a world where imagination reigns and every celebration becomes a masterpiece. Whether you're planning a sophisticated soiree for adults or a whimsical gathering for the little ones, our diverse range of designs ensures there's something for everyone. From majestic unicorns to racing cars, our piñatas are made with care and attention to detail, guaranteeing smiles and laughter at every turn. Explore our collection today and get the party started!`
    },
    {
      title: 'Piggy bank',
      description: `Welcome to our Mexican-inspired piggy bank paradise! Step into a world where traditional charm meets modern convenience, all wrapped up in a colorful fiesta of savings. Our collection of piggy banks boasts a diverse array of shapes and sizes, each infused with the vibrant spirit of Mexico. From sombrero-wearing burros to mariachi-playing guitars, our alcancías (piggy banks) capture the essence of Mexican culture in every detail. Whether you're saving up for your next adventure or simply adding a touch of fiesta to your home decor.`
    },
    {
      title: 'All our products',
      description: `Welcome to our vibrant collection of Mexican-inspired treasures! Immerse yourself in a world where rich cultural heritage meets contemporary flair, all wrapped up in a fiesta of colors and craftsmanship. With each piece lovingly crafted by skilled artisans, our collection invites you to experience the magic of Mexico wherever you are. So why not bring a little piece of Mexico into your life today? Explore our collection.`
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router,
    private viewScroller: ViewportScroller, public productService: ProductService) {
    // Get Query params..
    this.route.queryParams.subscribe(params => {
      this.products = [];
      this.finished = false;

      this.categories = params.category ? params.category.split(",") : [];
      this.colors = params.color ? params.color.split(",") : [];
      this.minPrice = params.minPrice ? params.minPrice : this.minPrice;
      this.maxPrice = params.maxPrice ? params.maxPrice : this.maxPrice;
      this.tags = [...this.brands, ...this.colors, ...this.size]; // All Tags Array
      this.type = params.type ? params.type : null;
      this.sortBy = params.sortBy ? params.sortBy : 'ascending';

      // Get Filtered Products..
      this.productService.filterProducts(this.tags).subscribe(response => {

        // All Products
        this.all_products = response;

        // Sorting Filter
        this.all_products = this.productService.sortProducts(response, this.sortBy);

        // Type Filter
        if (params.type) {
          if (this.type !== 'All')
            this.all_products = this.all_products.filter(item => item.type == this.type);
          else
            this.all_products = this.all_products;
        }

        // Price Filter
        this.all_products = this.all_products.filter(item => item.price >= this.minPrice && item.price <= this.maxPrice)

        this.addItems();

      })
    })
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.type == 'Piñata') {
        this.imageBanner = 'assets/images/banner/Pinatas.png';
        this.contentSelected = this.content[0];
      }
      else if (params.type == 'Piggy bank') {
        this.imageBanner = 'assets/images/banner/Piggy bank.png';
        this.contentSelected = this.content[1];
      } else {
        this.imageBanner = 'assets/images/banner/All.png';
        this.contentSelected = this.content[2];
      }
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
      this.grid = 'col-lg-12';
    else
      this.grid = 'col-xl-3 col-md-6';
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

}
