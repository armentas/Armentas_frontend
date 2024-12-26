import { Component, HostListener, OnInit } from '@angular/core';
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
  // public ProductSliderConfig: any = ProductSlider;
  public HomeSliderConfig: any = HomeSlider;
  public skeletons: number[] = [];
  public skeletonsSpecial: number[] = Array(2).fill(0);
  public isMobile: boolean = false;

  ProductSliderConfig = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    autoplay: true,
    responsive: {
      0: { items: 2 },
      600: { items: 2 },
      1000: { items: 6 }
    }
  };

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
    this.updateSkeletons(window.innerWidth);

    this.productService.getProducts.subscribe(response => {
      this.products = response;
    
      // Filtrar productos especiales
      this.specialsProducts = response.filter(pro =>
        pro.tags.some(tag => tag.toLowerCase() === 'special'.toLowerCase())
      );
    
      // Si hay menos de 6 elementos, completar con otros productos
      if (this.specialsProducts.length < 6) {
        const additionalProducts = this.products.filter(pro =>
          !this.specialsProducts.includes(pro) // Excluir productos ya incluidos
        );
    
        // Agregar los productos necesarios hasta alcanzar 6
        this.specialsProducts = [
          ...this.specialsProducts,
          ...additionalProducts.slice(0, 6 - this.specialsProducts.length)
        ];
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateSkeletons(event.target.innerWidth); // Ajusta cuando cambia el tamaño
  }

  private updateSkeletons(width: number): void {
    this.isMobile = width <= 430; 
    this.skeletons = Array(this.isMobile ? 2 : 6).fill(0); 
  }

}
