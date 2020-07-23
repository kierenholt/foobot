// The entry file of your WebAssembly module.
export var RIPPLE_IMAGE_PIXEL_WIDTH: i32 = 20;
export var RIPPLE_IMAGE_PIXEL_HEIGHT: i32 = 100;
export var RIPPLE_IMAGE_NUM_PIXELS: i32 = RIPPLE_IMAGE_PIXEL_WIDTH * RIPPLE_IMAGE_PIXEL_HEIGHT;

//MEMORY SIZES
export var RIPPLE_IMAGE_MEM_SIZE: i32;
export var POSITION_MEM_SIZE: i32;
export var VELOCITY_MEM_SIZE: i32;
export var ABSORBERS_MEM_SIZE: i32;
export var N_SQUARED_MEM_SIZE: i32;

//MEMORY STARTS
export var RIPPLE_IMAGE_MEM_START: i32 = 0;
var currentPositionMemStart:i32;
var prevPositionMemStart:i32;
export var VELOCITY_MEM_START: i32;
export var ABSORBER_MEM_START: i32;
export var N_SQUARED_MEM_START: i32;

export function init(width: i32,height: i32, framesPerSecond: i32):void {

  FRAMES_PER_SECOND = framesPerSecond; 
  OMEGA2 = 4*3.14159*3.14159*FREQUENCY*FREQUENCY/<f32>FRAMES_PER_SECOND/<f32>FRAMES_PER_SECOND/<f32>TIMESTEPS_PER_FRAME/<f32>TIMESTEPS_PER_FRAME;

  RIPPLE_IMAGE_PIXEL_WIDTH = width;
  RIPPLE_IMAGE_PIXEL_HEIGHT = height;
  RIPPLE_IMAGE_NUM_PIXELS = RIPPLE_IMAGE_PIXEL_WIDTH * RIPPLE_IMAGE_PIXEL_HEIGHT;

  //MEMORY SIZES
  RIPPLE_IMAGE_MEM_SIZE = RIPPLE_IMAGE_NUM_PIXELS * 4; //4 x u8 per pixel
  POSITION_MEM_SIZE = RIPPLE_IMAGE_NUM_PIXELS * 4; //f32 per pixel
  VELOCITY_MEM_SIZE = RIPPLE_IMAGE_NUM_PIXELS * 4; //f32
  ABSORBERS_MEM_SIZE = RIPPLE_IMAGE_NUM_PIXELS*1; //i8
  N_SQUARED_MEM_SIZE = RIPPLE_IMAGE_NUM_PIXELS * 4; //f32

  //MEMORY STARTS
  RIPPLE_IMAGE_MEM_START = 0;
  currentPositionMemStart = RIPPLE_IMAGE_MEM_SIZE;
  prevPositionMemStart = RIPPLE_IMAGE_MEM_SIZE+POSITION_MEM_SIZE;
  VELOCITY_MEM_START = RIPPLE_IMAGE_MEM_SIZE + 2*POSITION_MEM_SIZE;
  ABSORBER_MEM_START = VELOCITY_MEM_START + VELOCITY_MEM_SIZE;
  N_SQUARED_MEM_START = ABSORBER_MEM_START + ABSORBERS_MEM_SIZE;

  //allocate enough memory
  var TOTAL_MEM:i32 = RIPPLE_IMAGE_MEM_SIZE + POSITION_MEM_SIZE*2 + VELOCITY_MEM_SIZE + ABSORBERS_MEM_SIZE + N_SQUARED_MEM_SIZE;
  if (TOTAL_MEM > 64000) {
    memory.grow(<i32>Math.floor(TOTAL_MEM/64000)); //1 = 64kB 
  }

  //write the bitmap
  store<u8>(0, 127);
  store<u8>(1, 127);
  store<u8>(2, 127);
  store<u8>(3, 255);
  memory.repeat(4, 0, 4, RIPPLE_IMAGE_NUM_PIXELS-1);

  //write the position grids*2, velocity grids, oscillator grids, n grid
  for (let j = 1; j < RIPPLE_IMAGE_PIXEL_HEIGHT - 1; j++) {
    for (let i = 1; i < RIPPLE_IMAGE_PIXEL_WIDTH - 1; i++) {
      setAbsorberType(i,j,0);
      setVelocity(i,j,0);
      setNSquared(i,j,1.0);
    }
  }
  setBlack();
}

