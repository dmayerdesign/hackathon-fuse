import { NgModule, Injectable } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UPLOAD_DIRECTIVES } from 'ng2-uploader';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { AboutComponent } from './about.component';
import { LibraryComponent } from './library.component';
import { BrowseOrgsComponent } from './browse-orgs.component';
import { OrgDetailsComponent } from './org-details.component';
import { OrgPostsComponent } from './org-posts.component';
import { SingleOrgComponent } from './single-org.component';
import { SearchBox } from './search-box.component';
import { ContactComponent } from './contact.component';

import { UserService } from './services/user.service';
import { SearchService } from './services/search.service';
import { ClickOutsideModule } from 'ng2-click-outside';

import { enableProdMode } from '@angular/core';
enableProdMode();

const routing = RouterModule.forRoot([
    { path: 'browse', component: BrowseOrgsComponent }
  , { path: 'login', component: LoginComponent }
  , { path: 'about', component: AboutComponent }
  , { path: 'library', component: LibraryComponent }
  , { path: 'contact', component: ContactComponent }
  , { path: 'organization/:id', component: SingleOrgComponent }
  , { path: '', component: BrowseOrgsComponent }
]); // the order of this array matters

@NgModule({
    imports: [
      BrowserModule,
    	routing,
      HttpModule,
    	FormsModule,
    	ReactiveFormsModule,
      ClickOutsideModule
    ],
    declarations: [
      AppComponent,
      LoginComponent,
      BrowseOrgsComponent,
      OrgDetailsComponent,
      OrgPostsComponent,
      SingleOrgComponent,
    	AboutComponent,
      LibraryComponent,
      ContactComponent,
      UPLOAD_DIRECTIVES
    ],
    providers: [
      Title,
      UserService,
      SearchBox,
      SearchService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }