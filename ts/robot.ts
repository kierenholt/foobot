declare function newInterpreter(a: any, b: any): any; //also declared in acorn.js

const TILE_SIZE = 64;
const FOOD_SCALE = 0.75;

class Robot extends GridSprite {

  moving: boolean; //prevents further steps in code until animation is complete
  myInterpreter: any;
  onComplete: any;

  static ease = 'Cubic.easeInOut';
  static duration = 1000;
  static lookingX = [1, 0, -1, 0];
  static lookingY = [0, 1, 0, -1];
  static lookingBodyFrames = [["RightRaised", "DownRaised", "LeftRaised", "UpRaised"],
  ["RightLowered", "DownLowered", "LeftLowered", "UpLowered"]];
  static raiseAndLowerDistance = 32; //distance moved towards fruit before picking it up 
  static carryingHeight = 32; //distance moved towards fruit before picking it up 

  _lookingIndex: number = 0; //0 = right, 1 = down, 2 = left, 3 = up //getter and setter
  isScoopDown: boolean = true;
  carryingFruit: Food;

  body: Phaser.GameObjects.Sprite;
  codeInput: HTMLTextAreaElement;
  playButton: HTMLButtonElement;
  //getter and setter for carrying sprite

  isDragging: boolean;

  constructor(grid, scene, x, y, configObject?) {
    super(grid, scene, x, y, 1, "body", "RightLowered", configObject);
    this.setDepth(10);

    this.typeNumber = 0;
    this.isDragging = false;
    this.scene.input.setDraggable(this.setInteractive());

    this.on('drag', this.onDrag.bind(this));
    this.on('dragend', this.dragEnd.bind(this));
  }

  ahead(onComplete, repeats) {
    if (this.lookingXY == null) {
      if (onComplete) onComplete();
      return;
    }
    let aheadTween = this.getAheadTween();
    if (repeats > 1 ) {
      aheadTween.on("complete",this.ahead.bind(this, onComplete, repeats - 1));
    }
    else {
      aheadTween.on("complete",onComplete);
    }
    aheadTween.play();
  }

  back(onComplete, repeats) {
    if (this.lookingBehindXY == null) {
      if (onComplete) onComplete();
      return;
    }
      let moveBackTween = this.getMoveBackTween();
      if (repeats > 1) {
        moveBackTween.on("complete",this.back.bind(this, onComplete, repeats - 1));
      }
      else {
        moveBackTween.on("complete",onComplete);
      }
      moveBackTween.play();
  }

  right(onComplete, repeats) {
    //play animation
    this.lookingIndex = (this.lookingIndex + 1) % 4;
    if (repeats > 1) {
      setTimeout(this.right.bind(this, onComplete, repeats - 1), Robot.duration / 2);
    }
    else {
      setTimeout(onComplete, Robot.duration / 2);
    }
  }

  left(onComplete, repeats) {
    //play animation
    this.lookingIndex = (this.lookingIndex + 3) % 4;
    if (repeats > 1) {
      setTimeout(this.left.bind(this, onComplete, repeats - 1), Robot.duration / 2);
    }
    else {
      setTimeout(onComplete, Robot.duration / 2);
    }
  }


  peek(onComplete) {
    //play animation
    let fruit = this.lookingFruitNotBox;
    setTimeout(onComplete, Robot.duration / 2);
    if (fruit) return fruit.letterForPeek;
    return null;
  }



  raise(onComplete) {
    if (!this.isScoopDown) {
      if (onComplete) onComplete();
      return;
    }

    let liftScoopInjector = function (paramOnCompleteTween, robot: Robot, fruit: Food) {
      var paramOnCompleteTween = paramOnCompleteTween;
      var robot = robot;
      //lift scoop
      return () => {
        robot.isScoopDown = false;
        robot.setFrame(Robot.lookingBodyFrames[robot.isScoopDown ? 1 : 0][robot.lookingIndex]);
        if (fruit) {
          robot.grid.removeItem(fruit);
          fruit.setPosition(robot.x, robot.y-Robot.carryingHeight);
        }
        if (paramOnCompleteTween) paramOnCompleteTween.play();
      } 
    };

    let moveTowardsTween = this.getMoveTowardsFruitTween();
    if (this.lookingFruitNotBox && this.carryingFruit == null) { 
      this.carryingFruit = this.lookingFruitNotBox; 
    };
    let moveAwayTween = this.getMoveAwayFomFruitTween();
    if (onComplete) moveAwayTween.on("complete", onComplete);
    moveTowardsTween.on("complete", 
    liftScoopInjector(moveAwayTween, 
      this, 
      this.carryingFruit));
    moveTowardsTween.play();
  }

