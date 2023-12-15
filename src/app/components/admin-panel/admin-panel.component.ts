import { Component } from '@angular/core';
import { Armour } from '../../models/armour';
import { Hero } from '../../models/hero';
import { GenericService } from '../../services/generic.service';
import { HttpClient } from '@angular/common/http';
import { TableURL } from '../../tools/table-url'
import { Race } from '../../models/race';
import { Career } from '../../models/career';
import { Weapon } from '../../models/weapon';
import { FormControl, FormControlName, FormGroup } from '@angular/forms';
import { first, firstValueFrom, timeout } from 'rxjs';
import { WeaponType } from '../../models/weaponType';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})

export class AdminPanelComponent
{
  
  constructor(
    private raceService:GenericService<Race>,
    private careerService:GenericService<Career>,
    private weaponService:GenericService<Weapon>,
    private weaponTypeService:GenericService<WeaponType>
    ){}
    
    careerlist:Career[] = [];
    racelist:Race[] = [];
    weaponlist:Weapon[] = [];
    weaponTypeList:WeaponType[] = [];
    
    selectedCareer?:Career;
    selectedRace?:Race;
    selectedWeapon?:Weapon;
    
    showList: string = "";
    IsSaveable:boolean = false;

  ngOnInit()
  {
    this.GetAllRace();
    this.GetAllCareer();
    this.GetAllWeapon();
    this.GetAllWeaponType();
  }

  GetAllCareer(){
    this.careerService.getAll(TableURL.Career).subscribe(
      (data) => {
        this.careerlist = data;
      }
    )
  }

  GetAllRace(){
    this.raceService.getAll(TableURL.Race).subscribe(
      (data) => {
        this.racelist = data;
      }
    )
  }

  GetAllWeapon(){
    this.weaponService.getAll(TableURL.Weapon).subscribe(
      (data) => {
        this.weaponlist = data;
      }
    )
  }

  GetAllWeaponType(){
    this.weaponTypeService.getAll(TableURL.WeaponType).subscribe(
      (data) => {
        this.weaponTypeList = data;
      }
    )
  }
  
  createNewCareer = new FormGroup
  ({
    careerName: new FormControl("")
  })

  createNewRace = new FormGroup
  ({
    raceName: new FormControl("")
  })

  createNewWeapon = new FormGroup
  ({
    // weaponTypeId: new FormControl(),
    weaponName: new FormControl(""),
    weaponDamageModifier: new FormControl(),
    skillRoll: new FormControl(),
    availableToHero: new FormControl(false),
    starterWeapon: new FormControl(false),
    value: new FormControl(),
    note: new FormControl(""),

    weaponType: new FormControl(this.weaponTypeList[0])
  })

  SelectCareer(career:Career): void
  {
    this.selectedCareer = career;
    console.log(this.selectedCareer)
    this.createNewCareer.patchValue({
      careerName: this.selectedCareer.careerType
    })
    this.createNewCareer.disable();
  }

  SelectRace(race:Race): void
  {
    this.selectedRace = race;
    console.log(this.selectedRace)
    this.createNewRace.patchValue({
      raceName: this.selectedRace.raceType
    })
    this.createNewRace.disable();
  }

  SelectWeapon(weapon:Weapon): void
  {
    this.selectedWeapon = weapon;
    console.log(this.selectedWeapon)
    this.createNewWeapon.patchValue({
      // weaponTypeId: this.selectedWeapon.weaponTypeId,
      weaponName: this.selectedWeapon.weaponName,
      weaponDamageModifier: this.selectedWeapon.weaponDamageModifier,
      skillRoll: this.selectedWeapon.skillRoll,
      availableToHero: this.selectedWeapon.availableToHero,
      starterWeapon: this.selectedWeapon.starterWeapon,
      value: this.selectedWeapon.value,
      note: this.selectedWeapon.note,

      weaponType: this.selectedWeapon.weaponType
    })
    this.createNewWeapon.disable();
  }

  Career(): void
  {
    this.showList = TableURL.Career;
    console.log(this.showList)
    this.createNewCareer.reset();
    this.IsSaveable = false;
  }

  Race(): void
  {
    this.showList = TableURL.Race;
    console.log(this.showList)
    this.createNewRace.reset();
    this.IsSaveable = false;
  }

  Weapon(): void
  {
    this.showList = TableURL.Weapon;
    console.log(this.showList)
    this.createNewWeapon.reset();
    this.IsSaveable = false;
  }

