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
  public ProductSliderConfig: any = ProductSlider;

  constructor(public productService: ProductService) {
    this.productService.getProducts.subscribe(response => 
      this.products = response.filter(item => item.type == 'pinata' || item.type == 'piggy_bank')
    );
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

  // Blogs
  public blogs = [{
    image: 'assets/images/blog/6.jpg',
    date: '25 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/7.jpg',
    date: '26 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/8.jpg',
    date: '27 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/9.jpg',
    date: '28 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }]

  ngOnInit(): void {
  }

}