  lower(onComplete) {
    if (this.isScoopDown) {
      if (onComplete) onComplete();
      return;
    }

    let lowerScoopInjector = function (paramOnCompleteTween, 
        robot: Robot, 
        fruit: Food, 
        coords, 
        paramCanDrop: boolean) {
      var paramOnCompleteTween = paramOnCompleteTween;
      var robot = robot;
      let dropCoords = coords;
      var canDrop = paramCanDrop;
      //drop scoop
      return () => {
        if (fruit) {
          if (canDrop) {
            //lower it
            robot.grid.placeItem(fruit,dropCoords[0],dropCoords[1]);
            
            robot.isScoopDown = true;
            robot.setFrame(Robot.lookingBodyFrames[robot.isScoopDown ? 1 : 0][robot.lookingIndex]);   
            }
          else {
            //robot not allowed to drop scoop!
          }
        }
        else {
          robot.isScoopDown = true;
          robot.setFrame(Robot.lookingBodyFrames[robot.isScoopDown ? 1 : 0][robot.lookingIndex]);   
        }
        if (paramOnCompleteTween) paramOnCompleteTween.play();
      }
    };

    let dropCoords = this.lookingXY;
    let canDrop = (dropCoords != null)  && (this.carryingFruit != null) && this.grid.allowsItemToBePlaced(this.carryingFruit, dropCoords[0], dropCoords[1]);
    let moveTowardsTween = this.getMoveTowardsFruitTween();
    let droppedFruit = this.carryingFruit;
    if (canDrop) this.carryingFruit = null; //do not move this line or the tween will move the fruit.
    let moveAwayTween = this.getMoveAwayFomFruitTween();

    if (onComplete) moveAwayTween.on("complete", onComplete);
    moveTowardsTween.on("complete", lowerScoopInjector(moveAwayTween, 
      this, 
      droppedFruit,
      dropCoords,
      canDrop));
    moveTowardsTween.play();
  }

  get lookingIndex():number { return this._lookingIndex;   }
  set lookingIndex(value) { 
    this._lookingIndex = value;
    this.setFrame(Robot.lookingBodyFrames[this.isScoopDown ? 1 : 0][value]); 
  }
  /*
  get lookingMapCoordsBehind() {
    let [i, j] = this.mapCoords;
    return [i + Robot.lookingX[(this.lookingIndex + 2) % 4], j + Robot.lookingY[(this.lookingIndex + 2) % 4]];
  }*/
  get lookingBehindXY() {
    let lookingX = this.x + Robot.lookingX[(this.lookingIndex + 2) % 4] * TILE_SIZE;
    let lookingY = this.y + Robot.lookingY[(this.lookingIndex + 2) % 4] * TILE_SIZE;
    if (this.grid.containsXY(lookingX, lookingY)) return [lookingX, lookingY];
    return null;
  }
  get lookingXY() {
    let lookingX = this.x + Robot.lookingX[this.lookingIndex] * TILE_SIZE;
    let lookingY = this.y + Robot.lookingY[this.lookingIndex] * TILE_SIZE;
    if (this.grid.containsXY(lookingX, lookingY)) return this.grid.snapToTileCentres(lookingX, lookingY);
    return null;
  }
  get isLookingRight() { return this.lookingIndex == 0 }
  get isSideView() { return this.lookingIndex == 0 || this.lookingIndex == 2 }
  get isLookingDown() { return this.lookingIndex == 1 }

  get lookingFruitNotBox(): Food {
    let lookingCoords = this.lookingXY;
    let found = this.grid.getFoodOrBoxAtXY(lookingCoords[0], lookingCoords[1]);
    if (found instanceof Food) return found;
    return null;
  }

  getMoveTowardsFruitTween():Phaser.Tweens.Tween { return this.scene.tweens.create(
    {
      targets: this.carryingFruit ? [this,this.carryingFruit] : this,
      x: "+= " + (this.isSideView ? Robot.lookingX[this.lookingIndex] * Robot.raiseAndLowerDistance : 0),
      y: "+= " + (this.isSideView ? 0 : Robot.lookingY[this.lookingIndex] * Robot.raiseAndLowerDistance),
      duration: Robot.duration / 2, ease: Robot.ease, repeat: 0, yoyo: false, paused: false
    });
  }

  getMoveAwayFomFruitTween():Phaser.Tweens.Tween { return this.scene.tweens.create({
      targets: this.carryingFruit ? [this,this.carryingFruit] : this,
      x: "-= " + (this.isSideView ? Robot.lookingX[this.lookingIndex] * Robot.raiseAndLowerDistance : 0) ,
      y: "-= " + (this.isSideView ? 0 : Robot.lookingY[this.lookingIndex] * Robot.raiseAndLowerDistance),
      duration: Robot.duration / 2, ease: Robot.ease, repeat: 0, yoyo: false, paused: false
    });
  }

  getMoveBackTween():Phaser.Tweens.Tween { return this.scene.tweens.create({
      targets: this.carryingFruit ? [this,this.carryingFruit] : this,
      x: "-= " + Robot.lookingX[this.lookingIndex] * TILE_SIZE,
      y: "-= " + Robot.lookingY[this.lookingIndex] * TILE_SIZE,
      duration: Robot.duration, ease: Robot.ease, repeat: 0, yoyo: false, paused: false
    });
  }

