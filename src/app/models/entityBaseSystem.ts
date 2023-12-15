import { baseId } from "./baseId";

export interface EntityBaseSystem extends baseId
{
    strength:number;
    agility:number;
    vigor:number;
    spirit:number;
    health:number;
    energy:number;
    healthModifier:number;
    energyModifier:number;
    damageModifier:number;
    armourModifier:number;
}