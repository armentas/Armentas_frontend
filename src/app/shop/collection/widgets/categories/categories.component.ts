import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/classes/category';
import { Product } from 'src/app/shared/classes/product';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @Input() products: Product[] = [];
  @Input() categories: any[] = [];

  @Output() categoriesFilter: EventEmitter<any> = new EventEmitter<any>();

  public collapse: boolean = true;
  filterbyCategories: Category[] = [];

  constructor(public apiService: ApiService) { 
  }

  ngOnInit(): void {
    this.apiService.getAllCategories.subscribe( response => {
      this.filterbyCategories = response;
    })
  }

  // get filterbyCategories() {
  //   const uniqueBrands = [];
  //   this.products.filter((product) => {
  //     if (product.brand) {
  //       const index = uniqueBrands.indexOf(product.category)
  //       if (index === -1) uniqueBrands.push(product.category)
  //     }
  //   })
  //   return uniqueBrands
  // }

  appliedFilter(event) {
    let index = this.categories.indexOf(event.target.value);  // checked and unchecked value
    if (event.target.checked)   
      this.categories.push(event.target.value); // push in array cheked value
    else 
      this.categories.splice(index,1);  // removed in array unchecked value  
    
    let categories = this.categories.length ? { category: this.categories.join(",") } : { category: null };
    this.categoriesFilter.emit(categories);
  }

  // check if the item are selected
  checked(item){
    if(this.categories.indexOf(item) != -1){
      return true;
    }
  }

}
