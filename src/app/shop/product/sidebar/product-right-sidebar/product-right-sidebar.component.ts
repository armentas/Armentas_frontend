import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { SizeModalComponent } from "../../../../shared/components/modal/size-modal/size-modal.component";

@Component({
  selector: 'app-product-right-sidebar',
  templateUrl: './product-right-sidebar.component.html',
  styleUrls: ['./product-right-sidebar.component.scss']
})
export class ProductRightSidebarComponent implements OnInit {

  public products: Product[];
  public product: Product = {};
  public counter: number = 1;
  public activeSlide: any = 0;
  public mobileSidebar: boolean = false;
  public selectedSize: any;
  public active = 1;

  @ViewChild("sizeChart") SizeChart: SizeModalComponent;

  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(private route: ActivatedRoute, private router: Router,
    public productService: ProductService) {
      this.products = JSON.parse(localStorage.getItem('products'));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(response => {
      const prod = this.products.find(p => {
        return p.sku == response.get('slug').toString().split('-').pop();
    } );

      this.product = prod;
      console.log(this.product);
      
    });
  }

  // Get Product Color
  // Color(variants) {
  //   const uniqColor = []
  //   for (let i = 0; i < Object.keys(variants).length; i++) {
  //     if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
  //       uniqColor.push(variants[i].color)
  //     }
  //   }
  //   return uniqColor
  // }

  // // Get Product Size
  // Size(variants) {
  //   const uniqSize = []
  //   for (let i = 0; i < Object.keys(variants).length; i++) {
  //     if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
  //       uniqSize.push(variants[i].size)
  //     }
  //   }
  //   return uniqSize
  // }

  // selectSize(size) {
  //   this.selectedSize = size;
  // }

  // Increament
  increment() {
    this.counter++;
  }

  // Decrement
  decrement() {
    if (this.counter > 1) this.counter--;
  }

  // Add to cart
  async addToCart(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if (status)
      this.router.navigate(['/shop/cart']);
  }

  // Buy Now
  async buyNow(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if (status)
      this.router.navigate(['/shop/checkout']);
  }

  // Add to Wishlist
  addToWishlist(product: any) {
    this.productService.addToWishlist(product);
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

}
