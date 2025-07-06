import { Animation } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { UIBasePanel } from "../UIBasePanel";

export class CharacterPanel extends UIBasePanel {
    static fullPath: string = "";
    initialize(): void {
        super.initialize();
        this.view;
    }

    onRegister(): void {
        super.onRegister();
    }

    playHurtAnim() {
        let anim = this.view.getComponent(Animation);
        anim.play("hurtAnim");
    }
}
ClassConfig.addClass("CharacterPanel", CharacterPanel);