  Create(): void
  {
    // Career
    if (this.showList == TableURL.Career)
    {
      let newCareer: Career = {
        id: 0,
        careerType: this.createNewCareer.value.careerName as unknown as string
      }
      console.log(newCareer)

      this.careerService.create(TableURL.Career, newCareer).subscribe(
        () => {
          this.GetAllCareer();
        }
      )
      this.createNewCareer.reset();
    }

    // Race
    if (this.showList == TableURL.Race)
    {
      let newRace: Race = {
        id: 0,
        raceType: this.createNewRace.value.raceName as unknown as string
      }
      console.log(newRace)

      this.raceService.create(TableURL.Race, newRace).subscribe(
        () => {
          this.GetAllRace();
        }
      )
      this.createNewRace.reset();
    }

    // Weapon
    if (this.showList == TableURL.Weapon)
    {
      let available: boolean;
      let starter: boolean;
      if (this.createNewWeapon.value.availableToHero == true)
      {
        available = this.createNewWeapon.value.availableToHero
      }
      else
      {
        available = false
      }

      if (this.createNewWeapon.value.starterWeapon == true)
      {
        starter = this.createNewWeapon.value.starterWeapon
      }
      else
      {
        starter = false
      }

      let newWeapon: Weapon = {
        id: 0,
        weaponTypeId: this.createNewWeapon.value.weaponType?.id!,
        weaponName: this.createNewWeapon.value.weaponName!,
        weaponDamageModifier: this.createNewWeapon.value.weaponDamageModifier,
        skillRoll: this.createNewWeapon.value.skillRoll,

        availableToHero: available,
        starterWeapon: starter,

        value: this.createNewWeapon.value.value,
        note: this.createNewWeapon.value.note!,

        // weaponType: this.createNewWeapon.value.weaponType as unknown as WeaponType,
        weaponType: null,
        inventories: null
      }
      console.log(newWeapon)

      this.weaponService.create(TableURL.Weapon, newWeapon).subscribe(
        () => {
          this.GetAllWeapon();
        }
      )
      this.createNewWeapon.reset();
    }
  }

  Update(): void
  {
    if (this.showList == TableURL.Career)
      this.createNewCareer.enable();

    if (this.showList == TableURL.Race)
      this.createNewRace.enable();
    
    this.IsSaveable = true;
  }

  async SaveEdit()
  {
    if (this.showList == TableURL.Career)
    {
      let updatedCareer:Career
      if (this.selectedCareer != null)
      {
        updatedCareer = this.selectedCareer;
  
        if (this.createNewCareer.value.careerName != null)
          updatedCareer.careerType = this.createNewCareer.value.careerName;
        
        let res = await firstValueFrom(this.careerService.update(TableURL.Career, updatedCareer). pipe(timeout(10000)));
        
        this.careerService.getAll(TableURL.Career).subscribe(
          (data) => {
            this.careerlist = data;
          }
        );
        this.createNewCareer.reset();
        this.IsSaveable = false;
      }
    }

    if (this.showList == TableURL.Race)
    {
      let updatedRace:Race
      if (this.selectedRace != null)
      {
        updatedRace = this.selectedRace;

        if (this.createNewRace.value.raceName != null)
          updatedRace.raceType = this.createNewRace.value.raceName;

        let res = await firstValueFrom(this.raceService.update(TableURL.Race, updatedRace).pipe(timeout(10000)));

        this.raceService.getAll(TableURL.Race).subscribe(
          (data) => {
            this.racelist = data;
          }
        );
        this.createNewRace.reset();
        this.IsSaveable = false;
      }
    }
  }


  Delete(): void
  {
    if (this.showList == TableURL.Career)
    {
      if (this.selectedCareer != null)
      {
        console.log(this.selectedCareer?.id);
        this.careerService.delete(TableURL.Career, this.selectedCareer.id).subscribe(
          () => {
            this.GetAllCareer();
            this.createNewCareer.reset();
            this.createNewCareer.enable();
          }
        )
        this.selectedCareer = undefined;
      }
    }

    if (this.showList == TableURL.Race)
    {
      if (this.selectedRace != null)
      {
        console.log(this.selectedRace?.id);
        this.raceService.delete(TableURL.Race, this.selectedRace.id).subscribe(
          () => {
            this.GetAllRace();
            this.createNewRace.reset();
            this.createNewRace.enable();
          }
        )
        this.selectedRace = undefined;
      }
    }

    if (this.showList == TableURL.Weapon)
    {
      if (this.selectedWeapon != null)
      {
        console.log(this.selectedWeapon?.id);
        this.weaponService.delete(TableURL.Weapon, this.selectedWeapon.id).subscribe(
          () => {
            this.GetAllWeapon();
            this.createNewWeapon.reset();
            this.createNewWeapon.enable();
          }
        )
        this.selectedWeapon = undefined;
      }
    }
  }
}
