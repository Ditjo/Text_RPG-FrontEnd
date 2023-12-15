import { baseId } from "./baseId";

export interface PotionType extends baseId
{
    potionTypeName: string | null;
    potionDice: number;
    availableToHero: boolean;
    value: number;
    note: string | null;
}