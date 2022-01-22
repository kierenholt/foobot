
const floorMapTextureCodes = ["sprite1","sprite2","sprite3","sprite4"];

//floor = -1
const mapTextureCodes = [
  "robot" ,//= 0
  
  "apple" ,//= 1
  "banana" ,//= 2
  "cherry" ,//= 3
  "dragonBallOrange" ,//= 4

  "appleBox" ,//= 5
  "bananaBox" ,//= 6
  "cherryBox" ,//= 7
  "dragonballBox" ,//= 8

  "appleBox-tick" ,//= 9
  "bananaBox-tick" ,//= 10
  "cherryBox-tick" ,//= 11
  "dragonballBox-tick" ,//= 12
  
  "spikes" //= 9
];

class GridSprite extends Phaser.GameObjects.Sprite {
    typeNumber: number;
    scene: SceneBase;
    grid: Grid;

    constructor(grid,scene,x,y,typeNumber,texture,frame?) {
        if (frame) {
            super(scene,x,y,texture,frame);
        }
        else {
            super(scene,x,y,texture);
        }
        scene.add.existing(this);
        this.typeNumber = typeNumber; 
        this.scene = scene;
        this.grid = grid;        
    }
 
    get mapCoords() {
        if (!this.grid) throw "no grid";
        return this.grid.getMapCoordsFromXY(this.x,this.y);
    }
}

class Floor extends GridSprite  {
    constructor(grid,scene,x,y) {
        super(grid,scene,x,y,-1,"floor",helpers.getRandomItem(floorMapTextureCodes));
    }
}

abstract class DraggableGridSprite extends GridSprite {
    isDragging: boolean;
    notYetInGrid: boolean;

    constructor(grid,scene,x,y,typeNumber,texture,frame?) {
        super(grid,scene,x,y,typeNumber,texture,frame);

        if (SceneBase.builderMode) {
            this.isDragging = false;
            this.notYetInGrid = true;
            this.scene.input.setDraggable(this.setInteractive());

            this.on('drag', this.onDrag);
            this.on('dragend',this.dragEnd);
        }
    }

    onDrag(pointer, dragX, dragY) {

        if (!this.isDragging) {
            this.isDragging = true;
            if (this.notYetInGrid) {
                this.scene.add.existing(this.clone());
            }
            //remove from grid, if within one
            if (this.grid && this.mapCoords) {
                this.getGridGroup().remove(this);
                (SceneBase.instance as SceneBuilder).removeObjectFromGridConfig(this.grid,this.mapCoords);
                this.grid = null;
                (SceneBase.instance as SceneBuilder).updateCurrentConfigFromSprites();
            }
            //reset grids
            SceneBase.instance.resetButtonAction();
        }
        this.x = dragX;
        this.y = dragY;
    }

    dragEnd(pointer) {

        if (!this.isDragging) { return; }
        this.isDragging = false;
                
        let grid = SceneBase.instance.getContainingGrid(this.x,this.y);
        if (grid) {
            this.grid = grid as Grid;
            let [destX,destY] = this.grid.snapToTileCentres(this.x,this.y);
            let getsPlaced = this.grid.allowsItemToBePlaced(this,destX,destY);
            if (getsPlaced) {

                let box =  this.grid.getFoodOrBoxAtXY(destX,destY) as Box;
                if (box && this instanceof Food) {
                    box.acceptFruit(this); //destroys this
                }
                else {
                    this.x = destX;
                    this.y = destY;
                    this.notYetInGrid = false;
                    this.getGridGroup().add(this);    
                }
                (SceneBase.instance as SceneBuilder).updateCurrentConfigFromSprites();    
            }
            else {
                this.destroy();
            }
        }
        else {
            //if dropped outside of a grid then destroy
            this.destroy();
        }
    }

    abstract getGridGroup(): Phaser.GameObjects.Group
    abstract clone();
}

class Food extends DraggableGridSprite  {

    constructor(grid,scene,x,y,typeNumber) {
        super(grid,scene,x,y,typeNumber,"food",mapTextureCodes[typeNumber]);
        this.setScale(FOOD_SCALE);

    }

    get letterForPeek() {
        return ["a","b","c","d"][this.typeNumber-1];
    }

    clone() { return new Food(null,this.scene,this.x,this.y,this.typeNumber); } 
    getGridGroup() { return this.grid.food; }

    destroy() {
        if (this.grid) this.getGridGroup().remove(this);
        super.destroy();
    }
}


class Box extends DraggableGridSprite  {
    _containsFruit: boolean;

    constructor(grid,scene,x,y,typeNumber) {
        super(grid,scene,x,y,typeNumber,"boxes",mapTextureCodes[typeNumber]);
        this._containsFruit = (typeNumber > 8);
        //this.setScale(FOOD_SCALE);
    }

    get letterForPeek() {
        return ["A","B","C","D"][this.typeNumber-5];
    }

    clone() { return new Box(null,this.scene,this.x,this.y,this.typeNumber); } 
    getGridGroup() { return this.grid.boxes; }

    destroy() {
        super.destroy();
        if (this.grid) helpers.removeFromArray(this.grid.boxes,this);
    }

    matchesFoodType(food: Food) {
        return food.typeNumber == this.typeNumber - 4;
    }

    acceptFruit(item: Food) {
        if (!this.matchesFoodType(item)) throw("does not match food type");
        item.destroy();
        this.containsFruit = true;
    }

    set containsFruit(value: boolean) {
        if (this.containsFruit != value) {
            if (this._containsFruit) {
                this.typeNumber -= 4;
                this.setTexture("boxes",mapTextureCodes[this.typeNumber]);
            }
            else {
                this.typeNumber += 4;
                this.setTexture("boxes",mapTextureCodes[this.typeNumber]);
            }    
        }
        this._containsFruit = value;
    }

    get containsFruit() {
        return this._containsFruit;
    }
}