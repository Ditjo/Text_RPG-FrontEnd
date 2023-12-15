import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})

export class OptionsComponent
{
  constructor(private router: Router) {}

  //Tutorial
  tutorial(): void
  {
    this.router.navigate(["/tutorial"])
  }

  //Admin Access
  adminPanel(): void
  {
    this.router.navigate(["/admin-panel"])
  }

  LocalStorageRead():string{
    let i = localStorage.getItem('LogOn')
    if (i == null)
      i = '0';
    return i;
  }
}
