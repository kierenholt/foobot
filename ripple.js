function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
var removeFromArray = function (array, item) {
    for (let i = array.length; i >= 0; i--) {
        if (array[i] == item) {
            array.splice(i, 1);
        }
    }
};
function objectSome(obj, func) {
    for (var key in obj) {
        if (func(obj[key])) {
            return true;
        }
    }
    return false;
}
class DraggableComponent extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children, hitShape, containsCallback, hasPermanentStroke) {
        super(scene, x, y, children);
        this.scene = scene;
        scene.add.existing(this);
        this.initInteractive(hitShape, containsCallback);
        this.children = children;
        this.hitShape = hitShape;
        this.hasPermanentStroke = hasPermanentStroke;
        this.onDragHasFired = false;
        this.firstDragEndHasFired = false;
        this.isDragging = false;
        this.children.filter(ch => ch instanceof HoverText).forEach(g => g.visible = false);
        this.children.filter(ch => ch instanceof HoverText).forEach(g => g.extraPointerOver = this.pointerOver.bind(this));
    }
    initInteractive(hitShape, containsCallback) {
        this.setInteractive(hitShape, containsCallback);
        this.scene.input.setDraggable(this);
        this.on('drag', this.onDrag);
        this.on('dragend', this.dragEnd);
        this.on("destroy", this.onDestroy);
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
            this.x = Math.floor((dragX - 0.5 * this.hitShape.width) / 5) * 5 + 2;
            this.y = Math.floor((dragY - 0.5 * this.hitShape.height) / 5) * 5 + 2;
        }
        else {
            this.x = Math.floor(dragX / 5) * 5 + 2;
            this.y = Math.floor(dragY / 5) * 5 + 2;
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
            this.input.hitArea.setStrokeStyle(1, Phaser.Display.Color.GetColor(0, 0, 0));
        }
        else {
            this.input.hitArea.setStrokeStyle();
        }
        this.children.filter(ch => ch instanceof HoverText).forEach(g => g.visible = false);
    }
    pointerOver(pointer) {
        this.input.hitArea.setStrokeStyle(1, Phaser.Display.Color.GetColor(255, 0, 0));
        if (this.firstDragEndHasFired) {
            this.children.filter(ch => ch instanceof HoverText).forEach(g => g.visible = true);
        }
    }
}
DraggableComponent.ABSORBER_COLOUR = 0x888888;
DraggableComponent.OSCILLATOR_COLOUR = 0xcccccc;
class Glass extends DraggableComponent {
    constructor(scene, x, y) {
        let ntext = new ValueText(scene, 0, 0, "n");
        let widthText = new ValueText(scene, 0, HoverText.LINE_HEIGHT, "width");
        let heightText = new ValueText(scene, 0, 2 * HoverText.LINE_HEIGHT, "height");
        let angleText = new ValueText(scene, 0, 3 * HoverText.LINE_HEIGHT, "angle");
        let rect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0, 0xffffff, 0).setStrokeStyle(1, Glass.BORDER_COLOUR);
        super(scene, x, y, [rect, ntext, widthText, heightText, angleText], rect, Phaser.Geom.Rectangle.Contains, true);
        this.scene.refractors.push(this);
        this.hitRect = rect;
        this.hitRect.width = Glass.START_WIDTH;
        this.hitRect.height = Glass.START_HEIGHT;
        this.widthText = widthText;
        this.heightText = heightText;
        this.n = Glass.START_N;
        ntext.valueSetter = function (comp) { var comp = comp; return (value) => { comp.n = value; comp.update(); }; }(this);
        ntext.valueGetter = function (comp) { var comp = comp; return () => { return comp.n; }; }(this);
        angleText.valueSetter = function (comp) { var comp = comp; return (value) => { comp.angle = value; comp.update(); }; }(this);
        angleText.valueGetter = function (comp) { var comp = comp; return () => { return comp.angle; }; }(this);
        widthText.valueSetter = function (comp) {
            var comp = comp;
            return (value) => {
                comp.hitRect.width = value;
                comp.hitRect.x = 0;
                comp.hitRect.y = 0;
                comp.update();
            };
        }(this);
        widthText.valueGetter = function (comp) { var comp = comp; return () => { return comp.hitRect.width; }; }(this);
        heightText.valueSetter = function (comp) {
            var comp = comp;
            return (value) => {
                comp.hitRect.height = value;
                comp.hitRect.x = 0;
                comp.hitRect.y = 0;
                comp.update();
            };
        }(this);
        heightText.valueGetter = function (comp) { var comp = comp; return () => { return comp.hitRect.height; }; }(this);
    }
    clone() {
        return new Glass(this.scene, this.x, this.y);
    }
    ;
    onFirstDragStart() {
        this.hitRect.width = Glass.ON_DRAG_WIDTH;
        this.hitRect.height = Glass.ON_DRAG_HEIGHT;
        this.widthText.updateValueText();
        this.heightText.updateValueText();
    }
    setPixels() {
        if (this.firstDragEndHasFired && !this.isDragging) {
            let x = (this.x - RippleTank.LEFT_PADDING) / RippleTank.scaleFactor;
            let y = (this.y) / RippleTank.scaleFactor;
            let width = (this.hitRect.width) / RippleTank.scaleFactor;
            let height = (this.hitRect.height) / RippleTank.scaleFactor;
            RippleTank.instance.setNrectangle(x, y, width, height, this.angle, this.n * this.n);
        }
    }
    onDestroy() { removeFromArray(Scene1.instance.refractors, this); Scene1.instance.updateRefractors(); }
    update() { Scene1.instance.updateRefractors(); }
}
Glass.BORDER_COLOUR = 0x888888;
Glass.START_WIDTH = 50;
Glass.START_HEIGHT = 75;
Glass.ON_DRAG_WIDTH = 200;
Glass.ON_DRAG_HEIGHT = 300;
Glass.START_N = 2;
class Slit extends DraggableComponent {
    constructor(scene, x, y) {
        let slitWidthText = new ValueText(scene, Slit.WIDTH, 0, "slit width");
        let fullHeight = Slit.START_TOP_HEIGHT * 2 + Slit.START_SLIT_WIDTH;
        let hitRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0, DraggableComponent.ABSORBER_COLOUR, 0);
        let topRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0, DraggableComponent.ABSORBER_COLOUR);
        let bottomRect = new Phaser.GameObjects.Rectangle(scene, 0, Slit.START_TOP_HEIGHT + Slit.START_SLIT_WIDTH, 0, 0, DraggableComponent.ABSORBER_COLOUR);
        super(scene, x, y, [topRect, bottomRect, hitRect, slitWidthText], hitRect, Phaser.Geom.Rectangle.Contains, false);
        this.scene.absorbers.push(this);
        this.slitWidthText = slitWidthText;
        this.hitRect = hitRect;
        this.hitRect.width = Slit.WIDTH;
        this.hitRect.height = fullHeight;
        this.topRect = topRect;
        this.topRect.width = Slit.WIDTH;
        this.topRect.height = Slit.START_TOP_HEIGHT;
        this.bottomRect = bottomRect;
        this.bottomRect.width = Slit.WIDTH;
        this.bottomRect.height = Slit.START_TOP_HEIGHT;
        this.slitWidth = Slit.START_SLIT_WIDTH;
        slitWidthText.valueSetter = function (comp) {
            var comp = comp;
            return (value) => {
                comp.setSlitWidth(value);
                comp.update();
            };
        }(this);
        slitWidthText.valueGetter = function (comp) { var comp = comp; return () => { return comp.slitWidth; }; }(this);
    }
    clone() {
        return new Slit(this.scene, this.x, this.y);
    }
    ;
    onFirstDragStart() {
        this.topRect.height = Slit.ON_DRAG_TOP_HEIGHT;
        this.bottomRect.height = Slit.ON_DRAG_TOP_HEIGHT;
        this.setSlitWidth(Slit.ON_DRAG_SLIT_WIDTH);
        this.slitWidthText.y = Slit.ON_DRAG_TOP_HEIGHT;
    }
    setSlitWidth(w) {
        console.log(w);
        this.hitRect.height = 2 * Slit.ON_DRAG_TOP_HEIGHT + w;
        this.bottomRect.y = Slit.ON_DRAG_TOP_HEIGHT + w;
        this.slitWidth = w;
        this.slitWidthText.updateValueText();
    }
    setPixels() {
        if (this.firstDragEndHasFired && !this.isDragging) {
            let x = (this.x - RippleTank.LEFT_PADDING) / RippleTank.scaleFactor + 1;
            let y0 = (this.y) / RippleTank.scaleFactor;
            let y1 = (this.y + Slit.ON_DRAG_TOP_HEIGHT) / RippleTank.scaleFactor;
            let y2 = (this.y + Slit.ON_DRAG_TOP_HEIGHT + this.slitWidth) / RippleTank.scaleFactor;
            let y3 = (this.y + 2 * Slit.ON_DRAG_TOP_HEIGHT + this.slitWidth) / RippleTank.scaleFactor;
            RippleTank.instance.setLineAbsorber(x, y0, y1);
            RippleTank.instance.setLineAbsorber(x, y2, y3);
        }
    }
    onDestroy() { removeFromArray(Scene1.instance.absorbers, this); Scene1.instance.updateAbsorbers(); }
    update() { Scene1.instance.updateAbsorbers(); }
}
Slit.WIDTH = 10;
Slit.START_TOP_HEIGHT = 50;
Slit.START_SLIT_WIDTH = 10;
Slit.ON_DRAG_SLIT_WIDTH = 25;
Slit.ON_DRAG_TOP_HEIGHT = 1000;
class DoubleSlit extends DraggableComponent {
    constructor(scene, x, y) {
        let slitWidthText = new ValueText(scene, DoubleSlit.WIDTH, 0, "slit width");
        let slitSeparationText = new ValueText(scene, DoubleSlit.WIDTH, HoverText.LINE_HEIGHT, "slit sep.");
        let fullHeight = DoubleSlit.START_TOP_HEIGHT * 2 + 2 * DoubleSlit.START_SLIT_WIDTH + DoubleSlit.START_SLIT_SEPARATION;
        let hitRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0, DraggableComponent.ABSORBER_COLOUR, 0);
        let topRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0, DraggableComponent.ABSORBER_COLOUR);
        let middleRect = new Phaser.GameObjects.Rectangle(scene, 0, DoubleSlit.START_TOP_HEIGHT + DoubleSlit.START_SLIT_WIDTH, 0, 0, DraggableComponent.ABSORBER_COLOUR);
        let bottomRect = new Phaser.GameObjects.Rectangle(scene, 0, DoubleSlit.START_TOP_HEIGHT + 2 * DoubleSlit.START_SLIT_WIDTH + DoubleSlit.START_SLIT_SEPARATION, 0, 0, DraggableComponent.ABSORBER_COLOUR);
        super(scene, x, y, [topRect, bottomRect, hitRect, slitWidthText, middleRect, slitSeparationText], hitRect, Phaser.Geom.Rectangle.Contains, false);
        this.scene.absorbers.push(this);
        this.slitWidthText = slitWidthText;
        this.slitSeparationText = slitSeparationText;
        this.hitRect = hitRect;
        this.hitRect.width = DoubleSlit.WIDTH;
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
        this.slitWidth = DoubleSlit.START_SLIT_WIDTH;
        this.slitSeparation = DoubleSlit.START_SLIT_SEPARATION;
        slitWidthText.valueSetter = function (comp) {
            var comp = comp;
            return (value) => {
                comp.setSlitWidth(value);
                comp.update();
            };
        }(this);
        slitWidthText.valueGetter = function (comp) { var comp = comp; return () => { return comp.slitWidth; }; }(this);
        slitSeparationText.valueSetter = function (comp) {
            var comp = comp;
            return (value) => {
                comp.setSlitSeparation(value);
                comp.update();
            };
        }(this);
        slitSeparationText.valueGetter = function (comp) { var comp = comp; return () => { return comp.slitSeparation; }; }(this);
    }
    clone() {
        return new Slit(this.scene, this.x, this.y);
    }
    ;
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
        this.hitRect.height = 2 * DoubleSlit.ON_DRAG_TOP_HEIGHT + 2 * w + this.slitSeparation;
        this.middleRect.y = DoubleSlit.ON_DRAG_TOP_HEIGHT + w;
        this.bottomRect.y = DoubleSlit.ON_DRAG_TOP_HEIGHT + 2 * w + this.slitSeparation;
        this.slitWidth = w;
        this.slitWidthText.updateValueText();
    }
    setSlitSeparation(s) {
        this.hitRect.height = 2 * DoubleSlit.ON_DRAG_TOP_HEIGHT + 2 * this.slitWidth + s;
        this.middleRect.height = s;
        this.bottomRect.y = DoubleSlit.ON_DRAG_TOP_HEIGHT + 2 * this.slitWidth + s;
        this.slitSeparation = s;
        this.slitSeparationText.updateValueText();
    }
    setPixels() {
        if (this.firstDragEndHasFired && !this.isDragging) {
            let x = (this.x - RippleTank.LEFT_PADDING) / RippleTank.scaleFactor + 1;
            let y0 = (this.y) / RippleTank.scaleFactor;
            let y1 = (this.y + Slit.ON_DRAG_TOP_HEIGHT) / RippleTank.scaleFactor;
            let y2 = (this.y + Slit.ON_DRAG_TOP_HEIGHT + this.slitWidth) / RippleTank.scaleFactor;
            let y3 = (this.y + Slit.ON_DRAG_TOP_HEIGHT + this.slitWidth + this.slitSeparation) / RippleTank.scaleFactor;
            let y4 = (this.y + Slit.ON_DRAG_TOP_HEIGHT + 2 * this.slitWidth + this.slitSeparation) / RippleTank.scaleFactor;
            let y5 = (this.y + 2 * Slit.ON_DRAG_TOP_HEIGHT + 2 * this.slitWidth + this.slitSeparation) / RippleTank.scaleFactor;
            RippleTank.instance.setLineAbsorber(x, y0, y1);
            RippleTank.instance.setLineAbsorber(x, y2, y3);
            RippleTank.instance.setLineAbsorber(x, y4, y5);
        }
    }
    onDestroy() { removeFromArray(Scene1.instance.absorbers, this); Scene1.instance.updateAbsorbers(); }
    update() { Scene1.instance.updateAbsorbers(); }
}
DoubleSlit.WIDTH = 10;
DoubleSlit.START_TOP_HEIGHT = 50;
DoubleSlit.START_SLIT_WIDTH = 10;
DoubleSlit.START_SLIT_SEPARATION = 10;
DoubleSlit.ON_DRAG_SLIT_WIDTH = 15;
DoubleSlit.ON_DRAG_SLIT_SEPARATION = 60;
DoubleSlit.ON_DRAG_TOP_HEIGHT = 1000;
class PointOscillator extends DraggableComponent {
    constructor(scene, x, y) {
        let phaseText = new ValueText(scene, PointOscillator.START_RADIUS, 0, "phase");
        let activeText = new ButtonText(scene, PointOscillator.START_RADIUS, HoverText.LINE_HEIGHT, "ON");
        let pulseText = new ButtonText(scene, PointOscillator.START_RADIUS, 2 * HoverText.LINE_HEIGHT, "pulse");
        let circle = new Phaser.GameObjects.Ellipse(scene, 0, 0, 0, 0, DraggableComponent.OSCILLATOR_COLOUR);
        super(scene, x, y, [circle, phaseText, activeText, pulseText], circle, Phaser.Geom.Ellipse.Contains, false);
        scene.updateFunctions.push(this.updateFrame.bind(this));
        this.scene.absorbers.push(this);
        this.circle = circle;
        this.circle.height = PointOscillator.START_RADIUS;
        this.circle.width = PointOscillator.START_RADIUS;
        this.animCounter = 0;
        this.active = true;
        this.activeText = activeText;
        this.pulseText = pulseText;
        this.phase = 0;
        phaseText.valueSetter = function (comp) { var comp = comp; return (value) => { comp.phase = value; }; }(this);
        phaseText.valueGetter = function (comp) { var comp = comp; return () => { return comp.phase; }; }(this);
        activeText.onClick = function (comp) { var comp = comp; return () => { comp.toggleActive(); }; }(this);
        pulseText.onClick = function (comp) { var comp = comp; return () => { comp.pulse(); }; }(this);
    }
    pulse() {
        let x = (this.x - RippleTank.LEFT_PADDING) / RippleTank.scaleFactor;
        let y = (this.y) / RippleTank.scaleFactor;
        RippleTank.instance.disturbBall(x, y);
    }
    clone() {
        return new PointOscillator(this.scene, this.x, this.y);
    }
    ;
    onFirstDragStart() {
    }
    updateFrame() {
        if (this.active) {
            if (this.animCounter % PointOscillator.OSCILLATE_FRAMES == 0) {
                this.circle.setSize(PointOscillator.START_RADIUS, PointOscillator.START_RADIUS);
            }
            if (this.animCounter % PointOscillator.OSCILLATE_FRAMES == PointOscillator.OSCILLATE_FRAMES / 2) {
                this.circle.setSize(PointOscillator.START_RADIUS + 2, PointOscillator.START_RADIUS + 2);
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
        if (this.firstDragEndHasFired && this.active && !this.isDragging) {
            let x = (this.x - RippleTank.LEFT_PADDING) / RippleTank.scaleFactor;
            let y = (this.y) / RippleTank.scaleFactor;
            console.log(x, y);
            RippleTank.instance.setPointOscillator(x, y);
        }
    }
    onDestroy() { removeFromArray(Scene1.instance.absorbers, this); Scene1.instance.updateAbsorbers(); }
    update() { Scene1.instance.updateAbsorbers(); }
}
PointOscillator.START_RADIUS = 25;
PointOscillator.OSCILLATE_FRAMES = 10;
class LineOscillator extends DraggableComponent {
    constructor(scene, x, y) {
        let phaseText = new ValueText(scene, LineOscillator.START_WIDTH, 0, "phase");
        let activeText = new ButtonText(scene, LineOscillator.START_WIDTH, HoverText.LINE_HEIGHT, "ON");
        let pulseText = new ButtonText(scene, LineOscillator.START_WIDTH, 2 * HoverText.LINE_HEIGHT, "pulse");
        let hitRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0, DraggableComponent.OSCILLATOR_COLOUR);
        super(scene, x, y, [hitRect, phaseText, activeText, pulseText], hitRect, Phaser.Geom.Rectangle.Contains, false);
        scene.updateFunctions.push(this.updateFrame.bind(this));
        this.scene.absorbers.push(this);
        this.hitRect = hitRect;
        this.hitRect.width = LineOscillator.START_WIDTH;
        this.hitRect.height = LineOscillator.START_HEIGHT;
        this.phaseText = phaseText;
        this.activeText = activeText;
        this.pulseText = pulseText;
        this.animCounter = 0;
        this.active = true;
        this.phase = 0;
        phaseText.valueSetter = function (comp) { var comp = comp; return (value) => { comp.phase = value; }; }(this);
        phaseText.valueGetter = function (comp) { var comp = comp; return () => { return comp.phase; }; }(this);
        activeText.onClick = function (comp) { var comp = comp; return () => { comp.toggleActive(); }; }(this);
        pulseText.onClick = function (comp) { var comp = comp; return () => { comp.pulse(); }; }(this);
    }
    toggleActive() {
        this.active = !this.active;
        this.activeText.setText(this.active ? "ON" : "OFF");
        this.update();
    }
    pulse() {
        let x = (this.x - RippleTank.LEFT_PADDING + LineOscillator.START_WIDTH / 2) / RippleTank.scaleFactor;
        RippleTank.instance.disturbLine(x);
    }
    clone() {
        return new LineOscillator(this.scene, this.x, this.y);
    }
    ;
    onFirstDragStart() {
        this.hitRect.height = LineOscillator.ON_DRAG_HEIGHT;
        this.hitRect.y = 0;
        this.phaseText.y = LineOscillator.ON_DRAG_HEIGHT / 2;
        this.activeText.y = LineOscillator.ON_DRAG_HEIGHT / 2 + HoverText.LINE_HEIGHT;
        this.pulseText.y = LineOscillator.ON_DRAG_HEIGHT / 2 + 2 * HoverText.LINE_HEIGHT;
    }
    updateFrame() {
        if (this.active) {
            if (this.animCounter % LineOscillator.OSCILLATE_FRAMES == 0) {
                this.hitRect.width = LineOscillator.START_WIDTH;
            }
            if (this.animCounter % LineOscillator.OSCILLATE_FRAMES == LineOscillator.OSCILLATE_FRAMES / 2) {
                this.hitRect.width = LineOscillator.START_WIDTH + 2;
            }
            this.animCounter++;
        }
    }
    setPixels() {
        if (this.firstDragEndHasFired && this.active && !this.isDragging) {
            let x = (this.x - RippleTank.LEFT_PADDING + LineOscillator.START_WIDTH / 2) / RippleTank.scaleFactor;
            RippleTank.instance.setLineOscillator(x);
        }
    }
    onDestroy() {
        removeFromArray(Scene1.instance.absorbers, this);
        Scene1.instance.updateAbsorbers();
    }
    update() { Scene1.instance.updateAbsorbers(); }
}
LineOscillator.START_HEIGHT = 50;
LineOscillator.START_WIDTH = 10;
LineOscillator.ON_DRAG_HEIGHT = 1000;
LineOscillator.OSCILLATE_FRAMES = 10;
class myGame extends Phaser.Game {
    constructor() {
        let config = {
            type: Phaser.CANVAS,
            width: RippleTank.instance.imageWidth + RippleTank.LEFT_PADDING,
            height: RippleTank.instance.imageHeight,
            autoFocus: true,
            transparent: true,
            parent: 'gameDiv',
            url: '',
            title: 'Blue Ripple tank',
            version: '0.0.1',
            scene: [new Scene1()],
            canvas: document.getElementById("objects")
        };
        super(config);
    }
}
class HoverText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, parameterName) {
        super(scene, x, y, parameterName, HoverText.TEXTSTYLE);
        HoverText.instances.push(this);
        this.scene.add.existing(this);
        this.scene = scene;
        this.setInteractive();
        this.setDepth(100);
        this.setFontSize(HoverText.FONT_SIZE);
        this.on("pointerover", this.pointerOver);
        this.on("pointerout", this.pointerOut);
        this.on("destroy", () => {
            if (this.hoverRect) {
                this.hoverRect.destroy();
            }
            removeFromArray(HoverText.instances, this);
        });
    }
    static setFontSize(value) {
        console.log(value);
        HoverText.FONT_SIZE = Number(value);
        HoverText.instances.forEach(t => t.setFontSize(HoverText.FONT_SIZE));
    }
    static get TEXTSTYLE() {
        return {
            "fill": HoverText.TEXT_COLOUR,
            "fontFamily": "sans-serif"
        };
    }
    pointerOut(pointer) {
        if (this.hoverRect) {
            this.hoverRect.destroy();
            this.hoverRect = undefined;
        }
    }
    pointerOver(pointer) {
        if (this && !this.hoverRect) {
            var bounds = this.getBounds();
            this.hoverRect = this.scene.add.rectangle(bounds.centerX, bounds.centerY, bounds.width, bounds.height).
                setStrokeStyle(1, Phaser.Display.Color.GetColor(255, 0, 0)).
                setRotation(this.rotation);
        }
        if (this.extraPointerOver)
            this.extraPointerOver();
    }
}
HoverText.LINE_HEIGHT = 30;
HoverText.instances = [];
HoverText.TEXT_COLOUR = "#fff";
HoverText.FONT_SIZE = 12;
class ValueText extends HoverText {
    constructor(scene, x, y, parameterName) {
        super(scene, x, y, parameterName + ":");
        this.parameterName = parameterName;
        this.on("pointerdown", (pointer) => { this.onClick(); });
    }
    set valueGetter(func) {
        this._valueGetter = func;
        this.text = this.parameterName + ":" + this._valueGetter();
    }
    set valueSetter(func) { this._valueSetter = func; }
    onClick() {
        var value = window.prompt("set value for " + this.parameterName, this._valueGetter().toString());
        if (isNumeric(value)) {
            this._valueSetter(Number(value));
            this.updateValueText();
        }
        ;
    }
    updateValueText() { this.text = this.parameterName + ":" + this._valueGetter(); }
}
class ButtonText extends HoverText {
    constructor(scene, x, y, parameterName) {
        super(scene, x, y, parameterName);
        this.parameterName = parameterName;
        this.on("pointerdown", (pointer) => { this.pointerDown(); });
    }
    pointerDown() {
        if (this._onClick)
            this._onClick();
    }
    set onClick(value) {
        this._onClick = value;
    }
}
class RippleTank {
    constructor(canvasElement, wasmModule) {
        this.playing = false;
        RippleTank.instance = this;
        this.wasmModule = wasmModule;
        this.canvasElement = canvasElement;
        RippleTank.GRID_WIDTH = Math.floor(window.innerWidth - RippleTank.LEFT_PADDING - RippleTank.RIGHT_PADDING) / RippleTank.scaleFactor;
        RippleTank.GRID_HEIGHT = Math.floor(window.innerHeight / RippleTank.scaleFactor);
        this.wasmModule.instance.exports.init(RippleTank.GRID_WIDTH, RippleTank.GRID_HEIGHT);
        this.canvasElement.width = RippleTank.scaleFactor * RippleTank.GRID_WIDTH;
        this.canvasElement.height = RippleTank.scaleFactor * RippleTank.GRID_HEIGHT;
        this.canvasContext = canvasElement.getContext("2d");
        this.canvasContext.scale(RippleTank.scaleFactor, RippleTank.scaleFactor);
        if (!RippleTank.DEBUG)
            this.play();
    }
    get imageWidth() { return this.canvasElement.width; }
    get imageHeight() { return this.canvasElement.height; }
    getImageArray() {
        let memory = this.wasmModule.instance.exports.memory;
        const wasmByteMemoryArray = new Uint8Array(memory.buffer);
        let start = this.wasmModule.instance.exports.RIPPLE_IMAGE_MEM_START.valueOf();
        return wasmByteMemoryArray.slice(start, start + this.wasmModule.instance.exports.RIPPLE_IMAGE_MEM_SIZE.valueOf());
    }
    copyMemoryToCanvas() {
        var imageDataArray = this.getImageArray();
        this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        const canvasImageData = this.canvasContext.createImageData(RippleTank.GRID_WIDTH, RippleTank.GRID_HEIGHT);
        canvasImageData.data.set(imageDataArray);
        this.canvasContext.putImageData(canvasImageData, 0, 0);
        this.canvasContext.drawImage(this.canvasElement, 0, 0);
    }
    timeStep() {
        this.wasmModule.instance.exports.timeStep();
        this.copyMemoryToCanvas();
    }
    play() {
        if (!this.playing) {
            this.playing = true;
            this.timer = setInterval(this.timeStep.bind(this), 1000 / this.wasmModule.instance.exports.FRAMES_PER_SECOND.valueOf());
        }
    }
    stop() {
        this.playing = false;
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    disturbLine(x) {
        let amplitude = 5;
        let radius = 10.0;
        this.wasmModule.instance.exports.disturbLine(Math.round(x), radius, amplitude);
        if (RippleTank.DEBUG)
            this.copyMemoryToCanvas();
    }
    disturbBall(x, y) {
        let amplitude = 5;
        let radius = 10.0;
        this.wasmModule.instance.exports.disturbBall(Math.round(x), Math.round(y), radius, amplitude);
        if (RippleTank.DEBUG)
            this.copyMemoryToCanvas();
    }
    setPointOscillator(x, y) {
        this.wasmModule.instance.exports.setPointOscillator(Math.round(x), Math.round(y));
        if (RippleTank.DEBUG)
            this.copyMemoryToCanvas();
    }
    setLineOscillator(x) {
        this.wasmModule.instance.exports.setLineOscillator(x);
        if (RippleTank.DEBUG)
            this.copyMemoryToCanvas();
    }
    setLineAbsorber(x, y1, y2) {
        this.wasmModule.instance.exports.setLineAbsorber(Math.round(x), Math.round(y1), Math.round(y2));
        if (RippleTank.DEBUG)
            this.copyMemoryToCanvas();
    }
    setNrectangle(x, y, width, height, angle, nsquared) {
        this.wasmModule.instance.exports.setNrectangle(Math.round(x), Math.round(y), width, height, angle, nsquared);
        if (RippleTank.DEBUG)
            this.copyMemoryToCanvas();
    }
    resetAbsorbers() { this.wasmModule.instance.exports.resetAbsorbers(); }
    resetNSquared() { this.wasmModule.instance.exports.resetNSquared(); }
    setSpeed(value) { this.wasmModule.instance.exports.setSpeed(value); }
    setFriction(value) { this.wasmModule.instance.exports.setFriction(value); }
    setHardBoundary(value) { this.wasmModule.instance.exports.setHardBoundary(value); }
    setHighContrast(value) { this.wasmModule.instance.exports.setHighContrast(value); }
    setMaxAmplitude(value) { this.wasmModule.instance.exports.setMaxAmplitude(value); }
    setColour(value) { this.wasmModule.instance.exports.setColour(value); }
    getSpeed() { return this.wasmModule.instance.exports.SPEED.valueOf(); }
    getFriction() { return this.wasmModule.instance.exports.FRICTION.valueOf(); }
    getHardBoundary() { return this.wasmModule.instance.exports.HARD_BOUNDARY.valueOf(); }
    getHighContrast() { return this.wasmModule.instance.exports.HIGH_CONTRAST.valueOf(); }
    getMaxAmplitude() { return this.wasmModule.instance.exports.MAX_AMPLITUDE.valueOf(); }
    getColour() { return this.wasmModule.instance.exports.COLOUR.valueOf(); }
}
RippleTank.scaleFactor = 5;
RippleTank.DEBUG = true;
RippleTank.GRID_WIDTH = 80;
RippleTank.GRID_HEIGHT = 100;
RippleTank.LEFT_PADDING = 100;
RippleTank.RIGHT_PADDING = 100;
const SPAWN_X = 25;
var SPAWN_Y = 25;
const SPAWN_VERTICAL_SPACING = 50;
class Scene1 extends Phaser.Scene {
    constructor() {
        super({
            key: 'sceneA',
            active: true,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                }
            },
        });
        this.refractors = [];
        this.absorbers = [];
        this.updateFunctions = [];
        Scene1.instance = this;
    }
    preload() {
    }
    create() {
        this.tankRectangle = new Phaser.GameObjects.Rectangle(this, RippleTank.LEFT_PADDING + RippleTank.instance.imageWidth / 2, RippleTank.instance.imageHeight / 2, RippleTank.instance.imageWidth, RippleTank.instance.imageHeight).setStrokeStyle(1, 0x0);
        this.add.existing(this.tankRectangle);
        new Glass(this, SPAWN_X, SPAWN_Y);
        new PointOscillator(this, SPAWN_X, SPAWN_Y += SPAWN_VERTICAL_SPACING);
        new LineOscillator(this, SPAWN_X, SPAWN_Y += SPAWN_VERTICAL_SPACING);
        new Slit(this, SPAWN_X, SPAWN_Y += 2 * SPAWN_VERTICAL_SPACING);
        new DoubleSlit(this, SPAWN_X, SPAWN_Y += 2 * SPAWN_VERTICAL_SPACING);
    }
    update() {
        this.updateFunctions.forEach(f => f());
    }
    updateRefractors() {
        RippleTank.instance.resetNSquared();
        this.refractors.forEach(r => r.setPixels());
    }
    updateAbsorbers() {
        RippleTank.instance.resetAbsorbers();
        this.absorbers.forEach(r => r.setPixels());
    }
}
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function wasmBrowserInstantiate(wasmModuleUrl, importObject) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = undefined;
        if (!importObject) {
            importObject = {
                env: {
                    abort: () => console.log("Abort!")
                }
            };
        }
        if (WebAssembly.instantiateStreaming) {
            response = yield WebAssembly.instantiateStreaming(fetch(wasmModuleUrl), importObject);
        }
        else {
            const fetchAndInstantiateTask = () => __awaiter(this, void 0, void 0, function* () {
                const wasmArrayBuffer = yield fetch(wasmModuleUrl).then(response => response.arrayBuffer());
                return WebAssembly.instantiate(wasmArrayBuffer, importObject);
            });
            response = yield fetchAndInstantiateTask();
        }
        return response;
    });
}
;
//# sourceMappingURL=ripple.js.map