import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GenericService } from '../../services/generic.service';
import { Race } from '../../models/race';
import { TableURL } from '../../tools/table-url';
import { Career } from '../../models/career';
import { Hero } from '../../models/hero';
import { Weapon } from '../../models/weapon';
import { EntityBaseSystem } from '../../models/entityBaseSystem';
import { DiceRollInterval } from '../../tools/diceroller';
import { Router } from '@angular/router';
import { firstValueFrom, timeout } from 'rxjs';

@Component({
  selector: 'app-character-creator',
  templateUrl: './character-creator.component.html',
  styleUrl: './character-creator.component.css'
})
export class CharacterCreatorComponent {
  constructor(
    private router: Router,
    private raceService:GenericService<Race>,
    private careerService:GenericService<Career>,
    private weaponService:GenericService<Weapon>,
    private heroService:GenericService<Hero>
    ){}

  dbHero:Hero | null = null;
  racelist:Race[] = [];
  careerlist:Career[] = [];
  starterWeaponslist:Weapon[] = [];
  newEntityBaseSystem:EntityBaseSystem = {
    id: 0,
    strength: 0,
    agility: 0,
    vigor: 0,
    spirit: 0,
    health: 0,
    energy: 0,
    healthModifier: 0,
    energyModifier: 0,
    damageModifier: 0,
    armourModifier: 0
  }

  ngOnInit(){
    this.GetAllRaces();
    this.GetAllCareer();
    this.GetAllStarterWeapons();
  }

  GetAllRaces(){
    this.raceService.getAll(TableURL.Race).subscribe(
      (data) => {
        this.racelist = data;
      }
    )
  }

  GetAllCareer(){
    this.careerService.getAll(TableURL.Career).subscribe(
      (data) => {
        this.careerlist = data;
      }
    )
  }

  GetAllStarterWeapons(){
    this.weaponService.getAll(TableURL.Weapon).subscribe(
      (data) => {
        this.starterWeaponslist = data.filter(x => x.availableToHero == true && x.starterWeapon == true)
      }
    )
  }

  createNewHero = new FormGroup({
    heroName: new FormControl(''),
    race: new FormControl(this.racelist[0]),
    career: new FormControl(this.careerlist[0]),
    note: new FormControl(''),
    weapon: new FormControl(this.starterWeaponslist[0])
  })

  rollmin:number = 4;
  rollmax:number = 10;

  RollStats(){
    let strengthtemp:number =  DiceRollInterval(this.rollmin,this.rollmax);
    let agilitytemp:number = DiceRollInterval(this.rollmin,this.rollmax);
    let vigortemp:number = DiceRollInterval(this.rollmin,this.rollmax);
    let spirittemp:number = DiceRollInterval(this.rollmin,this.rollmax);

    this.newEntityBaseSystem = {
      id: 0,
      strength: strengthtemp,
      agility: agilitytemp,
      vigor: vigortemp,
      spirit: spirittemp,
      health: vigortemp * 2,
      energy: agilitytemp + spirittemp,
      healthModifier: 0,
      energyModifier: 0,
      damageModifier: 0,
      armourModifier: 0
    }
    this.isDisabled = false
  }

  isDisabled:boolean = true

  async Create(){
    let newHero:Hero = {
      id: 0,
      heroName: this.createNewHero.value.heroName!,
      note: this.createNewHero.value.note!,
      raceId: this.createNewHero.value.race?.id!,
      race: null,
      careerId: this.createNewHero.value.career?.id!,
      career: null,
      heroXp: 0,
      level: 1,
      entityBaseSystem: this.newEntityBaseSystem,
      inventory: {
        id: 0,
        gold: 0,
        armourId: null,
        armour: null,
        potions: null,
        weapons: [this.createNewHero.value.weapon!]

      }
    }
    let res = await firstValueFrom(this.heroService.create(TableURL.Hero, newHero).pipe(timeout(10000)))

    if (res != null)
      localStorage.setItem("shero", res.id.toString())
    this.router.navigate(["/charactor-selector"])
    
  }
}

