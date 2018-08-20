import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class IndexGardService implements CanActivate {

  constructor(private router: Router, public userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    if (this.userService.isAuthenticated()) {
      this.router.navigate(['main']);
      return false;
    }
    return true;

  }
}
