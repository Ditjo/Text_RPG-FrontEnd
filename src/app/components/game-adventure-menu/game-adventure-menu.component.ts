import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../../models/hero';

@Component({
  selector: 'app-game-adventure-menu',
  templateUrl: './game-adventure-menu.component.html',
  styleUrl: './game-adventure-menu.component.css'
})
export class GameAdventureMenuComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){
    this.playingHero = this.router.getCurrentNavigation()?.extras?.state?.['input']
    console.log(this.playingHero);
    
  }

  playingHero:Hero

  ToShop(): void{
    // console.log('The shop is closed');
    this.router.navigate(["../shop"], {relativeTo: this.route, state: { input: this.playingHero}})
  }

  ToBattle(): void{
    // console.log('There are no monsters to find');
    this.router.navigate(['../battle'], {relativeTo: this.route, state: { input: this.playingHero}})
  }
}
