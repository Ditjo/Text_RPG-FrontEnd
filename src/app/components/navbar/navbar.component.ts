import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavBarComponent
{
  //Navbar visibility
  @Input() showNavbar = true;

  constructor(private router: Router, private location: Location) {}

  //Menu
  mainMenu(): void
  {
    this.router.navigate(["/main-menu"])
  }

  //Back
  back(): void
  {
    this.location.back();
  }
  
  //Switch Account
  account: string = 'User';
  LocalStorageWrite(){
    if(localStorage.getItem('LogOn') == '0')
    {
      localStorage.setItem('LogOn', '1')
      this.account = "Admin";
    }
    
    else
    {
      localStorage.setItem('LogOn', '0')
      this.account = "User";
    }
  }
}