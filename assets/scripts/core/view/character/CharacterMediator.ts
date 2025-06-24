import { ClassConfig } from "../../../project/config/ClassConfig";
import { PopupMediator } from "../PopupMediator";

export class CharacterMediator extends PopupMediator {}
ClassConfig.addClass("CharacterMediator", CharacterMediator);
