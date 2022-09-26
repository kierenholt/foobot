
class Grid  {
    widthInSquares: number;
    heightInSquares: number;

    scene: SceneBase;
    floors: Phaser.GameObjects.Group;
    robot: Robot;
    busy: boolean;

    food: Phaser.GameObjects.Group;
    boxes: Phaser.GameObjects.Group;
    numbers: Phaser.GameObjects.Group;

    leftX: number;
    topY: number;

    configGrid: ConfigGrid;

    constructor(scene: SceneBase,
        originX,
        originY,
        configGrid: ConfigGrid) {
        this.scene = scene;

        this.leftX = originX;
        this.topY = originY;
    
        this.floors = scene.physics.add.staticGroup();
        this.food = scene.physics.add.group();
        this.boxes = scene.physics.add.group();
        this.numbers = scene.physics.add.group();

        this.configGrid = configGrid;
        this.reset(configGrid);
      }

    reset(configGrid: ConfigGrid) {

        this.widthInSquares = configGrid.width;
        this.heightInSquares = configGrid.height

        //remove old sprites
        this.floors.clear(true, true);
        this.food.clear(true, true);
        this.boxes.clear(true, true);
        this.numbers.clear(true,true);

        if (this.robot) {
            this.robot.destroy();
            this.robot = null;
        }

        //floor
        for (let j = 0; j < configGrid.height; j++) {
            for (let i = 0; i < configGrid.width; i++) {
                let coords = this.getXYfromMapCoords([i,j]);
                this.floors.add(new Floor(this,this.scene,coords[0],coords[1]));
            }
        }
        this.floors.setDepth(-100);

        //objects
        for (let object of configGrid.objects) {
            let coords = this.getXYfromMapCoords(object.mapCoords);
            if (object.typeNumber == 0) {
                this.robot = new Robot(this, this.scene,coords[0],coords[1],object);

                this.robot.lookingIndex = 0;
                if (this.robot.carryingFruit) this.robot.carryingFruit.destroy();
                this.robot.isScoopDown = true;
            }
            else if (object.typeNumber >= 1 && object.typeNumber <= 4) {
                let newFood = new Food(this, this.scene,coords[0],coords[1], object.typeNumber, object);
                newFood.notYetInGrid = false;
                this.food.add(newFood);
            }
            else if (object.typeNumber >= 5 && object.typeNumber <= 12) {
                let newBox = new Box(this, this.scene,coords[0],coords[1], object.typeNumber, object);
                newBox.notYetInGrid = false;
                this.boxes.add(newBox);
            }
            else {
                throw("bad typenumber");
            }
        }

        this.refreshFruitCounts();
    }

    refreshFruitCounts() {
        this.numbers.clear(true,true);
        //numbers - group objects first
        let groupedByCoords = {};
        for (let food of (this.food.getChildren() as Food[])) {
            let key = this.getUniqueKeyFromXY(food);
            if (key in groupedByCoords) {
                groupedByCoords[key].push(food);
            }
            else {
                groupedByCoords[key] = [food];
            }
        }
        for (let key in groupedByCoords) {
            if (groupedByCoords[key].length > 1) {
                let x = groupedByCoords[key][0].x + 16;
                let y = groupedByCoords[key][0].y + 14;
                
                let newText =  this.scene.add.text(x, y, groupedByCoords[key].length, {
                    fill:"#000",
                    fontSize:"14px",
                    fontFamily:"Arial Black"
                  });
                this.numbers.add(newText);
            }
        }
    }

    getConfigGrid(): ConfigGrid {
        let objects = [];
        let constraints = [];
        //food
        for (let fruit of this.food.getChildren() as Food[]) {
            objects.push(new ConfigObject(fruit.mapCoords,fruit.typeNumber));
        }
        //boxes
        for (let box of this.boxes.getChildren() as Box[]) {
            objects.push(new ConfigObject(box.mapCoords,box.typeNumber));
        }
        //robot
        if (this.robot) objects.push(new ConfigObject(this.robot.mapCoords,0));

        return new ConfigGrid(this.widthInSquares,this.heightInSquares,objects);
    }

