function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }


var removeFromArray = function(array, item) {
    for (let i = array.length; i >= 0 ; i--) {
        if (array[i] == item) { array.splice(i, 1); }
    }
}


function objectSome(obj,func) {
    for (var key in obj) {
        if (func(obj[key])) {return true; }
    }
    return false;
} 


abstract class DraggableComponent extends Phaser.GameObjects.Container {
    
    static ABSORBER_COLOUR = 0x888888;
    static OSCILLATOR_COLOUR = 0xcccccc;

    scene: Scene1;
    children: any;
    onDragHasFired: any;
    hitShape: any;
    firstDragEndHasFired: boolean;
    hasPermanentStroke: boolean;
    isDragging: boolean;

    constructor(scene:Scene1,x,y,children: any,hitShape, containsCallback, hasPermanentStroke) { 
        super(scene,x,y, children);
        this.scene = scene; //set overridden scene property
        scene.add.existing(this);
        this.initInteractive(hitShape,containsCallback);
        this.children = children;
        this.hitShape = hitShape;
        this.hasPermanentStroke = hasPermanentStroke;
        this.onDragHasFired = false;
        this.firstDragEndHasFired = false;
        this.isDragging = false;
        this.children.filter(ch => ch instanceof HoverText).forEach(g => g.visible = false);
        this.children.filter(ch => ch instanceof HoverText).forEach(g => g.extraPointerOver = this.pointerOver.bind(this));
    }

    initInteractive(hitShape,containsCallback) {
        this.setInteractive(hitShape, containsCallback);
        this.scene.input.setDraggable(this);
        this.on('drag', this.onDrag);
        this.on('dragend', this.dragEnd);
        this.on("destroy", this.onDestroy);
        //this.on('pointerdown',this.onClick);
        this.on("pointerover", this.pointerOver);
        this.on("pointerout", this.pointerOut);
    }

    onDrag(pointer, dragX, dragY) {
        this.isDragging = true;
        if (!this.onDragHasFired) {
            this.clone();
            this.onFirstDragStart();
            this.onDragHasFired = true;
        }
        if (!this.firstDragEndHasFired) {
            this.x = Math.floor((dragX - 0.5*this.hitShape.width)/5)*5 + 2;
            this.y = Math.floor((dragY - 0.5*this.hitShape.height)/5)*5 + 2;
        }
        else {
            this.x = Math.floor(dragX/5)*5 + 2;
            this.y = Math.floor(dragY/5)*5 + 2;
        }
        this.update();
    }

    dragEnd(pointer, dragX, dragY) {
        this.isDragging = false;
        this.firstDragEndHasFired = true;
        if (this.x < RippleTank.LEFT_PADDING || this.x > RippleTank.LEFT_PADDING + RippleTank.instance.canvasElement.width) {
            console.log("destroy");
            this.destroy();
        }
        this.update();
    }

    pointerOut(pointer) {
        if (this.hasPermanentStroke) {
            this.input.hitArea.setStrokeStyle(1, Phaser.Display.Color.GetColor(0,0,0)); //removes stroke
        }
        else {
            this.input.hitArea.setStrokeStyle(); //removes stroke
        }
        this.children.filter(ch => ch instanceof HoverText).forEach(g => g.visible = false);
    }

    pointerOver(pointer) {
        this.input.hitArea.setStrokeStyle(1, Phaser.Display.Color.GetColor(255,0,0));
        if (this.firstDragEndHasFired) {
            this.children.filter(ch => ch instanceof HoverText).forEach(g => g.visible = true);
        }
    }

    abstract onDestroy();
    abstract update();
    abstract clone();
    abstract onFirstDragStart();
    abstract setPixels();
}

class Glass extends DraggableComponent {

    static BORDER_COLOUR = 0x888888;
    static START_WIDTH = 50;
    static START_HEIGHT = 75;
    static ON_DRAG_WIDTH = 200;
    static ON_DRAG_HEIGHT = 300;
    static START_N = 2;
    hitRect: Phaser.GameObjects.Rectangle;
    n: number;
    widthText: ValueText;
    heightText: ValueText;

