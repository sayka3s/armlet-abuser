import { EventsSDK, LocalPlayer, Menu } from "../wrapper/index";

new (class ArmletAbuserScript {
    private readonly entry = Menu.AddEntry("Custom Armlet");
    private readonly configTree = this.entry.AddNode("Armlet Abuser");
    private readonly enabledState = this.configTree.AddToggle("Включить автоматизацию", false);
    private readonly hpThreshold = this.configTree.AddSlider("Порог HP для абуза", 150, 50, 350);
    private readonly humanizeDelay = this.configTree.AddSlider("Задержка переключения (мс)", 45, 20, 120);
    private lastToggleTime: number = 0;

    constructor() {
        EventsSDK.on("Draw", this.OnDrawUpdate.bind(this));
    }

    private OnDrawUpdate(): void {
        if (!this.enabledState.value) return;

        const hero = LocalPlayer?.Hero;
        if (hero === undefined || !hero.IsAlive()) return;

        const armlet = hero.Items?.find((item: any) => item.Name === "item_armlet");
        if (armlet === undefined || !armlet.CanBeCasted()) return;

        const currentHealth = hero.Health;
        const isArmletActive = armlet.ToggleState;
        const currentTime = Date.now();

        if (currentHealth < this.hpThreshold.value && isArmletActive) {
            const randomModifier = Math.floor(Math.random() * 16) - 8;
            const totalDelay = this.humanizeDelay.value + randomModifier;
            if (currentTime - this.lastToggleTime > totalDelay) {
                hero.CastNoTarget(armlet, false, true);
                setTimeout(() => {
                    if (hero.IsAlive()) {
                        hero.CastNoTarget(armlet, false, true);
                    }
                }, totalDelay);
                this.lastToggleTime = currentTime;
            }
        }
    }
})();
