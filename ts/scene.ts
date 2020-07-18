const SPAWN_X = 25;
var SPAWN_Y = 25;
const SPAWN_VERTICAL_SPACING = 50;

class Scene1 extends Phaser.Scene {
    refractors: Glass[] = [];
    absorbers: any = [];
    updateFunctions: any = [];
    tankRectangle: Phaser.GameObjects.Rectangle;
    static instance: Scene1;

    constructor() {
        super({
            key: 'sceneA',
            active: true,
            physics:
            {
                default: 'arcade',
                arcade:
                    {
                        debug: false,
                    }
            },
        });
        Scene1.instance = this;
    }

    preload () {
    }
    
    create () {
        this.tankRectangle = new Phaser.GameObjects.Rectangle(
            this,
            RippleTank.LEFT_PADDING+RippleTank.instance.imageWidth/2,
            RippleTank.instance.imageHeight/2,
            RippleTank.instance.imageWidth, RippleTank.instance.imageHeight).setStrokeStyle(1,0x0);
        this.add.existing(this.tankRectangle);

        new Glass(this,22,24);
        new PointOscillator(this, 22, 150);
        new LineOscillator(this, 70, 125);
        new Slit(this, 22, 200);
        new DoubleSlit(this, 70, 200);
    }

    update () {
        this.updateFunctions.forEach(f => f());
    }


    updateRefractors() {
        RippleTank.instance.resetNSquared()
        this.refractors.forEach(r => r.setPixels());
    }

    updateAbsorbers() {
        RippleTank.instance.resetAbsorbers()
        this.absorbers.forEach(r => r.setPixels());
    }

}