    constructor(scene: Scene1,x,y) {
        let ntext = new ValueText(scene, 0,0, "n");
        let widthText = new ValueText(scene, 0,HoverText.LINE_HEIGHT , "width");
        let heightText = new ValueText(scene, 0,2*HoverText.LINE_HEIGHT , "height");
        let angleText = new ValueText(scene, 0,3*HoverText.LINE_HEIGHT, "angle");
        
        let rect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 
            0, 0, 0xffffff, 0).setStrokeStyle(1,Glass.BORDER_COLOUR); //set width and height to zero first
            super(scene,x,y, 
                [rect,ntext,widthText,heightText,angleText], 
                rect,
                Phaser.Geom.Rectangle.Contains,
                true); //width and height
        
        this.scene.refractors.push(this);
        this.hitRect = rect;
        this.hitRect.width = Glass.START_WIDTH;
        this.hitRect.height = Glass.START_HEIGHT;
        this.widthText = widthText;
        this.heightText = heightText;

        //must happen after super
        this.n = Glass.START_N;
        ntext.valueSetter = function(comp) { var comp = comp; return (value)=>{comp.n = value; comp.update()} }(this);
        ntext.valueGetter = function(comp) { var comp = comp; return ()=>{return comp.n} }(this);
        
        angleText.valueSetter = function(comp) { var comp = comp; return (value)=>{comp.angle = value; comp.update()} }(this);
        angleText.valueGetter = function(comp) { var comp = comp; return ()=>{return comp.angle} }(this);
        
        widthText.valueSetter = function(comp) { var comp = comp; return (value)=>{
            comp.hitRect.width = value;
            comp.hitRect.x = 0; comp.hitRect.y = 0;
            comp.update();
        } }(this);
        widthText.valueGetter = function(comp) { var comp = comp; return ()=>{return comp.hitRect.width} }(this);

        heightText.valueSetter = function(comp) { var comp = comp; return (value)=>{
            comp.hitRect.height = value;
            comp.hitRect.x = 0; comp.hitRect.y = 0;
            comp.update();
        } }(this);
        heightText.valueGetter = function(comp) { var comp = comp; return ()=>{return comp.hitRect.height} }(this);
    }
 
    clone() {
        return new Glass(this.scene, this.x, this.y);
    }; 

    onFirstDragStart() {
        this.hitRect.width = Glass.ON_DRAG_WIDTH;
        this.hitRect.height = Glass.ON_DRAG_HEIGHT;
        this.widthText.updateValueText();
        this.heightText.updateValueText();
    }

    setPixels() {
        //only if it is in the ripple tank
        if (this.firstDragEndHasFired && !this.isDragging) {
            let x = (this.x - RippleTank.LEFT_PADDING) / RippleTank.scaleFactor;
            let y = (this.y) / RippleTank.scaleFactor;
            let width = (this.hitRect.width) / RippleTank.scaleFactor;
            let height = (this.hitRect.height) / RippleTank.scaleFactor;
            RippleTank.instance.setNrectangle(x,y,
                width, height,
                this.angle, this.n*this.n);
        }
    }

    onDestroy() { removeFromArray(Scene1.instance.refractors,this); Scene1.instance.updateRefractors();}
    update() { Scene1.instance.updateRefractors();}
}


class Slit extends DraggableComponent {
    static WIDTH = 10;
    static START_TOP_HEIGHT = 50;
    static START_SLIT_WIDTH = 10;
    static ON_DRAG_SLIT_WIDTH = 25;
    static ON_DRAG_TOP_HEIGHT = 1000;
    
    topRect: Phaser.GameObjects.Rectangle;
    bottomRect: Phaser.GameObjects.Rectangle;
    hitRect: Phaser.GameObjects.Rectangle;
    slitWidth: number;
    slitWidthText: ValueText;

