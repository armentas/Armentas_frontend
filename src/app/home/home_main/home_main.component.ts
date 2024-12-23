import { Component, OnInit } from '@angular/core';
import { HomeSlider, ProductSlider } from '../../shared/data/slider';
import { Product } from '../../shared/classes/product';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-home-main',
  templateUrl: './home_main.component.html',
  styleUrls: ['./Home_main.component.scss']
})
export class HomeMainComponent implements OnInit {

  public products: Product[] = [];
  public specialsProducts: Product[] = [];
  public ProductSliderConfig: any = ProductSlider;
  public HomeSliderConfig: any = HomeSlider;


  constructor(public productService: ProductService) {  }


  // Sliders
  public sliders = [{
    title: '',
    subTitle: 'Mexican Products',
    color: '#000000',
    image: 'assets/images/slider/testarmenta.png'
  }, {
    title: '',
    subTitle: 'Piggy bank',
    color: '#000000',
    image: 'assets/images/slider/alcancias.png'
  }];

  ngOnInit(): void {
    this.productService.getProducts.subscribe(response => {
      this.products = response;
      this.specialsProducts = response.filter(item => {
        const lowercaseTags = item.tags.map(tag => tag.toLowerCase());
        return lowercaseTags.includes('special') || lowercaseTags.includes('especial');
      });
    });
  }

}