//next time step
export function timeStep():void {
  for (let t = 0; t < TIMESTEPS_PER_FRAME; t++) {
    for (let j = 1; j < RIPPLE_IMAGE_PIXEL_HEIGHT - 1; j++) {
      for (let i = 1; i < RIPPLE_IMAGE_PIXEL_WIDTH - 1; i++) {
        
        let t:i8 = getAbsorberType(i,j);
        if (t != 0) {
          if (t == 5) updateOscillatorPosition(i,j); //in phase oscillator
          else updateAbsorberPosition(i,j,t); //other absorber type
        }
        else { //no absorber
          let left:f32 = getPrevPosition(i-1,j);
          let mid:f32 = getPrevPosition(i,j);
          let right:f32 = getPrevPosition(i+1,j);
          let top: f32 = getPrevPosition(i, j-1);
          let bottom: f32 = getPrevPosition(i, j+1);
          
          //set new values
          //dimensions
          //position:length, velocity: length/timestep, accn: length/timestep^2,
          //SPEED_SQUARED: 1/timestep^2, 

          let N_SQUARED:f32 = getNSquared(i,j);
          let acc:f32 = SPEED_SQUARED*(-4*mid + left + right + top + bottom)/N_SQUARED; 
          let newVelocity:f32 = getVelocity(i,j) + acc; 
          let newPosition:f32 = mid*(1-FRICTION) + newVelocity; 

          //save position and velocity
          setVelocity(i,j,newVelocity);
          setPosition(i,j,newPosition);
        }
      }
    }
    
    //FIXED END: set final position = 0;
    //FREE END: set final position = right;
    //OPEN END: set final position = right - rightVelocity(1,j)/SPEED
    //left hand side
    for (let j = 1; j < RIPPLE_IMAGE_PIXEL_HEIGHT-1; j++) {
      if (HARD_BOUNDARY == 0) setPosition(0,j,0);
      if (HARD_BOUNDARY == 1) setPosition(0,j,getPrevPosition(1,j));
      if (HARD_BOUNDARY == 2) setPosition(0,j,getPrevPosition(1,j) - getVelocity(1,j)/SPEED/NUMBER);
    } //right hand side
    for (let j = 1; j < RIPPLE_IMAGE_PIXEL_HEIGHT-1; j++) {
      if (HARD_BOUNDARY == 0) setPosition(RIPPLE_IMAGE_PIXEL_WIDTH-1,j,0);
      if (HARD_BOUNDARY == 1) setPosition(RIPPLE_IMAGE_PIXEL_WIDTH-1,j,getPrevPosition(RIPPLE_IMAGE_PIXEL_WIDTH-2,j));
      if (HARD_BOUNDARY == 2) setPosition(RIPPLE_IMAGE_PIXEL_WIDTH-1,j,getPrevPosition(RIPPLE_IMAGE_PIXEL_WIDTH-2,j) - getVelocity(RIPPLE_IMAGE_PIXEL_WIDTH-2,j)/SPEED/NUMBER);
    } //top
    for (let i = 1; i < RIPPLE_IMAGE_PIXEL_WIDTH-1; i++) {
      if (HARD_BOUNDARY == 0) setPosition(i,0,0);
      if (HARD_BOUNDARY == 1) setPosition(i,0,getPrevPosition(i,1));
      if (HARD_BOUNDARY == 2) setPosition(i,0,getPrevPosition(i,1) - getVelocity(i,1)/SPEED/NUMBER);
    } //bottom
    for (let i = 1; i < RIPPLE_IMAGE_PIXEL_WIDTH-1; i++) {
      if (HARD_BOUNDARY == 0) setPosition(i,RIPPLE_IMAGE_PIXEL_HEIGHT-1,0);
      if (HARD_BOUNDARY == 1) setPosition(i,RIPPLE_IMAGE_PIXEL_HEIGHT-1,getPrevPosition(i,RIPPLE_IMAGE_PIXEL_HEIGHT-2));
      if (HARD_BOUNDARY == 2) setPosition(i,RIPPLE_IMAGE_PIXEL_HEIGHT-1,getPrevPosition(i,RIPPLE_IMAGE_PIXEL_HEIGHT-2) - getVelocity(i,RIPPLE_IMAGE_PIXEL_HEIGHT-2)/SPEED/NUMBER);
    }
    oscillatorTimeStep();

    let temp = prevPositionMemStart;
    prevPositionMemStart = currentPositionMemStart;
    currentPositionMemStart = temp;
  } //end of loop over 10 timesteps
}