    constructor(scene: Scene1,x,y) {
        let slitWidthText = new ValueText(scene, Slit.WIDTH,0, "slit width");
        let fullHeight = Slit.START_TOP_HEIGHT*2 + Slit.START_SLIT_WIDTH;

        let hitRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0, DraggableComponent.ABSORBER_COLOUR, 0); //alpha 0
        let topRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0,  DraggableComponent.ABSORBER_COLOUR);
        let bottomRect = new Phaser.GameObjects.Rectangle(scene, 0, Slit.START_TOP_HEIGHT + Slit.START_SLIT_WIDTH, 0, 0,  DraggableComponent.ABSORBER_COLOUR);
            
        super(scene,x,y, 
            [topRect, bottomRect, hitRect, slitWidthText], 
            hitRect,
            Phaser.Geom.Rectangle.Contains,
            false); //width and height
        
        this.scene.absorbers.push(this);

        this.slitWidthText = slitWidthText;
        this.hitRect = hitRect;
        this.hitRect.width  = Slit.WIDTH;
        this.hitRect.height = fullHeight;
        this.topRect = topRect;
        this.topRect.width = Slit.WIDTH;
        this.topRect.height = Slit.START_TOP_HEIGHT;
        this.bottomRect = bottomRect;
        this.bottomRect.width = Slit.WIDTH;
        this.bottomRect.height = Slit.START_TOP_HEIGHT;
        
        //must happen after super
        this.slitWidth = Slit.START_SLIT_WIDTH;
        slitWidthText.valueSetter = function(comp) { var comp = comp; return (value)=>{
            comp.setSlitWidth(value);
            comp.update();
        } }(this);
        slitWidthText.valueGetter = function(comp) { var comp = comp; return ()=>{return comp.slitWidth} }(this);
    }
 
    clone() {
        return new Slit(this.scene, this.x, this.y);
    }; 

    onFirstDragStart() {
        this.topRect.height = Slit.ON_DRAG_TOP_HEIGHT;
        this.bottomRect.height = Slit.ON_DRAG_TOP_HEIGHT;
        this.setSlitWidth(Slit.ON_DRAG_SLIT_WIDTH);
        this.slitWidthText.y = Slit.ON_DRAG_TOP_HEIGHT;
    }

    setSlitWidth(w) {
        console.log(w);
        this.hitRect.height = 2*Slit.ON_DRAG_TOP_HEIGHT+w;
        this.bottomRect.y = Slit.ON_DRAG_TOP_HEIGHT+w;
        this.slitWidth = w;
        this.slitWidthText.updateValueText();
    }

    setPixels() {
        //only if it is in the ripple tank
        if (this.firstDragEndHasFired && !this.isDragging) {
            let x = (this.x - RippleTank.LEFT_PADDING) / RippleTank.scaleFactor + 1;
            let y0 = (this.y) / RippleTank.scaleFactor;
            let y1 = (this.y + Slit.ON_DRAG_TOP_HEIGHT) / RippleTank.scaleFactor;
            let y2 = (this.y + Slit.ON_DRAG_TOP_HEIGHT + this.slitWidth) / RippleTank.scaleFactor;
            let y3 = (this.y + 2*Slit.ON_DRAG_TOP_HEIGHT + this.slitWidth) / RippleTank.scaleFactor;
            RippleTank.instance.setLineAbsorber(x ,y0,y1);
            RippleTank.instance.setLineAbsorber(x ,y2,y3);
        }
    }

    onDestroy() { removeFromArray(Scene1.instance.absorbers,this); Scene1.instance.updateAbsorbers();}
    update() { Scene1.instance.updateAbsorbers();}

}



class DoubleSlit extends DraggableComponent {
    static WIDTH = 10;
    static START_TOP_HEIGHT = 50;
    static START_SLIT_WIDTH = 10;
    static START_SLIT_SEPARATION = 10;
    static ON_DRAG_SLIT_WIDTH = 15;
    static ON_DRAG_SLIT_SEPARATION = 60;
    static ON_DRAG_TOP_HEIGHT = 1000;
    
    topRect: Phaser.GameObjects.Rectangle;
    bottomRect: Phaser.GameObjects.Rectangle;
    hitRect: Phaser.GameObjects.Rectangle;
    slitWidth: number;
    slitWidthText: ValueText;
    slitSeparationText: ValueText;
    middleRect: Phaser.GameObjects.Rectangle;
    slitSeparation: number;

