import { baseId } from "./baseId";
import { Inventory } from "./inventory";
import { WeaponType } from "./weaponType";

export interface Weapon extends baseId
{
    weaponTypeId: number;
    weaponName: string | null;
    weaponDamageModifier: number;
    skillRoll: number;
    availableToHero: boolean;
    starterWeapon: boolean;
    value: number;
    note: string | null;

    weaponType: WeaponType | null;
    inventories: Inventory[] | null;
}