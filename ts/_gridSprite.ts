
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

  "spikes" //

    //word-count-constraint 32
];

class GridSprite extends Phaser.GameObjects.Sprite {
    typeNumber: number;
    scene: SceneBase;
    grid: Grid;
    configObject: ConfigObject;

    constructor(grid,scene,x,y,typeNumber,texture,frame?,configObject?) {
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
        if (configObject) this.configObject = configObject;
    }
 
    get mapCoords() {
        if (!this.grid) throw "no grid";
        return this.grid.getMapCoordsFromXY(this.x,this.y);
    }

    destroy() {
        //if (this.grid) this.grid.removeItem(this); do not destroy the configobject
        super.destroy();
    }

    createConfigObject(grid: Grid) {
        let coords = grid.getMapCoordsFromXY(this.x,this.y);
        return new ConfigObject(coords,this.typeNumber);
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

    constructor(grid,scene,x,y,typeNumber,texture,frame?,configObject?) {
        super(grid,scene,x,y,typeNumber,texture,frame,configObject);

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
                this.grid.removeItem(this);
                if (this.configObject) this.grid.configGrid.removeObject(this.configObject);
                this.grid = null;
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
                grid.placeItem(this, destX,destY);
                this.configObject = this.createConfigObject(grid);
                this.grid.configGrid.addObject(this.configObject);
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

    abstract clone();
}

class Food extends DraggableGridSprite  {

    constructor(grid,scene,x,y,typeNumber,configObject?) {
        super(grid,scene,x,y,typeNumber,"food",mapTextureCodes[typeNumber],configObject);
        this.setScale(FOOD_SCALE);

    }

    get letterForPeek() {
        return ["a","b","c","d"][this.typeNumber-1];
    }

    clone() { return new Food(null,this.scene,this.x,this.y,this.typeNumber); } 

    get foodType() {
        return this.typeNumber;
    }
}


class Box extends DraggableGridSprite  {
    _containsFruit: boolean;

    constructor(grid,scene,x,y,typeNumber,configObject?) {
        super(grid,scene,x,y,typeNumber,"boxes",mapTextureCodes[typeNumber],configObject);
        this._containsFruit = (typeNumber > 8);
        //this.setScale(FOOD_SCALE);
    }

    get letterForPeek() {
        return ["A","B","C","D"][this.typeNumber-5];
    }

    clone() { return new Box(null,this.scene,this.x,this.y,this.typeNumber); } 

    get foodType() {
        return this._containsFruit ? this.typeNumber - 8 : this.typeNumber - 4;
    }

    acceptFruit(item: Food) {
        if (this.foodType != item.foodType) throw("does not match food type");
        item.destroy();
        this.grid.removeItem(item);
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