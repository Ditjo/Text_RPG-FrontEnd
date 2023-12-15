import { baseId } from "./baseId";
import { SkillRollType } from "./skillRollType";

export interface WeaponType extends baseId
{
    weaponTypeName: string | null;
    skillRollTypeId: number;
    energyCost: number;
    damageDice: number;
    range: number;

    skillRollType: SkillRollType | null;
}