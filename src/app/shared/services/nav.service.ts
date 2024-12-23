import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

// Menu
export interface Menu {
	path?: string;
	param?: string;
	title?: string;
	type?: string;
	megaMenu?: boolean;
	image?: string;
	active?: boolean;
	badge?: boolean;
	badgeText?: string;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	basicCollections: string[] = ['All']

	constructor(private apiService: ApiService) { 
		this.loadCollections();
	}

	public screenWidth: any;
	public leftMenuToggle: boolean = false;
	public mainMenuToggle: boolean = false;

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{ 
			path: '/home/main', title: 'Home', type: 'link' 
		},
		// {
		// 	title: 'Shop', type: 'sub', active: false, children: [
		// 		{ path: '/shop/collection/infinitescroll', title: 'Piñatas', param: 'Piñata', type: 'link' },
		// 		{ path: '/shop/collection/infinitescroll', title: 'Piggy bank', param: 'Piggy bank', type: 'link' },
		// 		{ path: '/shop/collection/infinitescroll', title: 'All', param: 'All', type: 'link' }
		// 	]
		// },
		{ 
			path: '/pages/aboutus', title: 'About us', type: 'link' 
		},
		{ 
			path: '/pages/contact', title: 'Contact', type: 'link' 
		},
	];


	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
	// leftMenuItems = new BehaviorSubject<Menu[]>(this.LEFTMENUITEMS);

	private loadCollections() {
		// Obtén las primeras cuatro colecciones del servicio CollectionService
		this.apiService.getAllCollections.subscribe((collections) => {
			const basicCollectionsFilteres = collections.filter((collection) => {
				return !this.basicCollections.includes(collection.name) && collection.code !== 'GG';
			});

			const basicMenuItems = basicCollectionsFilteres.map((collection) => {
				return {
					path: '/shop/collection/infinitescroll',
					param: collection.name,
					title: collection.name,
					type: 'link',
					active: false,
					children: null
				};
			});

			basicMenuItems.push({
				path: '/shop/collection/infinitescroll',
				param: 'All',
				title: 'All',
				type: 'link',
				active: false,
				children: null
			})

			// Agrega las colecciones dinámicas al menú
			this.MENUITEMS.splice(1, 0, {
				title: 'Shop',
				type: 'sub',
				active: false,
				children: basicMenuItems,
			});

		});
	}

}
