import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Monster } from '../../models/monster';
import { GenericService } from '../../services/generic.service';
import { TableURL } from '../../tools/table-url';
import { Hero } from '../../models/hero';
import { DiceRollInterval } from '../../tools/diceroller';
import { EntityBaseSystem } from '../../models/entityBaseSystem';
import { Weapon } from '../../models/weapon';
import { Inventory } from '../../models/inventory';
import { Armour } from '../../models/armour';
import { GameActions } from '../../tools/game-actions';
import { ResetEntity } from '../../tools/reset-fighters';
import { distance } from '../../models/distance';


@Component({
  selector: 'app-game-battle',
  templateUrl: './game-battle.component.html',
  styleUrl: './game-battle.component.css'
})

export class GameBattleComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private monsterService: GenericService<Monster>
  ){
    this.staticHero = this.router.getCurrentNavigation()?.extras?.state?.['input']
    this.dynamicHero = JSON.parse(JSON.stringify(this.staticHero));
    this.GetAMonsterToFight();
    this.gameAction = new GameActions
  }
  public gameAction:GameActions
  
ngOnInit(){
  // const gameAction = new GameActions
  // this.gameAction = new GameActions
}

  staticHero!:Hero
  dynamicHero!:Hero
  heroSelectedWeapon!:Weapon | undefined
  staticMonster?:Monster
  dynamicMonster?:Monster
  monsterSelectedWeapon!:Weapon | undefined
  monstersTurn:boolean = false
  turns:number = 2
  distance:distance = {distance:1}

  CantAttack:boolean = false;
  CantDefend:boolean = false;
  CantMoveCloser:boolean = false;
  CantMoveAway:boolean = false;
  CantFlee:boolean = false;

  GetAMonsterToFight():void{
    this.monsterService.getAll(TableURL.Monster).subscribe(
      (data) =>{
        let temp  = data.filter(x => x.levelDifficulty <= this.staticHero.level)
        this.staticMonster = temp.at(DiceRollInterval(1,temp.length)-1)
        if (this.staticMonster != null){
          this.dynamicMonster = JSON.parse(JSON.stringify(this.staticMonster))
          this.InitiateBattle()
        }
      }
    )
  }

  InitiateBattle():void{
    if ( this.dynamicMonster == null)
      return

    if( this.dynamicHero.inventory.weapons != null)
      this.heroSelectedWeapon = this.dynamicHero.inventory.weapons.at(0)
    
    
    if( this.dynamicMonster.inventory.weapons != null)
      this.monsterSelectedWeapon = this.dynamicMonster.inventory.weapons.at(0)

    if ((this.dynamicMonster?.entityBaseSystem.agility + DiceRollInterval(1,3)) > (this.dynamicHero.entityBaseSystem.agility + DiceRollInterval(1,3))){
      this.monstersTurn = true;
      console.log('Monster goes first');
      this.BattleLoop();
    }
    else{
      console.log('Hero goes first');
      this.CanAction(this.dynamicHero.entityBaseSystem,this.heroSelectedWeapon, this.distance)
    }

  }

  BattleLoop():void{
    // console.log('BattleLoop');
    if ( this.dynamicMonster == null || this.staticMonster == null)
      return

    if (this.monstersTurn){
      ResetEntity(this.dynamicMonster?.entityBaseSystem, this.staticMonster?.entityBaseSystem)
      while (this.turns != 0){
        this.turns -= 1
        this.CallMonster()
      }
      this.turns = 2;
      this.monstersTurn = false;
      this.monsterCanMoveAway = true;
      this.monsterCanMoveCloser = true;

      ResetEntity(this.dynamicHero.entityBaseSystem,this.staticHero.entityBaseSystem)
      this.CanAction(this.dynamicHero.entityBaseSystem,this.heroSelectedWeapon, this.distance)
      if (this.dynamicHero.entityBaseSystem.health <= 0 || this.dynamicMonster.entityBaseSystem.health <= 0)
        alert('End of Battle')
    }
    else{
      this.monstersTurn = true;
      this.CanAction(this.dynamicHero.entityBaseSystem,this.heroSelectedWeapon, this.distance)
      if (this.dynamicHero.entityBaseSystem.health <= 0 || this.dynamicMonster.entityBaseSystem.health <= 0)
        alert('End of Battle')
    }
  }


  CallMonster():void{
    console.log('Monster is Called');
    if(this.dynamicMonster?.entityBaseSystem != null)
      this.MonsterAI(this.dynamicMonster.entityBaseSystem,this.monsterSelectedWeapon,this.distance,this.dynamicHero)
      // this.CanAction(this.dynamicMonster?.entityBaseSystem,this.monsterSelectedWeapon,this.distance)
  }
  Attack():void{
    // console.log('Before Change');
    // console.log('Static Hero');
    // console.log(this.staticHero);
    // console.log('Dynamic Hero');
    // console.log(this.dynamicHero);
    // this.dynamicHero.heroXp += 5
    // console.log('After Change');
    // console.log('Static Hero');
    // console.log(this.staticHero);
    // console.log('Dynamic Hero');
    // console.log(this.dynamicHero);
    this.gameAction.ActionAttack(this.heroSelectedWeapon, this.dynamicHero.entityBaseSystem, this.dynamicMonster?.entityBaseSystem!, this.dynamicHero.inventory.armour)
    console.log('Hero Attack');
    // this.ActionAttack(this.heroSelectedWeapon, this.dynamicHero.entityBaseSystem, this.dynamicMonster?.entityBaseSystem!, this.dynamicHero.inventory.armour)
    this.BattleLoop()
  }
  Defend():void{
    console.log('Hero Defend');
    this.gameAction.ActionDefend(this.dynamicHero.entityBaseSystem)
    // this.ActionDefend(this.dynamicHero.entityBaseSystem);
    // console.log('Hero after Defend is called');
    // console.log(this.dynamicHero.entityBaseSystem.armourModifier);
    
    this.BattleLoop()
  }
  MoveCloser():void{
    console.log('Hero Moves Closer');
    this.gameAction.ActionMoveCloser(this.distance)
    this.BattleLoop()
  }
  MoveAway():void{
    console.log('Hero Moves Away');
    this.gameAction.ActionMoveAway(this.distance)
    this.BattleLoop()
  }
  Rest():void{
    console.log('Hero Rests');
    this.gameAction.ActionRest(this.dynamicHero.entityBaseSystem)
    this.BattleLoop()
  }
  UseItem():void{
    console.log('Hero Uses Item');
    this.BattleLoop()
  }
  SwitchWeapon():void{
    console.log('HeroSwitched Weapons');
    this.FreeActionSwitchWeapon();
    this.BattleLoop()
  }
  Flee():void{
    console.log('Hero Flees');
    this.router.navigate(["../adventure-menu"], {relativeTo: this.route, state: { input: this.staticHero}})
  }
  // Return(): void{
  //   this.router.navigate(["../adventure-menu"], {relativeTo: this.route, state: { input: this.staticHero}})
  // }

  //This Method Stayes here
  FreeActionSwitchWeapon(){
    if( this.dynamicHero.inventory.weapons != null && this.dynamicHero.inventory.weapons.length == 2){
      if ( this.heroSelectedWeapon?.id == this.dynamicHero.inventory.weapons?.at(0)?.id){
        this.heroSelectedWeapon = this.dynamicHero.inventory.weapons?.at(1);
      }
      else{
        this.heroSelectedWeapon = this.dynamicHero.inventory.weapons.at(0);
      }
    }
  }

  // ActionAttack(attackWeapon:Weapon | undefined, attackEbs:EntityBaseSystem, defendEbs:EntityBaseSystem, defendArmour:Armour | null):void{
  //   if(attackEbs != null && defendEbs != null && attackWeapon != null){
  //     attackEbs.energy -= attackWeapon?.weaponType.energyCost
  //     console.log('Energy Cost: ' + attackWeapon?.weaponType.energyCost);
      
  //     if(attackEbs.strength > DiceRollInterval(1,20)){
  //       let totalDamage;
  //       if (attackWeapon != null){
  //         totalDamage = DiceRollInterval(1,attackWeapon.weaponType?.damageDice) + attackWeapon.weaponDamageModifier + attackEbs.damageModifier;
  //         // console.log(attackEbs);
  //         // console.log(attackEbs.damageModifier);
  //       }
  //       else{
  //         totalDamage = DiceRollInterval(1,4) + attackEbs.damageModifier
  //       }
  //       console.log('Total Damage: ' + totalDamage);
        
        
  //       let actualDamage = totalDamage - defendEbs.armourModifier;

  //       console.log('Actual Damage: ' + actualDamage);

  //       if(defendArmour != null)
  //         actualDamage -= defendArmour.armourModifier;

  //       if(actualDamage > 0){
  //         defendEbs.health -= actualDamage
  //         console.log('Given ' + actualDamage + ' in damage');
  //       }
  //       else{
  //         console.log('Given no damage');
  //       }
  //     }
  //     else{
  //       console.log('Attack Missed');
  //     }

  //   }
  // }

  // ActionDefend(ebs:EntityBaseSystem):void{
  //   ebs.armourModifier += 1;
  //   console.log('ActionDefend');
  //   console.log(ebs.armourModifier);
    
  // }

  // ResetEntity(dynamicEbs:EntityBaseSystem, staticEbs:EntityBaseSystem):void{
  //   dynamicEbs.armourModifier = staticEbs.armourModifier
  //   dynamicEbs.damageModifier = staticEbs.damageModifier
  //   dynamicEbs.energyModifier = staticEbs.energyModifier
  //   dynamicEbs.healthModifier = staticEbs.healthModifier
  // }

  CanAction(ebs:EntityBaseSystem, weapon:Weapon | undefined, distance:distance):void{

    let baseAttackCost:number
    let baseWeaponRange: number

    //Can Attack
    if ( weapon == null || weapon == undefined || weapon.weaponType == null){
      baseAttackCost = 2
      baseWeaponRange = 0
    }
    else{
      baseAttackCost = weapon.weaponType.energyCost
      baseWeaponRange = weapon.weaponType.range
    }

    if (ebs.energy < baseAttackCost || 
        baseWeaponRange < distance.distance)
      this.CantAttack = true;
    else
      this.CantAttack = false;

    //Can Defend
    if (ebs.energy < this.gameAction.DefendsEnergyCost)
      this.CantDefend = true;
    else
      this.CantDefend = false;

    //Can MoveAway
    if (ebs.energy < this.gameAction.MoveEnergyCost ||
        distance.distance >= 3)
      this.CantMoveAway = true;
    else 
      this.CantMoveAway = false;

    //Can MoveCloser
    if (ebs.energy < this.gameAction.MoveEnergyCost ||
        distance.distance <= 0)
      this.CantMoveCloser = true;
    else 
      this.CantMoveCloser = false;
  }

  monsterCanMoveCloser:boolean = true
  monsterCanMoveAway:boolean = true

  MonsterAI(ebs:EntityBaseSystem, weapon:Weapon | undefined, distance:distance, defendHero:Hero):void{

    let baseAttackCost:number
    let baseWeaponRange: number
    let listActions:string[] = [] 

    if ( weapon == null || weapon == undefined || weapon.weaponType == null){
      baseAttackCost = 2
      baseWeaponRange = 0
    }
    else{
      baseAttackCost = weapon.weaponType.energyCost
      baseWeaponRange = weapon.weaponType.range
    }

    listActions.push('Rest');

    //Can Attack
    if (ebs.energy >= baseAttackCost && 
      baseWeaponRange >= distance.distance){
        listActions.push('Attack');
      }

    //Can Defend
    if (ebs.energy >= this.gameAction.DefendsEnergyCost){
      listActions.push('Defend');
    }

    //Can Move Away
    if (ebs.energy >= this.gameAction.MoveEnergyCost &&
      distance.distance < 3 && 
      this.monsterCanMoveAway){
        listActions.push('MoveAway');
      }
    
    //Can Move Closer
    if (ebs.energy >= this.gameAction.MoveEnergyCost &&
      distance.distance > 0 &&
      this.monsterCanMoveCloser){
        listActions.push('MoveCloser');
      }

      let action = listActions.at(DiceRollInterval(1,listActions.length)-1)
    switch(action){
      case 'Attack':{
        this.gameAction.ActionAttack(weapon,ebs,defendHero.entityBaseSystem,defendHero.inventory.armour);
        break;
      }
      case 'Defend':{
        this.gameAction.ActionDefend(ebs);
        break;
      }
      case 'MoveAway':{
        this.gameAction.ActionMoveAway(distance)
        this.monsterCanMoveCloser = false
        break;
      }
      case 'MoveCloser':{
        this.gameAction.ActionMoveCloser(distance)
        this.monsterCanMoveAway = false
        break;
      }
      default: {
        this.gameAction.ActionRest(ebs)
        break;
      }

    }
  }
}