function setPosition(x:i32,y:i32,position:f32):void {
  store<f32>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + currentPositionMemStart, position); //store position
  writePositionToBitmap(x,y,position); //store bitmap
}
function setVelocity(x:i32,y:i32,velocity:f32):void {
  store<f32>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + VELOCITY_MEM_START, velocity); //store position
}
function getPrevPosition(x:i32,y:i32):f32 {
  return load<f32>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + prevPositionMemStart);
}
function getVelocity(x:i32,y:i32):f32 {
  return load<f32>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + VELOCITY_MEM_START);
}
function writePositionToBitmap(x:i32,y:i32,position:f32):void {
  let pixel:u8 = 127;
  if (HIGH_CONTRAST) {
    pixel = position > 0 ? <u8>(<i32>(sqrt(position/MAX_AMPLITUDE)*127) + 127) : <u8>(127 - <i32>(sqrt(-1*position/MAX_AMPLITUDE)*127)); //low contrast
  }
  else {
    pixel = <u8>(<i32>(position*127/MAX_AMPLITUDE) + 127); //low contrast
  }
  if (position > MAX_AMPLITUDE) {pixel = 255}
  if (position < -1*MAX_AMPLITUDE) {pixel = 0}
  
  //let pixel: u8 = <u8>(amplitude >= 0 ? <i32>sqrt(amplitude) + 127 : 127 - <i32>sqrt(-1*amplitude));
  if (COLOUR == 3) { //grey
    store<u8>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4,pixel);
    store<u8>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + 1,pixel);
    store<u8>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + 2,pixel);
  }
  else {
    store<u8>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + COLOUR,pixel);
  }
}

function setBlack():void {
  for (let i:i32 = 0; i < RIPPLE_IMAGE_PIXEL_WIDTH; i++) {
    for (let j:i32 = 0; j < RIPPLE_IMAGE_PIXEL_HEIGHT; j++) {
      store<u8>(i*4 + j*RIPPLE_IMAGE_PIXEL_WIDTH*4,0);
      store<u8>(i*4 + j*RIPPLE_IMAGE_PIXEL_WIDTH*4 + 1,0);
      store<u8>(i*4 + j*RIPPLE_IMAGE_PIXEL_WIDTH*4 + 2,0);
    }
  }
}


//DISTURB
function disturbPoint(x:i32,y:i32,position:f32):void {
  store<f32>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + currentPositionMemStart, position); //store position
  store<f32>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + prevPositionMemStart, position); //store position
  writePositionToBitmap(x,y,position); //store bitmap
}

export function disturbBall(x:i32, y:i32, r: i32, amplitude:f32): void {
  for (let j:i32 = max(y-1*r,0); j < min(y+r,RIPPLE_IMAGE_PIXEL_HEIGHT); j++) {
    for (let i:i32 = max(x-1*r,0); i < min(x+r,RIPPLE_IMAGE_PIXEL_WIDTH); i++) {
      let d2: f32 = <f32>((x-i)*(x-i) + (y-j)*(y-j));
      let r2: f32 = <f32>(r*r);
      if (d2 < r2) {
        let h: f32 = amplitude * ((r2-d2)/r2)*((r2-d2)/r2);
        disturbPoint(i,j,h);

        //setAmplitude(x,y,currentBitmapIndex,h);
      }
    }    
  }
}

export function disturbLine(x:i32, r: i32, amplitude:f32): void {
  for (let j:i32 = 1; j < RIPPLE_IMAGE_PIXEL_HEIGHT-1; j++) {
    for (let i:i32 = max(x-1*r,0); i < min(x+r,RIPPLE_IMAGE_PIXEL_WIDTH); i++) {
      let d2: f32 = <f32>((x-i)*(x-i));
      let r2: f32 = <f32>(r*r);
      let h: f32 = amplitude * ((r2-d2)/r2)*((r2-d2)/r2);
      disturbPoint(i,j,h);
    }
  }
}

//ABSORBERS AND REFLECTORS
    //0 no absorber
    //1 left side
    //2 top side
    //3 right side
    //4 bottom side
    //5 oscillator in phase
    //6 fixed to zero amplitude

export function setLineAbsorber(x:i32,y1:i32,y2:i32) : void {
  for (let j:i32 = max(y1,0); j <= min(y2,RIPPLE_IMAGE_PIXEL_HEIGHT-1); j++) {
    setAbsorberType(x-1,j,1);
    setAbsorberType(x,j,3);
  }
}


