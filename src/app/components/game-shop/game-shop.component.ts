import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericService } from '../../services/generic.service';
import { Weapon } from '../../models/weapon';
import { Armour } from '../../models/armour';
import { PotionType } from '../../models/potionType';
import { TableURL } from '../../tools/table-url';
import { getLocaleCurrencyCode } from '@angular/common';
import { Hero } from '../../models/hero';

@Component({
  selector: 'app-game-shop',
  templateUrl: './game-shop.component.html',
  styleUrl: './game-shop.component.css'
})
export class GameShopComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private weaponService: GenericService<Weapon>,
    private armourService: GenericService<Armour>,
    private potionTypeService: GenericService<PotionType>
  ){
    this.playingHero = this.router.getCurrentNavigation()?.extras?.state?.['input']
    console.log(this.playingHero);
    
  }

  ngOnInit(){
    this.GetAllWeapons();
    this.GetAllArmour();
    this.GetAllPotions();
  }
  playingHero:Hero
  weaponlist:Weapon[] = [];
  armourlist:Armour[] = [];
  Potionlist:PotionType[] = []

  GetAllWeapons(): void{
    this.weaponService.getAll(TableURL.Weapon).subscribe(
      (data) => {
        this.weaponlist = data.filter(x => x.availableToHero == true);
      }
    )
  }

  GetAllArmour(): void{
    this.armourService.getAll(TableURL.Armour).subscribe(
      (data) => {
        this.armourlist = data.filter(x => x.availableToHero == true);
      }
    )
  }

  GetAllPotions(): void{
    this.potionTypeService.getAll(TableURL.PotionType).subscribe(
      (data) => {
        this.Potionlist = data.filter(x => x.availableToHero == true);
      }
    )
  }

  Buyitem(item:any): void{
    console.log('Item bought:');
    console.log(item);
  }


  Return(): void{
    this.router.navigate(["../adventure-menu"], {relativeTo: this.route, state: { input: this.playingHero}})
  }

}