    constructor(scene: Scene1,x,y) {
        let slitWidthText = new ValueText(scene, DoubleSlit.WIDTH,0, "slit width");
        let slitSeparationText = new ValueText(scene, DoubleSlit.WIDTH,HoverText.LINE_HEIGHT, "slit sep.");

        let fullHeight = DoubleSlit.START_TOP_HEIGHT*2 + 2*DoubleSlit.START_SLIT_WIDTH + DoubleSlit.START_SLIT_SEPARATION;

        let hitRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0,  DraggableComponent.ABSORBER_COLOUR, 0); //alpha 0
        let topRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0,  DraggableComponent.ABSORBER_COLOUR);
        let middleRect = new Phaser.GameObjects.Rectangle(scene, 0, DoubleSlit.START_TOP_HEIGHT + DoubleSlit.START_SLIT_WIDTH, 0, 0,  DraggableComponent.ABSORBER_COLOUR);
        let bottomRect = new Phaser.GameObjects.Rectangle(scene, 0, DoubleSlit.START_TOP_HEIGHT + 2*DoubleSlit.START_SLIT_WIDTH + DoubleSlit.START_SLIT_SEPARATION, 0, 0,  DraggableComponent.ABSORBER_COLOUR);
            
        super(scene,x,y, 
            [topRect, bottomRect, hitRect, slitWidthText, middleRect, slitSeparationText], 
            hitRect,
            Phaser.Geom.Rectangle.Contains,
            false); //width and height
        
            this.scene.absorbers.push(this);

        this.slitWidthText = slitWidthText;
        this.slitSeparationText = slitSeparationText;
        this.hitRect = hitRect;
        this.hitRect.width  = DoubleSlit.WIDTH;
        this.hitRect.height = fullHeight;
        this.topRect = topRect;
        this.topRect.width = DoubleSlit.WIDTH;
        this.topRect.height = DoubleSlit.START_TOP_HEIGHT;
        this.middleRect = middleRect;
        this.middleRect.width = DoubleSlit.WIDTH;
        this.middleRect.height = DoubleSlit.START_SLIT_SEPARATION;
        this.bottomRect = bottomRect;
        this.bottomRect.width = DoubleSlit.WIDTH;
        this.bottomRect.height = DoubleSlit.START_TOP_HEIGHT;
        
        //must happen after super
        this.slitWidth = DoubleSlit.START_SLIT_WIDTH;
        this.slitSeparation = DoubleSlit.START_SLIT_SEPARATION;

        slitWidthText.valueSetter = function(comp) { var comp = comp; return (value)=>{
            comp.setSlitWidth(value);
            comp.update();
        } }(this);
        slitWidthText.valueGetter = function(comp) { var comp = comp; return ()=>{return comp.slitWidth} }(this);
        slitSeparationText.valueSetter = function(comp) { var comp = comp; return (value)=>{
            comp.setSlitSeparation(value);
            comp.update();
        } }(this);
        slitSeparationText.valueGetter = function(comp) { var comp = comp; return ()=>{return comp.slitSeparation} }(this);
    }
 
    clone() {
        return new Slit(this.scene, this.x, this.y);
    }; 

    onFirstDragStart() {
        this.topRect.height = DoubleSlit.ON_DRAG_TOP_HEIGHT;
        this.bottomRect.height = DoubleSlit.ON_DRAG_TOP_HEIGHT;
        this.setSlitWidth(DoubleSlit.ON_DRAG_SLIT_WIDTH);
        this.setSlitSeparation(DoubleSlit.ON_DRAG_SLIT_SEPARATION);
        this.slitWidthText.y = DoubleSlit.ON_DRAG_TOP_HEIGHT;
        this.slitSeparationText.y = DoubleSlit.ON_DRAG_TOP_HEIGHT + HoverText.LINE_HEIGHT;
    }

    setSlitWidth(w) {
        console.log(w);
        this.hitRect.height = 2*DoubleSlit.ON_DRAG_TOP_HEIGHT + 2*w + this.slitSeparation;
        this.middleRect.y = DoubleSlit.ON_DRAG_TOP_HEIGHT + w;
        this.bottomRect.y = DoubleSlit.ON_DRAG_TOP_HEIGHT + 2*w + this.slitSeparation;
        this.slitWidth = w;
        this.slitWidthText.updateValueText();
    }

    setSlitSeparation(s) {
        this.hitRect.height = 2*DoubleSlit.ON_DRAG_TOP_HEIGHT + 2*this.slitWidth + s;
        this.middleRect.height = s;
        this.bottomRect.y = DoubleSlit.ON_DRAG_TOP_HEIGHT + 2*this.slitWidth + s;
        this.slitSeparation = s;
        this.slitSeparationText.updateValueText();
    }

    setPixels() {
        //only if it is in the ripple tank
        if (this.firstDragEndHasFired && !this.isDragging) {
            let x = (this.x - RippleTank.LEFT_PADDING) / RippleTank.scaleFactor + 1;
            let y0 = (this.y) / RippleTank.scaleFactor;
            let y1 = (this.y + Slit.ON_DRAG_TOP_HEIGHT) / RippleTank.scaleFactor;
            let y2 = (this.y + Slit.ON_DRAG_TOP_HEIGHT + this.slitWidth) / RippleTank.scaleFactor;
            let y3 = (this.y + Slit.ON_DRAG_TOP_HEIGHT + this.slitWidth + this.slitSeparation) / RippleTank.scaleFactor;
            let y4 = (this.y + Slit.ON_DRAG_TOP_HEIGHT + 2*this.slitWidth + this.slitSeparation) / RippleTank.scaleFactor;
            let y5 = (this.y + 2*Slit.ON_DRAG_TOP_HEIGHT + 2*this.slitWidth + this.slitSeparation) / RippleTank.scaleFactor;
            RippleTank.instance.setLineAbsorber(x ,y0,y1);
            RippleTank.instance.setLineAbsorber(x ,y2,y3);
            RippleTank.instance.setLineAbsorber(x ,y4,y5);
        }
    }
    onDestroy() { removeFromArray(Scene1.instance.absorbers,this); Scene1.instance.updateAbsorbers();}
    update() { Scene1.instance.updateAbsorbers();}
}

