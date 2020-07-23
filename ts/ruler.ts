
class Ruler extends Phaser.GameObjects.Container {
    onDragHasFired: boolean;
    firstDragEndHasFired: boolean;
    borderRect: Phaser.GameObjects.Rectangle;
    image: Phaser.GameObjects.Image;
    isHorizontal: boolean;

    constructor(scene, x,y, isHorizontal) {
        let image = new Phaser.GameObjects.Image(scene,0,0,isHorizontal ? "rulerH90" : "rulerV90");
        let borderRect = new Phaser.GameObjects.Rectangle(scene, 0,0, 0,0).setVisible(false).setStrokeStyle(1,0xff0000);
        super(scene, x, y ,[image, borderRect]);
        this.scene.add.existing(this);
        this.setInteractive(borderRect, Phaser.Geom.Rectangle.Contains);
        this.scene.input.setDraggable(this);

        this.isHorizontal = isHorizontal;
        this.on('drag', this.onDrag);
        this.on('dragend', this.dragEnd);
        this.on("pointerover", this.pointerOver);
        this.on("pointerout", this.pointerOut);
        this.borderRect = borderRect;
        this.image = image;
        this.borderRect.x = -1*this.image.width/2;
        this.borderRect.y = -1*this.image.height/2;
        this.borderRect.width = this.image.width;
        this.borderRect.height = this.image.height;
    }

    onDrag(pointer, dragX, dragY) {
        if (!this.onDragHasFired) {
            this.clone();
            let prevHeight = this.image.height;
            this.image.setTexture(this.isHorizontal ? "rulerH1000" : "rulerV1000");
            this.borderRect.width = this.image.width;
            this.borderRect.height = this.image.height;
            this.borderRect.x = -this.image.width/2;
            this.borderRect.y = -this.image.height/2 ;
            this.onDragHasFired = true;
        }
        if (this.firstDragEndHasFired) {
            this.x = dragX;
            this.y = dragY;
        }
        else {
            this.x = dragX  + this.image.width/2;
            this.y = dragY + this.image.height/2;
        }
    }


    dragEnd(pointer, dragX, dragY) {
        this.firstDragEndHasFired = true;
        if (this.x - this.image.width/2< RippleTank.LEFT_PADDING || 
            this.x - this.image.width/2> RippleTank.LEFT_PADDING + RippleTank.instance.canvasElement.width) {
            console.log("destroy");
            this.destroy();
        }
    }
    
    pointerOut(pointer) {
        this.borderRect.setVisible(false);
    }

    pointerOver(pointer) {
        this.borderRect.setVisible(true);
    }

    clone() {
        return new Ruler(this.scene, this.x, this.y, this.isHorizontal);
    };
}
