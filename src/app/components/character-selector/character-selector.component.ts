import { Component } from '@angular/core';
import { Hero } from '../../models/hero';
import { GenericService } from '../../services/generic.service';
import { TableURL } from '../../tools/table-url';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Career } from '../../models/career';
import { Race } from '../../models/race';
import { defaultIfEmpty, firstValueFrom, switchMap, timeout } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character-selector',
  templateUrl: './character-selector.component.html',
  styleUrl: './character-selector.component.css'
})
export class CharacterSelectorComponent {

  constructor(
    private router: Router,
    private heroService:GenericService<Hero>,
    private raceService:GenericService<Race>,
    private careerService:GenericService<Career>,
    ){

  }

  herolist:Hero[] = [];
  racelist:Race[] = [];
  careerlist:Career[] = [];
  selectedhero?:Hero
  temp?:Hero
  isEditable: boolean = false;

  async ngOnInit(){
    this.GetAllHeros()
    this.GetAllRaces();
    this.GetAllCareer();

    let i = localStorage.getItem('shero')
    
    if (i != null ){
      this.SelectHero(await firstValueFrom(
        this.heroService.getById(TableURL.Hero, i as unknown as number).pipe(timeout(10000))
        )
      )
      // Might look like it works, but might not work, because of async on ngOnInit.
      localStorage.removeItem('shero')
    }
  }

  GetAllHeros(){
    this.heroService.getAll(TableURL.Hero).subscribe(
      (data) =>{
        this.herolist = data;
      }
    )
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

  updateSelectedHero = new FormGroup({
    heroName: new FormControl('', Validators.required),
    race: new FormControl(this.racelist[0]),
    career: new FormControl(this.careerlist[0]),
    note: new FormControl('')
  })

  SelectHero(hero:Hero){
    this.isEditable = false;
    this.selectedhero = hero;
    // console.log(this.selectedhero);
    
  }
  
  UpdateHero(){
    this.updateSelectedHero.patchValue(
      {
        heroName: this.selectedhero?.heroName,
        race: this.racelist.find(x => x.id == this.selectedhero?.raceId),
        career: this.careerlist.find(x => x.id == this.selectedhero?.careerId),
        note: this.selectedhero?.note
      }
    )
    this.isEditable = !this.isEditable
    console.log(this.isEditable);
    
  }

  async SaveChanges(){

    let updatedHero:Hero
    if(this.selectedhero != null){
      updatedHero = this.selectedhero

      if (this.updateSelectedHero.value.heroName != null)
        updatedHero.heroName = this.updateSelectedHero.value.heroName
      if(this.updateSelectedHero.value.race != null)
        updatedHero.raceId = this.updateSelectedHero.value.race.id
      if ( this.updateSelectedHero.value.career != null)
        updatedHero.careerId = this.updateSelectedHero.value.career.id
      if (this.updateSelectedHero.value.note != null)
        updatedHero.note = this.updateSelectedHero.value.note
      
      let res = await firstValueFrom(this.heroService.update(TableURL.Hero, updatedHero).pipe(timeout(10000)));
      let res1 = await firstValueFrom(this.heroService.getById(TableURL.Hero, updatedHero.id).pipe(timeout(10000)));

      this.heroService.getAll(TableURL.Hero).subscribe(
        (data) =>{
          this.herolist = data;
        }
      );
      if (res1 != null)
        this.SelectHero(res1);
    }
  }

  DeleteSelectedHero(){
    
    if(this.selectedhero != null){
      console.log(this.selectedhero?.id);
      this.heroService.delete(TableURL.Hero,this.selectedhero.id).subscribe(
        () =>{
          this.GetAllHeros();
        }
      )
      this.selectedhero = undefined;
    }
  }

  ToMainGame(){
    if(this.selectedhero != null){
      // localStorage.setItem('HeroToGame',this.selectedhero?.id.toString())
      this.router.navigate(["/main-game"],{ state: { input: this.selectedhero}})
    }
  }

  CreateNewHero(){
    this.router.navigate(["/character-creator"])
  }
}