class PointOscillator extends DraggableComponent {
    static START_RADIUS = 25;
    static OSCILLATE_FRAMES = 10; //must be even
    circle: Phaser.GameObjects.Ellipse;

    phase: number;
    animCounter: number;
    activeText: ButtonText;
    pulseText: ButtonText;
    active: boolean;
    

    constructor(scene: Scene1,x,y) {
        let phaseText = new ValueText(scene, PointOscillator.START_RADIUS ,0, "phase");
        let activeText = new ButtonText(scene, PointOscillator.START_RADIUS ,HoverText.LINE_HEIGHT,"ON");
        let pulseText = new ButtonText(scene, PointOscillator.START_RADIUS ,2*HoverText.LINE_HEIGHT,"pulse");
        
        let circle = new Phaser.GameObjects.Ellipse(scene, 0, 0, 
            0, 0, DraggableComponent.OSCILLATOR_COLOUR);
        super(scene,x,y,  
            [circle, phaseText, activeText, pulseText], 
            circle,
            Phaser.Geom.Ellipse.Contains,
            false); //width and height
        scene.updateFunctions.push(this.updateFrame.bind(this));
        
        this.scene.absorbers.push(this);

        this.circle = circle;
        this.circle.height = PointOscillator.START_RADIUS;
        this.circle.width = PointOscillator.START_RADIUS;
        this.animCounter = 0;
        this.active = true;
        this.activeText = activeText;
        this.pulseText = pulseText;

        //must happen after super
        this.phase = 0;        
        phaseText.valueSetter = function(comp) { var comp = comp; return (value)=>{comp.phase = value} }(this);
        phaseText.valueGetter = function(comp) { var comp = comp; return ()=>{return comp.phase} }(this);
        activeText.onClick = function(comp) { var comp = comp; return ()=>{comp.toggleActive(); } }(this);
        pulseText.onClick = function(comp) { var comp = comp; return ()=>{comp.pulse(); } }(this);
     }
    
    pulse() {
        let x = (this.x - RippleTank.LEFT_PADDING) / RippleTank.scaleFactor;
        let y = (this.y) / RippleTank.scaleFactor;
        RippleTank.instance.disturbBall(x,y);
    }


    clone() {
        return new PointOscillator(this.scene, this.x, this.y);
    }; 

    onFirstDragStart() {
        //no change in size 
    }

    updateFrame() {
        if (this.active) {
            if (this.animCounter % PointOscillator.OSCILLATE_FRAMES == 0) {
                this.circle.setSize(PointOscillator.START_RADIUS,PointOscillator.START_RADIUS);
            }
            if (this.animCounter % PointOscillator.OSCILLATE_FRAMES == PointOscillator.OSCILLATE_FRAMES/2) {
                this.circle.setSize(PointOscillator.START_RADIUS+2,PointOscillator.START_RADIUS+2);
            }
            this.animCounter++;
        }
    }
    toggleActive() {
        this.active = !this.active;
        this.activeText.setText(this.active ? "ON" : "OFF");
        this.update();
    }