export function setLineReflector(x:i32,y:i32,angle: f32):void {
  let qx:f32 = <f32>Math.cos(angle * Math.PI / 180);
  let qy:f32 = <f32>Math.sin(angle * Math.PI / 180);
  for (let i:i32 = 0; i < RIPPLE_IMAGE_PIXEL_WIDTH; i++) {
    for (let j:i32 = 0; j < RIPPLE_IMAGE_PIXEL_HEIGHT; j++) {
      let widthDist:f32 = abs(<f32>(i-x)*qx + <f32>(j-y)*qy); //assume width = 1
      if (widthDist < 1) setAbsorberType(i,j,6);
    }
  }
}

function updateAbsorberPosition(x:i32, y:i32, t:i8):void {
  let pos:f32 = 0;
  if (t == 1) pos = getPrevPosition(x-1,y) - getVelocity(x-1,y)/SPEED/NUMBER;
  if (t == 2) pos = getPrevPosition(x,y-1) - getVelocity(x,y-1)/SPEED/NUMBER;
  if (t == 3) pos = getPrevPosition(x+1,y) - getVelocity(x+1,y)/SPEED/NUMBER;
  if (t == 4) pos = getPrevPosition(x,y+1) - getVelocity(x,y+1)/SPEED/NUMBER;
  if (t == 6) pos = 0;
  store<f32>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + currentPositionMemStart, pos); //store position
}
function getAbsorberType(x:i32,y:i32):i8 {
  return load<i8>(x + y*RIPPLE_IMAGE_PIXEL_WIDTH + ABSORBER_MEM_START);
}
function setAbsorberType(x:i32,y:i32,value:i8):void {
  if (x >= 0 && x< RIPPLE_IMAGE_PIXEL_WIDTH && y >= 0 && y < RIPPLE_IMAGE_PIXEL_HEIGHT) {
    store<i8>(x + y*RIPPLE_IMAGE_PIXEL_WIDTH + ABSORBER_MEM_START,value); //i8
  }
  //DEBUG - SETS GREEN COLOUR
  //green(x,y,value);
}


//DEBUG ONLY
function green(x:i32,y:i32,value:f32):void {
  if (value > 1) value = 1;
  if (value < 0) value = 0;
  store<u8>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4    ,0);
  store<u8>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + 1,<u8>floor(value*255.0) );
  store<u8>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + 2,0  );
}

//REFRACTORS
export function setNrectangle(x:i32,y:i32,width:f32,height:f32,angle:f32,nsquared:f32):void {
  let qx:f32 = <f32>Math.cos(angle * Math.PI / 180);
  let qy:f32 = <f32>Math.sin(angle * Math.PI / 180);
  for (let i:i32 = 0; i < RIPPLE_IMAGE_PIXEL_WIDTH; i++) {
    for (let j:i32 = 0; j < RIPPLE_IMAGE_PIXEL_HEIGHT; j++) {
      let nsq = nsquared-1;
      //width
      let widthDist:f32 = abs(<f32>(i-x)*qx + <f32>(j-y)*qy - 0.5*width);
      if (widthDist > width * 0.5 + 1) nsq = 0;
      else if (widthDist > width * 0.5) nsq *= (1 - (widthDist - width*0.5)); //fractional part 0 to 1
      //height 
      let heightDist:f32 = abs(<f32>(i-x)*qy - <f32>(j-y)*qx + 0.5*height);
      if (heightDist > height * 0.5 + 1) nsq = 0;
      else if (heightDist > height * 0.5) nsq *= (1 - (heightDist - height*0.5)); //fractional part
      
      let newValue = getNSquared(i,j)*(nsq+1);
      setNSquared(i,j,newValue);
      //DEBUG ONLY
      //green(i,j,newValue-1);
    }
  }
}

