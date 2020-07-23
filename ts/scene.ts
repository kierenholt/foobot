const SPAWN_X = 25;
var SPAWN_Y = 25;
const SPAWN_VERTICAL_SPACING = 50;

class Scene1 extends Phaser.Scene {
    refractors: any[] = [];
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
        this.load.image("rulerH90","assets/rulerHorizontal90.resized.png");
        this.load.image("rulerH1000","assets/rulerHorizontal1000.png");
        this.load.image("rulerV90","assets/rulerVertical90.resized.png");
        this.load.image("rulerV1000","assets/rulerVertical1000.png");

    }
    
    create () {
        this.tankRectangle = new Phaser.GameObjects.Rectangle(
            this,
            RippleTank.LEFT_PADDING+RippleTank.instance.imageWidth/2,
            RippleTank.instance.imageHeight/2,
            RippleTank.instance.imageWidth, RippleTank.instance.imageHeight).setStrokeStyle(1,0x0);
        this.add.existing(this.tankRectangle);

        new Glass(this,15,24);
        new ConvexLens(this, 65, 24);

        new PointOscillator(this, 27, 130);
        new LineOscillator(this, 70, 100);

        new Slit(this, 22, 180);
        new DoubleSlit(this, 70, 180);
        
        new Grating(this, 22, 260);
        new LineReflector(this, 70, 260);

        new Ruler(this, 27, 375, false); 
        new Ruler(this, 70, 375, true); 
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

