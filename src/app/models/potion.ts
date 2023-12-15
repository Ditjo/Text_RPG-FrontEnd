import { baseId } from "./baseId";
import { PotionType } from "./potionType";

export interface Potion extends baseId
{
    inventoryId: number;
    potionId: number;
    amount: number;

    potionType: PotionType | null;
}