import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from "../../../shared/services/product.service";
import { Product } from '../../../shared/classes/product';

@Component({
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: ['./collection-left-sidebar.component.scss']
})
export class CollectionLeftSidebarComponent implements OnInit, AfterViewInit {

  public grid: string = 'col-lg-2';
  public layoutView: string = 'grid-view';

  public products: Product[] = [];
  public brands: any[] = [];
  public categories: any[] = [];
  public colors: any[] = [];
  public size: any[] = [];
  public minPrice: number = 0;
  public maxPrice: number = 1200;
  public tags: any[] = [];
  public collection: string;

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
  ];

  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order
  public mobileSidebar: boolean = false;
  public loader: boolean = true;

  public imageBanner: string = '';

  constructor(private route: ActivatedRoute, private router: Router,
    private viewScroller: ViewportScroller, public productService: ProductService) {
    // Get Query params..
    this.route.queryParams.subscribe(params => {
      this.categories = params.category ? params.category.split(",") : [];
      this.colors = params.color ? params.color.split(",") : [];
      this.minPrice = params.minPrice ? params.minPrice : this.minPrice;
      this.maxPrice = params.maxPrice ? params.maxPrice : this.maxPrice;
      this.tags = [...this.categories, ...this.colors]; // All Tags Array

      this.collection = params.collection ? params.collection : null;
      this.sortBy = params.sortBy ? params.sortBy : 'ascending';
      this.pageNo = params.page ? params.page : this.pageNo;

      // Get Filtered Products ..
      this.productService.filterProducts(this.tags).subscribe(response => {
        // Sorting Filter
        this.products = this.productService.sortProducts(response, this.sortBy);
        // Type Filter
        if (params.collection) {
          if (this.collection !== 'All')
            this.products = this.products.filter(item => item.collection == this.collection);
          else
            this.products = response;
        }
        // Colors Filter
        // this.products = this.products.filter(product => {
        //   if(product.colors)
        //     return product.colors.split(',').some( color => this.colors.includes(color))
        // })

        // Price Filter
        this.products = this.products.filter(item => item.price >= this.minPrice && item.price <= this.maxPrice)
        // Paginate Products
        this.paginate = this.productService.getPager(this.products.length, +this.pageNo);     // get paginate object from service
        this.products = this.products.slice(this.paginate.startIndex, this.paginate.endIndex + 1); // get current page of items
      })
    })
  }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.type == 'Piñata'){
        this.imageBanner = 'assets/images/banner/Pinatas2.png';
        this.contentSelected = this.content[0];
      }
      else
      {
        this.imageBanner = 'assets/images/banner/Piggy bank.png';
        this.contentSelected = this.content[1];
      }
    })
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

    this.brands = this.brands.filter(val => val !== tag);
    this.categories = this.categories.filter(val => val !== tag);
    this.colors = this.colors.filter(val => val !== tag);

    let params = {
      brand: this.brands.length ? this.brands.join(",") : null,
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
      queryParams: {type: 'All'},
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // product Pagination
  setPage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
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