    containsMapCoords(i,j) {
        return i >= 0 && i < this.widthInSquares && j >= 0 && j < this.heightInSquares;
    }

    containsXY(x,y) {
        return x >= this.leftX && x < this.rightX && y >= this.topY && y < this.bottomY;
    }

    snapToTileCentres(x,y) {
        let mapCoords = this.getMapCoordsFromXY(x,y);
        if (mapCoords) return this.getXYfromMapCoords(mapCoords);
        return null;
    }

    getUniqueKeyFromXY(item: Phaser.GameObjects.Sprite): number {
        let mapCoords = this.getMapCoordsFromXY(item.x,item.y);
        return mapCoords[0]*8 + mapCoords[1];
    }

    getMapCoordsFromXY(x,y) {
        let i = Math.floor((x - this.leftX ) / TILE_SIZE);
        let j = Math.floor((y - this.topY ) / TILE_SIZE);
        if (this.containsMapCoords(i,j)) return [i,j];
        return null;
    }

    getXYfromMapCoords(mapCoords) {
        let x = mapCoords[0]*TILE_SIZE + TILE_SIZE/2 + this.leftX;
        let y = mapCoords[1]*TILE_SIZE + TILE_SIZE/2 + this.topY;
        if (this.containsXY(x,y)) return [x,y];
        return null;
    }

    getFoodOrBoxAtXY(x,y) {
      for (let fruit of (this.food.getChildren() as Food[])) {
        if (fruit.x==x && fruit.y==y) {
          return fruit;
        }
      };
      for (let box of (this.boxes.getChildren() as Box[])) {
        if (box.x==x && box.y==y) {
          return box;
        }
      };
      return null;
    }

    get bottomY() { return this.topY + this.heightInSquares*TILE_SIZE; }
    get rightX() { return this.leftX + this.widthInSquares*TILE_SIZE; }

    /***
     * @returns boolean whether placement was successful 
     */
    allowsItemToBePlaced(item, destX, destY): boolean { //takes mapcoords because dropping fruit does not use correct xy

        //if food exists at the same location, destroy it
        let foodOrBoxAlreadyThere = this.getFoodOrBoxAtXY(destX,destY);
        if (foodOrBoxAlreadyThere) {
            //it might be the same type box as the fruit
            if (item instanceof Food && foodOrBoxAlreadyThere.foodType == item.foodType) {
                return true;
            }
            return false;
        }

        //if robot exists at the same location
        if (this.robot.x == destX && this.robot.y == destY) {
            return false;
        }

        return true;
    }

    checkWinCondition() {
        return (this.food.getLength() == 0 && this.robot.carryingFruit == null);
    }

    placeItem(item, destX, destY) {
        let destItem =  this.getFoodOrBoxAtXY(destX,destY);
        if (destItem instanceof Box && item instanceof Food) {
            destItem.acceptFruit(item); //destroys this
        }
        else {
            item.grid = this;
            item.x = destX;
            item.y = destY;
            item.notYetInGrid = false;
            this.getGroup(item).add(item);
        }
        this.refreshFruitCounts();

    }

    getGroup(item): Phaser.GameObjects.Group {
        if (item instanceof Food) return this.food;
        if (item instanceof Box) return this.boxes;
        if (item instanceof Floor) return this.floors;
    }


    removeItem(item: GridSprite) {
        let group = this.getGroup(item);
        if (group) group.remove(item);
        this.refreshFruitCounts();
    }

    destroy() {
        this.food.clear(true,true);
        this.boxes.clear(true,true);
        if (this.robot) this.robot.destroy();
        this.floors.clear(true,true);
        this.numbers.clear(true,true);
    }
}