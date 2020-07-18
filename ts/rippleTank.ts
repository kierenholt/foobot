class RippleTank {
    wasmModule: any;
    canvasElement: any;
    canvasContext: any;
    timer: number;
    static scaleFactor = 5;
    playing: boolean = false;
    static instance: RippleTank;
    static DEBUG = false;
    static GRID_WIDTH = 80;
    static GRID_HEIGHT = 100;

    static LEFT_PADDING = 100;
    static RIGHT_PADDING = 100;

    constructor(canvasElement, wasmModule) {
        //https://wasmbyexample.dev/examples/reading-and-writing-graphics/reading-and-writing-graphics.assemblyscript.en-us.html
        // Instantiate our wasm module
        RippleTank.instance = this;
        this.wasmModule = wasmModule;
        this.canvasElement = canvasElement;

        RippleTank.GRID_WIDTH = Math.floor(window.innerWidth - RippleTank.LEFT_PADDING - RippleTank.RIGHT_PADDING)/RippleTank.scaleFactor;
        RippleTank.GRID_HEIGHT = Math.floor(window.innerHeight/RippleTank.scaleFactor);

        this.wasmModule.instance.exports.init(RippleTank.GRID_WIDTH, RippleTank.GRID_HEIGHT);

        this.canvasElement.width = RippleTank.scaleFactor * RippleTank.GRID_WIDTH;
        this.canvasElement.height = RippleTank.scaleFactor * RippleTank.GRID_HEIGHT;

        this.canvasContext = canvasElement.getContext("2d");
        this.canvasContext.scale(RippleTank.scaleFactor, RippleTank.scaleFactor);
        if (!RippleTank.DEBUG) this.play();
    }

    get imageWidth():number {return this.canvasElement.width}
    get imageHeight():number {return this.canvasElement.height}

    getImageArray() {
        let memory = this.wasmModule.instance.exports.memory;
        const wasmByteMemoryArray = new Uint8Array(memory.buffer);
        let start = this.wasmModule.instance.exports.RIPPLE_IMAGE_MEM_START.valueOf();
        return wasmByteMemoryArray.slice(
            start,
            start + this.wasmModule.instance.exports.RIPPLE_IMAGE_MEM_SIZE.valueOf()
        );
    }

    copyMemoryToCanvas() {
        var imageDataArray = this.getImageArray();
        //console.log(imageDataArray);

        // Clear the canvas
        this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        const canvasImageData = this.canvasContext.createImageData(
            RippleTank.GRID_WIDTH,
            RippleTank.GRID_HEIGHT
        );

        canvasImageData.data.set(imageDataArray);
        this.canvasContext.putImageData(canvasImageData, 0, 0);

        this.canvasContext.drawImage(this.canvasElement, 0, 0);

        // Set the result onto the body
        //document.body.textContent = `Hello World! addResult: ${addResult}`;
    }

    timeStep() {
        //this.randomPulse();
        this.wasmModule.instance.exports.timeStep();
        this.copyMemoryToCanvas();
    }

    play() {
        if (!this.playing) {
            this.playing = true;
            this.timer = setInterval(
                this.timeStep.bind(this), 
                1000 / this.wasmModule.instance.exports.FRAMES_PER_SECOND.valueOf());
        }
    }

    stop() {
        this.playing = false;
        if (this.timer) { clearInterval(this.timer); }
    }


//DISTURB
    disturbLine(x) {
        let amplitude = 5;
        let radius = 10.0;
        this.wasmModule.instance.exports.disturbLine(Math.round(x), radius, amplitude); 
        //DEBUG ONLY 
        if (RippleTank.DEBUG) this.copyMemoryToCanvas();
    }

    disturbBall(x, y) {
        let amplitude = 5;
        let radius = 10.0;
        this.wasmModule.instance.exports.disturbBall(Math.round(x), Math.round(y), radius, amplitude);
        //DEBUG ONLY 
        if (RippleTank.DEBUG) this.copyMemoryToCanvas();
    }

//OSCILLATOR
    setPointOscillator(x, y) {
        this.wasmModule.instance.exports.setPointOscillator(Math.round(x), Math.round(y));
        //DEBUG ONLY 
        if (RippleTank.DEBUG) this.copyMemoryToCanvas();
    }

    setLineOscillator(x) {
        this.wasmModule.instance.exports.setLineOscillator(x);
        //DEBUG ONLY 
        if (RippleTank.DEBUG) this.copyMemoryToCanvas();
    }

//ABSORBER
    setLineAbsorber(x, y1, y2) {
        this.wasmModule.instance.exports.setLineAbsorber(Math.round(x),Math.round(y1),Math.round(y2));
        //DEBUG ONLY 
        if (RippleTank.DEBUG) this.copyMemoryToCanvas();
    }

//REFRACTOR
    setNrectangle(x, y, width, height, angle, nsquared) {
        this.wasmModule.instance.exports.setNrectangle(Math.round(x), Math.round(y), 
            width, height, angle, nsquared);
        //DEBUG ONLY 
        if (RippleTank.DEBUG) this.copyMemoryToCanvas();
    }

//RESET
    resetAbsorbers() { this.wasmModule.instance.exports.resetAbsorbers(); }
    resetNSquared() { this.wasmModule.instance.exports.resetNSquared(); }

//SETTINGS
    setFrequency(value) {
        if (value > 10) {value = 10;} 
        this.wasmModule.instance.exports.setFrequency(value); 
    }
    setSpeed(value) { this.wasmModule.instance.exports.setSpeed(value); }
    setFriction(value) { this.wasmModule.instance.exports.setFriction(value); }
    setHardBoundary(value) { this.wasmModule.instance.exports.setHardBoundary(value); }
    setHighContrast(value) { this.wasmModule.instance.exports.setHighContrast(value); }
    setMaxAmplitude(value) { this.wasmModule.instance.exports.setMaxAmplitude(value); }
    setColour(value) { this.wasmModule.instance.exports.setColour(value); }
    getSpeed() { return this.wasmModule.instance.exports.SPEED.valueOf(); }
    getFrequency() { return this.wasmModule.instance.exports.FREQUENCY.valueOf(); }
    getFriction() { return this.wasmModule.instance.exports.FRICTION.valueOf(); }
    getHardBoundary() { return this.wasmModule.instance.exports.HARD_BOUNDARY.valueOf(); }
    getHighContrast() { return this.wasmModule.instance.exports.HIGH_CONTRAST.valueOf(); }
    getMaxAmplitude() { return this.wasmModule.instance.exports.MAX_AMPLITUDE.valueOf(); }
    getColour() { return this.wasmModule.instance.exports.COLOUR.valueOf(); }

}