import { baseId } from "./baseId";

export interface Armour extends baseId
{
    armourTypeName: string | null;
    armourModifier: number;
    availableToHero: boolean;
    value: number;
    note: string | null;
}