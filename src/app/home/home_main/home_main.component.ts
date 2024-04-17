import { Component, OnInit } from '@angular/core';
import { ProductSlider } from '../../shared/data/slider';
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

  constructor(public productService: ProductService) {
    this.productService.getProducts.subscribe(response => {
      this.products = response.filter(item => item.type == 'Piñata' || item.type == 'Piggy bank')
      this.specialsProducts = response.filter(item => {
        const lowercaseTags = item.tags.map(tag => tag.toLowerCase());
        return lowercaseTags.includes('special') || lowercaseTags.includes('especial');
      });

      console.log(this.products);
      console.log(this.specialsProducts);
    });



  }

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
  }

}
