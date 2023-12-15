import { Armour } from "../models/armour";
import { distance } from "../models/distance";
import { EntityBaseSystem } from "../models/entityBaseSystem";
import { Weapon } from "../models/weapon";
import { DiceRollInterval } from "./diceroller";

export class GameActions{

    DefendsEnergyCost:number = 2;
    MoveEnergyCost:number = 2;
    RestEnergyReturn:number = 5;
    RestHealthReturn:number = 1;

    ActionAttack(attackWeapon:Weapon | undefined, attackEbs:EntityBaseSystem, defendEbs:EntityBaseSystem, defendArmour:Armour | null):void{
        if(attackEbs != null && defendEbs != null && attackWeapon != null){
          attackEbs.energy -= attackWeapon?.weaponType!.energyCost
          console.log('Energy Cost: ' + attackWeapon?.weaponType!.energyCost);
          
          if(attackEbs.strength > DiceRollInterval(1,20)){
            let totalDamage;
            if (attackWeapon != null){
              totalDamage = DiceRollInterval(1,attackWeapon.weaponType?.damageDice!) + attackWeapon.weaponDamageModifier + attackEbs.damageModifier;
              // console.log(attackEbs);
              // console.log(attackEbs.damageModifier);
            }
            else{
              totalDamage = DiceRollInterval(1,4) + attackEbs.damageModifier
            }
            console.log('Total Damage: ' + totalDamage);
            
            
            let actualDamage = totalDamage - defendEbs.armourModifier;
    
            console.log('Actual Damage: ' + actualDamage);
    
            if(defendArmour != null)
              actualDamage -= defendArmour.armourModifier;
    
            if(actualDamage > 0){
              defendEbs.health -= actualDamage
              console.log('Given ' + actualDamage + ' in damage');
            }
            else{
              console.log('Given no damage');
            }
          }
          else{
            console.log('Attack Missed');
          }
    
        }
      }
    
      ActionDefend(ebs:EntityBaseSystem):void{
        ebs.energy -= this.DefendsEnergyCost;
        ebs.armourModifier += 1;
        console.log('ActionDefend');
        // console.log(ebs.armourModifier);
        
      }

      ActionMoveCloser(distance:distance):void{
        distance.distance -= 1;
        console.log('Moves Closer');
      }

      ActionMoveAway(distance:distance):void{
        distance.distance += 1;
        console.log('Moves Away');
      }

      ActionRest(ebs:EntityBaseSystem):void{
        ebs.energy += this.RestEnergyReturn;
        ebs.health += this.RestHealthReturn;
        console.log('Action Rest');
        
      }

      ActionUseItem():void{
        console.log('Hero Uses Item');
      }
}