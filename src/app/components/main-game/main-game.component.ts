import { Component } from '@angular/core';
import { Hero } from '../../models/hero';
import { GenericService } from '../../services/generic.service';
import { TableURL } from '../../tools/table-url';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrl: './main-game.component.css'
})
export class MainGameComponent {

  constructor(
    private heroService:GenericService<Hero>,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.playingHero = this.router.getCurrentNavigation()?.extras?.state?.['input']
    // this.router.navigate(['./adventure-menu'], {relativeTo: this.route, state: { input: this.playingHero}});
    // console.log(this.playingHero);
    
  }
  ngOnInit(){
    this.router.navigate(['./adventure-menu'], {relativeTo: this.route, state: { input: this.playingHero}});
  //   let i = localStorage.getItem('HeroToGame')

  //   if (i != null ){
  //     this.heroService.getById(TableURL.Hero, i as unknown as number).subscribe(
  //       (data)=> {
  //         this.playingHero = data;
  //       }
  //     )
  //   localStorage.removeItem('HeroToGame')
  // }
  }

  playingHero?:Hero
  playerInfoToShow:string = "info";

  SwitchPlayerInfo(input:string): void{
    this.playerInfoToShow = input;
  }

  // ToShop(): void{
  //   // console.log('The shop is closed');
  //   this.router.navigate(["./shop"], {relativeTo: this.route})
  // }

  // ToBattle(): void{
  //   // console.log('There are no monsters to find');
  //   this.router.navigate(['./battle'], {relativeTo: this.route})
  // }
}