export function setConvexLens(x:i32,y:i32,width:f32,height:f32,nsquared:f32):void {
  let radius:f32 = (height*height + width*width)/(4*width);
  let leftX:f32 = <f32>x + width/2 - radius;
  let rightX:f32 = <f32>x - width/2 + radius;
  let Y:f32 = <f32>y;
  
  for (let i:i32 = 0; i < RIPPLE_IMAGE_PIXEL_WIDTH; i++) {
    for (let j:i32 = 0; j < RIPPLE_IMAGE_PIXEL_HEIGHT; j++) {
      let I:f32 = <f32>i;
      let J:f32 = <f32>j;
      let nsq = nsquared-1;
      let leftR:f32 = <f32>sqrt((leftX-I)*(leftX-I) + (Y-J)*(Y-J));
      if (leftR > radius + 1) nsq = 0;
      else if (leftR > radius) nsq *= (1 - (leftR - radius));
      
      let rightR:f32 = <f32>sqrt((rightX-I)*(rightX-I) + (Y-J)*(Y-J));
      if (rightR > radius + 1) nsq = 0;
      else if (rightR > radius) nsq *= (1 - (rightR - radius));

      let newValue = getNSquared(i,j)*(nsq+1);
      setNSquared(i,j,newValue);
      //DEBUG ONLY
      //green(i,j,newValue - 1);
      
    }
  }
}

export function setNSquared(x:i32,y:i32,value:f32):void {
  store<f32>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + N_SQUARED_MEM_START,value); //f32
}
function getNSquared(x:i32,y:i32):f32 {
  return load<f32>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + N_SQUARED_MEM_START);
}


//OSCILLATORS
var oscillatorAmplitude:f32 = 2; //1 to -1

var oscillatorV:f32 = 0;
function oscillatorTimeStep():void {
  oscillatorAmplitude  += oscillatorV;
  oscillatorV -= OMEGA2*oscillatorAmplitude;
}
export function setLineOscillator(x:i32) : void {
  for (let j:i32 = 0; j < RIPPLE_IMAGE_PIXEL_HEIGHT-1; j++) {
    setAbsorberType(x,j,5);
  }
}
export function setPointOscillator(x:i32, y:i32): void {setAbsorberType(x,y,5);}

function updateOscillatorPosition(x:i32, y:i32):void {
  store<f32>(x*4 + y*RIPPLE_IMAGE_PIXEL_WIDTH*4 + currentPositionMemStart, oscillatorAmplitude); //store position
}


//RESETS
export function resetAbsorbers():void {
  for (let j = 1; j < RIPPLE_IMAGE_PIXEL_HEIGHT - 1; j++) {
    for (let i = 1; i < RIPPLE_IMAGE_PIXEL_WIDTH - 1; i++) {
      setAbsorberType(i,j,0);
    }
  }  
}

export function resetNSquared():void {
  for (let j = 1; j < RIPPLE_IMAGE_PIXEL_HEIGHT - 1; j++) {
    for (let i = 1; i < RIPPLE_IMAGE_PIXEL_WIDTH - 1; i++) {
      setNSquared(i,j,1.0);
    }
  }  
}

//SETTINGS 
export const TIMESTEPS_PER_FRAME:i32 = 10;
export var FREQUENCY:f32 = 4;

export function setFrequency(value:f32):void { FREQUENCY = value; OMEGA2 = 4*3.14159*3.14159*FREQUENCY*FREQUENCY/<f32>FRAMES_PER_SECOND/<f32>FRAMES_PER_SECOND/<f32>TIMESTEPS_PER_FRAME/<f32>TIMESTEPS_PER_FRAME }
export function setSpeed(value:f32):void { SPEED = value; SPEED_SQUARED = value*value; }
export function setFriction(value:f32):void { FRICTION = value; }
export function setHardBoundary(value:i32):void { HARD_BOUNDARY = value; }
export function setHighContrast(value:bool):void { HIGH_CONTRAST = value; }
export function setMaxAmplitude(value:f32):void { MAX_AMPLITUDE = value; }
export function setColour(value:i8):void { COLOUR = value; setBlack(); }
export var SPEED:f32 = 0.2;
var SPEED_SQUARED:f32 = SPEED*SPEED; // do not go above 0.5
export var FRICTION:f32 = 0.01;
export var HARD_BOUNDARY:i32 = 2; //0 = FIXED, 1 = FREE, 2 = OPEN
export var HIGH_CONTRAST:bool = false;
export var MAX_AMPLITUDE:f32 = 1.0;
export var COLOUR:i8 = 2; //0 = red 1 = green 2 = blue, 3 = grey

var FRAMES_PER_SECOND: i32;
var NUMBER:f32 = 1.3525; //for speed = 0.2
var OMEGA2:f32;

    //1.2 inverted
    //1.3 inverted?
    //1.350 inverted?
    //1.355 uninverted?
    //1.36 uninverted
    //1.37 uninverted
    //1.38 uninverted 
    //1.4 uninverted