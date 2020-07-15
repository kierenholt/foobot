



class HoverText extends Phaser.GameObjects.Text {

    static LINE_HEIGHT = 30;
    static setFontSize(value) {
        console.log(value);
        HoverText.FONT_SIZE = Number(value);
        HoverText.instances.forEach(t => t.setFontSize(HoverText.FONT_SIZE));
    }
    static instances: HoverText[] = [];
    static get TEXTSTYLE():any { 
        return  {
            "fill":HoverText.TEXT_COLOUR,
            "fontFamily":"sans-serif"
        };
    }
    static TEXT_COLOUR = "#fff";
    static FONT_SIZE = 12;

    hoverRect: any;
    scene: Scene1;
    extraPointerOver: any;

    constructor(scene,x,y,parameterName) {
        super(scene,x,y,parameterName,HoverText.TEXTSTYLE);
        HoverText.instances.push(this);
        this.scene.add.existing(this);
        this.scene = scene;
        this.setInteractive();
        this.setDepth(100);
        this.setFontSize(HoverText.FONT_SIZE);


        this.on("pointerover",this.pointerOver);
        this.on("pointerout", this.pointerOut);
        this.on("destroy", () => {
            if (this.hoverRect) { this.hoverRect.destroy(); }
            removeFromArray(HoverText.instances,this);
        })
    }

    pointerOut(pointer) {
        if (this.hoverRect) {this.hoverRect.destroy(); this.hoverRect = undefined; }
    }

    pointerOver(pointer) {
        if (this && !this.hoverRect) {
            var bounds = this.getBounds();
            this.hoverRect = this.scene.add.rectangle(bounds.centerX,bounds.centerY,bounds.width,bounds.height).
                setStrokeStyle(1, Phaser.Display.Color.GetColor(255,0,0)).
                setRotation(this.rotation);
        }
        if (this.extraPointerOver) this.extraPointerOver();
    }

}
  
class ValueText extends HoverText {
    parameterName: string;
    _valueSetter: any;
    _valueGetter: any;

    constructor(scene,x,y,parameterName) {
        super(scene,x,y,parameterName+":");
        this.parameterName = parameterName;
        this.on("pointerdown",(pointer) => { this.onClick() });
    }

    set valueGetter(func) {
        this._valueGetter = func; 
        this.text = this.parameterName+":"+this._valueGetter(); 
    }
    set valueSetter(func) {this._valueSetter = func; }
    
    //prompts to change value
    onClick() {
        var value = window.prompt("set value for "+this.parameterName,this._valueGetter().toString());
        if (isNumeric(value)) { 
            this._valueSetter(Number(value)); 
            this.updateValueText();
        };
    }

    updateValueText() {this.text = this.parameterName+":"+this._valueGetter();}
}

class ButtonText extends HoverText { 
    parameterName: any;
    _onClick: any;

    constructor(scene,x,y,parameterName) {
        super(scene,x,y,parameterName);
        this.parameterName = parameterName;

        this.on("pointerdown",(pointer) => { this.pointerDown() });
    }

    pointerDown() {
        if (this._onClick) this._onClick();
    }

    set onClick(value) {
        this._onClick = value;
    }
}
