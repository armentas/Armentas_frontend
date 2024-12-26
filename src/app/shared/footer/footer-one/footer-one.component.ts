import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-footer-one',
  templateUrl: './footer-one.component.html',
  styleUrls: ['./footer-one.component.scss']
})
export class FooterOneComponent implements OnInit {

  @Input() class: string = 'footer-light' // Default class 
  @Input() themeLogo: string = 'assets/images/icon/pinartes_logo.png' // Default Logo
  @Input() newsletter: boolean = false; // Default True

  public today: number = Date.now();
  all_collections: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getAllCollections.subscribe( response => {
      this.all_collections = response.map(col => {
        if(col.code == 'GG')
          return {
            name:'All'
        }
        return col;
      })  });
  }

}