  getAheadTween():Phaser.Tweens.Tween  { return this.scene.tweens.create({
      targets: this.carryingFruit ? [this,this.carryingFruit] : this,
      x: "+= " + Robot.lookingX[this.lookingIndex] * TILE_SIZE,
      y: "+= " + Robot.lookingY[this.lookingIndex] * TILE_SIZE,
      duration: Robot.duration, ease: Robot.ease, repeat: 0, yoyo: false, paused: false 
    });
  }

  runCode(myCode, onComplete) {
    var robot = this;
    var initFunc = (interpreter, globalObject) => {

      var aheadWrapper = function (repeats) {
        robot.moving = true;
        robot.ahead(() => { robot.moving = false; robot.nextStep(); }, repeats);
      };
      interpreter.setProperty(globalObject, 'ahead', interpreter.createNativeFunction(aheadWrapper));

      var backWrapper = function (repeats) {
        robot.moving = true;
        robot.back(() => { robot.moving = false; robot.nextStep(); }, repeats);
      };
      interpreter.setProperty(globalObject, 'back', interpreter.createNativeFunction(backWrapper));

      var rightWrapper = function (repeats) {
        robot.moving = true;
        robot.right(() => { robot.moving = false; robot.nextStep(); }, repeats);
      };
      interpreter.setProperty(globalObject, 'right', interpreter.createNativeFunction(rightWrapper));

      var leftWrapper = function (repeats) {
        robot.moving = true;
        robot.left(() => { robot.moving = false; robot.nextStep(); }, repeats);
      };
      interpreter.setProperty(globalObject, 'left', interpreter.createNativeFunction(leftWrapper));

      var raiseWrapper = function () {
        robot.moving = true;
        robot.raise(() => { robot.moving = false; robot.nextStep(); });
      };
      interpreter.setProperty(globalObject, 'raise', interpreter.createNativeFunction(raiseWrapper));

      var lowerWrapper = function () {
        robot.moving = true;
        robot.lower(() => { robot.moving = false; robot.nextStep(); });
      };
      interpreter.setProperty(globalObject, 'lower', interpreter.createNativeFunction(lowerWrapper));

      var peekWrapper = function () {
        robot.moving = true;
        return robot.peek(() => { robot.moving = false; robot.nextStep(); });
      };
      interpreter.setProperty(globalObject, 'peek', interpreter.createNativeFunction(peekWrapper));

      var logWrapper = function (str) {
        console.log(str);
      };
      interpreter.setProperty(globalObject, 'log', interpreter.createNativeFunction(logWrapper));

    };
    this.myInterpreter = newInterpreter(myCode, initFunc);
    this.onComplete = onComplete;

    setTimeout(this.nextStep.bind(this), Robot.duration / 2);
  }

  nextStep() {
    while (!this.moving && this.myInterpreter.step()) {
      //nothing between non moving steps
    };
    if (!this.moving && this.onComplete) {
      this.onComplete(this);
    }
  }

  /*rollWheels(isForwards: boolean) {
    this.scene.tweens.add({
      targets: this.sideViewableWheels,
      angle: {from: 0, to: isForwards ? 360 : -360},
      duration: Robot.duration, ease: Robot.ease, repeat: 0, yoyo: false, paused: false,
    });
  }*/

  onDrag(pointer, dragX, dragY) {
    let dummy = 0;
    if (!(this instanceof Robot)) return;
    if (this.isDragging == undefined) return;
    if (!this.isDragging) {
      this.isDragging = true;

      //remove from grid, if within one
      if (this.grid && this.mapCoords) {
        this.grid.robot = null; 
        if (this.configObject) this.grid.configGrid.removeObject(this.configObject); 
        this.configObject = null;
      }
      //reset grids
      SceneBase.instance.resetButtonAction();
    }
    //constrain to grid
    if (dragX < this.grid.leftX) dragX = this.grid.leftX+1;
    if (dragX > this.grid.rightX) dragX = this.grid.rightX-1;
    if (dragY < this.grid.topY) dragY = this.grid.topY+1;
    if (dragY > this.grid.bottomY) dragY = this.grid.bottomY-1;

    this.x = dragX;
    this.y = dragY;
  }

  dragEnd(pointer) {

    if (!(this instanceof Robot)) return;
    if (!this.isDragging) { return; }
    this.isDragging = false;

    let grid = SceneBase.instance.getContainingGrid(this.x, this.y);
    if (grid.topY == this.grid.topY) { //cannot be dragged to another grid
      let [x, y] = this.grid.snapToTileCentres(this.x,this.y);
      this.x = x;
      this.y = y;
  
      //if food exists at the same location, destroy it
      let food = this.grid.getFoodOrBoxAtXY(x, y);
      if (food) {
        food.destroy();
      }
  
      //its a brand new grid that has been made, but the same old robot
      this.grid = grid;
      this.grid.robot = this;
      this.configObject = this.createConfigObject(this.grid);
      this.grid.configGrid.addObject(this.configObject)
    }
  }

  destroy() {
    if (this.carryingFruit) this.carryingFruit.destroy();
    super.destroy();
  }
}

