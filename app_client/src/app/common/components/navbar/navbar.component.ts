import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services';

@Component({
  selector: 'mmw-navigation',
  templateUrl: 'navbar.html'
})
export default class NavbarComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public currentUser: any = { name : '' };
  public currentPath: string = 'fakeString';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(){
    this.authService.loginEvent
    .subscribe(user => {
        console.log('NAVIGATION: ');
        console.log(user);

        if (user === null) {
          this.isLoggedIn = false;
          this.currentUser = {name : ''};
        } else {
          this.isLoggedIn = true;
          if (user.local) {
            this.setCurrentUser(user.local);
          } else if (user.github) {
            this.setCurrentUser(user.github);
          } else if (user.facebook) {
            this.setCurrentUser(user.facebook);
          } else if (user.google) {
            this.setCurrentUser(user.google);
          } else if (user.twitter) {
            this.setCurrentUser(user.twitter);
          } else if (user.linkedin) {
            this.setCurrentUser(user.linkedin);
          }
        }
      },
      err => console.log('Can\'t get logged user'),
      () => console.log('DONE')
    );
  }

  isNavItemActive(location) {
    return location === this.router.url ? 'active' : '';
  };

  logout() {
    this.authService.logout()
    .subscribe(
      result => {
        console.log('Logout result: ');
        console.log(result.message);
        this.isLoggedIn = false;
        this.currentUser = null;
      }, err => {
        console.log('Impossibile to logout: ' + err);
        this.isLoggedIn = false; // FIXME, Choose the value, I don't know, but I suppose 'false'
        this.currentUser = null;
      }, () => {
        console.log('logout finished');
        this.router.navigate(['/']);
      }
    );
  }

  private setCurrentUser(originData): void {
    if (originData) {
      this.currentUser = {
        name : originData.name
      };
    }
  }
}
