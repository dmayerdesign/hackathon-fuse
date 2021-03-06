import { Component, OnInit, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from './services/user.service';
import { UIHelper } from './services/app.service';

@Component({
	selector: 'app',
	templateUrl: 'app/app.component.html',
	styleUrls: ['app/app.component.css']
})

export class AppComponent implements OnInit {
	private isLoggedIn:boolean = false;
	private user:any;
	private location:string;
	private showAccountMenu:boolean = false;
	private viewingAccount:boolean = false;

	constructor(private http:Http,
							private userService:UserService,
							private ui:UIHelper,
							private zone:NgZone,
							private router:Router,
							private route:ActivatedRoute) {

		// Updates the component upon redirect from login
		userService.loginConfirmed$.subscribe(user => {
    	console.log("Login confirmed in app component");
    	console.log(user);
      this.user = user;
      this.isLoggedIn = true;
    });
	}

	ngOnInit() {
		this.userService.getLoggedInUser((err, data) => {
			if (err) console.log(err);
			else {
				this.user = data;
				this.isLoggedIn = true;

				this.http.get("/adminToken").map(res => res.json()).subscribe(
					token => {
						if (this.user.adminToken === token) {
							this.user.isAdmin = true;
						}
					},
					err => console.error(err)
				);
			}
		});

		console.log(this.route);
	}

	ngDoCheck() {
		this.location = encodeURI(window.location.href);
		if (this.route.component === "AccountSettingsComponent") {
			this.viewingAccount = true;
		}
	}

	logIn() {
		this.router.navigate(['/login'], { queryParams: { redirect: this.location } });
	}

	logOut() {
		localStorage.removeItem('profile');
		this.user = null;
		this.isLoggedIn = false;
		this.ui.flash("Bye!", "success");
		this.router.navigate(['/']);
	}

	signUp() {
		this.router.navigate(['/signup']);
	}

	toggleAccountMenu() {
		if (this.showAccountMenu) this.showAccountMenu = false;
		else this.showAccountMenu = true;
	}

	exitAccountMenu() {
		this.showAccountMenu = false;
	}

	navOver(e) {
		e.target.parentNode.parentNode.className += " hovered";
	}

	navOut(e) {
		e.target.parentNode.parentNode.className = e.target.parentNode.parentNode.className.replace(" hovered", "");
	}
}
