import { EntityBaseSystem } from "../models/entityBaseSystem"

export function ResetEntity(dynamicEbs:EntityBaseSystem, staticEbs:EntityBaseSystem):void{
    dynamicEbs.armourModifier = staticEbs.armourModifier
    dynamicEbs.damageModifier = staticEbs.damageModifier
    dynamicEbs.energyModifier = staticEbs.energyModifier
    dynamicEbs.healthModifier = staticEbs.healthModifier
  }