    setPixels() {
        //only if it is in the ripple tank
        if (this.firstDragEndHasFired && this.active  && !this.isDragging) {
            let x = (this.x - RippleTank.LEFT_PADDING) / RippleTank.scaleFactor;
            let y = (this.y) / RippleTank.scaleFactor;
            console.log(x,y)
            RippleTank.instance.setPointOscillator(x ,y);
        }
    }
    onDestroy() { removeFromArray(Scene1.instance.absorbers,this); Scene1.instance.updateAbsorbers();}
    update() { Scene1.instance.updateAbsorbers();}
}


class LineOscillator extends DraggableComponent {
    static START_HEIGHT = 50;
    static START_WIDTH = 10;
    static ON_DRAG_HEIGHT = 1000;
    static OSCILLATE_FRAMES = 10; //must be even
    hitRect: Phaser.GameObjects.Rectangle;
    active: boolean;
    phase: number;
    animCounter: number;
    phaseText: ValueText;
    activeText: ButtonText;
    pulseText: ButtonText;
    

    constructor(scene: Scene1,x,y) {
        let phaseText = new ValueText(scene, LineOscillator.START_WIDTH ,0, "phase");
        let activeText = new ButtonText(scene, LineOscillator.START_WIDTH ,HoverText.LINE_HEIGHT,"ON");
        let pulseText = new ButtonText(scene, LineOscillator.START_WIDTH ,2*HoverText.LINE_HEIGHT,"pulse");
        
        let hitRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0, DraggableComponent.OSCILLATOR_COLOUR);
        super(scene,x,y,  
            [hitRect, phaseText, activeText ,pulseText], 
            hitRect,
            Phaser.Geom.Rectangle.Contains,
            false); //width and height
        scene.updateFunctions.push(this.updateFrame.bind(this));
        
        this.scene.absorbers.push(this);

        this.hitRect = hitRect;
        this.hitRect.width = LineOscillator.START_WIDTH;
        this.hitRect.height =  LineOscillator.START_HEIGHT;
        this.phaseText = phaseText;
        this.activeText = activeText;
        this.pulseText = pulseText;

        this.animCounter = 0;
        this.active = true;

        //must happen after super
        this.phase = 0;        
        phaseText.valueSetter = function(comp) { var comp = comp; return (value)=>{comp.phase = value} }(this);
        phaseText.valueGetter = function(comp) { var comp = comp; return ()=>{return comp.phase} }(this);
        activeText.onClick = function(comp) { var comp = comp; return ()=>{comp.toggleActive(); } }(this);
        pulseText.onClick = function(comp) { var comp = comp; return ()=>{comp.pulse(); } }(this);
    }
 
    toggleActive() {
        this.active = !this.active;
        this.activeText.setText(this.active ? "ON" : "OFF");
        this.update();
    }

    pulse() {
        let x = (this.x - RippleTank.LEFT_PADDING + LineOscillator.START_WIDTH/2) / RippleTank.scaleFactor;
        RippleTank.instance.disturbLine(x);
    }

    clone() {
        return new LineOscillator(this.scene, this.x, this.y);
    }; 

    onFirstDragStart() {
        this.hitRect.height = LineOscillator.ON_DRAG_HEIGHT;
        this.hitRect.y = 0;
        this.phaseText.y = LineOscillator.ON_DRAG_HEIGHT/2;
        this.activeText.y = LineOscillator.ON_DRAG_HEIGHT/2 + HoverText.LINE_HEIGHT;
        this.pulseText.y = LineOscillator.ON_DRAG_HEIGHT/2 + 2*HoverText.LINE_HEIGHT;
    }

    updateFrame() {
        if (this.active) {
            if (this.animCounter % LineOscillator.OSCILLATE_FRAMES == 0) {
                this.hitRect.width = LineOscillator.START_WIDTH;
            }
            if (this.animCounter % LineOscillator.OSCILLATE_FRAMES == LineOscillator.OSCILLATE_FRAMES/2) {
                this.hitRect.width = LineOscillator.START_WIDTH+2;
            }
            this.animCounter++;
        }
    }

    setPixels() {
        //only if it is in the ripple tank
        if (this.firstDragEndHasFired && this.active && !this.isDragging) {
            let x = (this.x - RippleTank.LEFT_PADDING + LineOscillator.START_WIDTH/2) / RippleTank.scaleFactor;
            RippleTank.instance.setLineOscillator(x);
        }
    }
    onDestroy() { 
        removeFromArray(Scene1.instance.absorbers,this); 
        Scene1.instance.updateAbsorbers(); 
    }
    update() { Scene1.instance.updateAbsorbers();}
}


