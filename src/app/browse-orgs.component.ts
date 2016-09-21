import { Component, OnInit, OnDestroy, ViewChildren, ViewChild, Input, Output, ElementRef, HostListener } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Subscription } from 'rxjs/Subscription';
import { FlashMessagesService } from 'angular2-flash-messages';

import { OrgService } from './services/org.service';
import { UIHelper, Utilities, InfoMessage } from './services/app.service';
import { SearchBox } from './search-box.component';
import { OrgDetailsComponent } from './org-details.component';
import { OrgPostsComponent } from './org-posts.component';

@Component({
	selector: 'orgs-list',
	templateUrl: 'app/browse-orgs.component.html',
	styleUrls: [ 'app/browse-orgs.component.css' ],
	providers: [OrgService, UIHelper, Utilities],
	directives: [SearchBox, OrgDetailsComponent, OrgPostsComponent],
	pipes: []
})

export class BrowseOrgsComponent implements OnInit {
	@ViewChildren('singleItem') $orgs = [];
	@Output() selectedOrg:any = null;
	@Output() selectedFeaturedOrg:any = null;

	private orgs = [];
	private featuredOrgs = [];
	private orgsLoaded:number = 20;
	private orgsShowing:number;
	private orgsSorting = {order: "-name"};
	private searchText:string;
	private searchBoxIsFocused:boolean = false;
	private viewingOrg:boolean = false;
	private viewingFeaturedOrg:boolean = false;
	//private selectedOrg:any = null;

	private isLoading = true;
	private isLoadingFeatured = true;
	private loadingOrgSearch = false;
	private paramsSub:Subscription;
	private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' }) });

	private infoMsg = new InfoMessage();

	constructor(
				private http: Http,
				private orgService: OrgService,
				private helper: UIHelper,
				private utilities: Utilities,
				private route:ActivatedRoute,
				private flash:FlashMessagesService) {
	}

	ngOnInit() {
		this.helper.setTitle("Browse organizations");

		// this.paramsSub = this.route.params.subscribe(params => {
		// 	let notfound = params['404'];
		// 	if (notfound == true) {
		// 		this.flash.show("The thing you were looking for doesn't exist. Sorry!");
		// 	}
		// });

		/** Check for the current order of orgs (i.e. the current value of localStorage.OrgsSorting) **/
		!this.utilities.existsLocally('OrgsSorting')
			? localStorage.setItem('OrgsSorting', JSON.stringify(this.orgsSorting))
			: this.orgsSorting = JSON.parse(localStorage['OrgsSorting']);

		this.orgService.loadOrgs({limit:20}).subscribe(
			data => {
				this.isLoading = false;
				this.orgs = data;
				this.takeCount(this.orgs);
			},
			error => console.log(error)
		);

		this.orgService.loadOrgs({limit:6, filterField:"featured", filterValue:"true"}).subscribe(
			data => {
				this.isLoadingFeatured = false;
				this.featuredOrgs = data;
			},
			error => console.log(error)
		);
	}

	ngDoCheck() {
		this.takeCount(this.$orgs);
	}

	// ngOnDestroy() {
	// 	this.paramsSub.unsubscribe();
	// }

	takeCount(children:any) {
		this.orgsShowing = this.helper.takeCount(children);
	}

	sendInfoMsg(body, type, time = 3000) {
		this.infoMsg.body = body;
		this.infoMsg.type = type;
		window.setTimeout(() => this.infoMsg.body = "", time);
	}

	toggleOrder(attr) {
		if (this.orgsSorting.order.indexOf(attr) === -1) {
			this.orgsSorting.order = '-' + attr;
		}
		else {
			if (this.orgsSorting.order.indexOf('-') > -1) {
				this.orgsSorting.order = '+' + attr;
			} else {
				this.orgsSorting.order = '-' + attr;
			}
		}
		localStorage.setItem('OrgsSorting', JSON.stringify(this.orgsSorting));
	}

	isAscending(order:string) {
		if (order.indexOf("+") > -1) {
			return true;
		} else {
			return false;
		}
	}

	searchOrgs(search:string) {
		this.loadingOrgSearch = true;
		this.orgService.loadOrgs({search:search, field:"name", limit:20})
			.subscribe(
				results => {
					this.orgs = results;
					this.loadingOrgSearch = false;
					this.searchText = search;
				},
				error => console.error(error)
		);
	}

	showMore(increase:number, offset:number) {
		let search = (localStorage["searching"] == "true") ? this.searchText : "";

		this.orgService.loadOrgs({search: this.searchText, limit: increase, offset: offset}).subscribe(
			res => {
				this.isLoading = false;
				console.log(res);
				this.orgs = this.orgs.concat(res);
				this.takeCount(this.$orgs);
			},
			error => console.log(error)
		);
	}

	toggleSearchBoxFocus(event:string) {
		if (event == 'focus') {
			this.searchBoxIsFocused = true;
		}
		if (event == 'blur') {
			this.searchBoxIsFocused = false;
		}
	}

	viewOrg(id:string):void {
		let findOrg = function(org) {
			return org._id === id;
		}
		this.selectedOrg = this.orgs.find(findOrg);
		this.viewingOrg = true;
	}

	viewFeaturedOrg(id:string):void {
		let findOrg = function(org) {
			return org._id === id;
		}
		this.selectedFeaturedOrg = this.orgs.find(findOrg);
		this.viewingFeaturedOrg = true;
	}

	deselectOrg(e:Event, id:string):void {
		console.log(e);
		if (this.viewingOrg && this.selectedOrg._id === id) {
			this.selectedOrg = null;
			this.viewingOrg = false;
		}
	}

	deselectFeaturedOrg(e:Event, id:string):void {
		console.log(e);
		if (this.viewingFeaturedOrg && this.selectedFeaturedOrg._id === id) {
			this.selectedFeaturedOrg = null;
			this.viewingFeaturedOrg = false;
		}
	}

}