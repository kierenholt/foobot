
    const GRID_LEFT = 192;
    const GRID_TOP = 32;
    
class SceneBase extends Phaser.Scene {

    static instance: SceneBase;
    grids: Grid[] = [];
    gridIsCompletedByIndex: boolean[] = [];

    codeInput: HTMLTextAreaElement;
    playButton: HTMLImageElement;
    resetButton: HTMLImageElement;

    currentConfig: Config;
    static builderMode: boolean;

    constructor(
        codeInputId, 
        playButtonId, 
        resetButtonId) {
        super({
            key: 'sceneA',
            active: true,
            physics:
            {
                default: 'arcade',
                arcade:
                {
                    debug: false,
                }
            },
        });
        SceneBase.instance = this;
        this.codeInput = document.getElementById(codeInputId) as HTMLTextAreaElement;
        this.playButton = document.getElementById(playButtonId) as HTMLImageElement;
        this.resetButton = document.getElementById(resetButtonId) as HTMLImageElement;
        this.playButton.onclick = this.runCodeOnAllRobots.bind(this);
        this.resetButton.onclick = this.resetButtonAction.bind(this);

    }

    preload() {
        //let ret = this.load.image("bg", "assets/BG.png");
        this.load.atlas("body", "assets/foobotSpriteSheet.png", "assets/foobotSpriteSheet.json");
        this.load.atlas("food", "assets/foodSpriteSheet64.png", "assets/foodSpriteSheet64.json");
        this.load.atlas("boxes", "assets/boxSpritesheet.png", "assets/boxSpritesheet.json");
        this.load.atlas("floor", "assets/floorSpriteSheet.png", "assets/floorSpriteSheet.json");
    }

    create() {

    }

    get robots() {
        return this.grids.map(g => g.robot);
    }

    runCodeOnAllRobots() {
        this.resetButtonAction();
        let code = this.codeInput.value;
        for (let robot of this.robots) {
            robot.runCode(code,this.setRobotCompleted.bind(this));
        }
    }

    setRobotCompleted(robot) {
        let index = this.robots.indexOf(robot);
        this.gridIsCompletedByIndex[index] = true;
        if (this.gridIsCompletedByIndex.every(r => r)) {
            console.log("all complete");
            if (this instanceof SceneSolver) this.checkWinCondition();
        }
    }

    setAllRobotsIncomplete() {
        this.gridIsCompletedByIndex = this.robots.map(r => false);
    }


    /**
     * overwrites grid with current config
     */
    resetButtonAction() {;
        let x = GRID_LEFT;
        let y = GRID_TOP;
        this.grids.forEach(g => g.destroy());
        this.grids = [];
        for (let configGrid of this.currentConfig.configGrids) {
            let newGrid = new Grid(this,x,y,configGrid);
            this.grids.push(newGrid);
            x = newGrid.rightX + TILE_SIZE;
        }
        let lastGrid = this.grids[this.grids.length-1];
        this.scale.resize(lastGrid.rightX + 2*TILE_SIZE, 
            Math.max(lastGrid.bottomY + TILE_SIZE,GAME_HEIGHT));
    }

    /**
     * 
     * @param item 
     * @returns [grid,mapcoords]
     */
    getContainingGrid(x,y) {
        for (let grid of this.grids) {
            if (grid.containsXY(x,y)) return grid;
        }
        return null;
    }

    removeObjectFromGridConfig(grid,mapCoords) {
        let gridIndex = this.grids.indexOf(grid);
        this.currentConfig.configGrids[gridIndex].removeFood(mapCoords);
    }
}

class SceneBuilder extends SceneBase {
    levelMapAnchor: HTMLAnchorElement;
    setWidthSlider: HTMLInputElement;
    setHeightSlider: HTMLInputElement;
    setNumGridsSlider: HTMLInputElement;
    
    constructor(levelMapSpanId, 
        codeInputId, 
        playButtonId, 
        resetButtonId,
        setWidthSliderId,
        setHeightSliderId,
        setNumGridsId,
        mapAsString) {
        super(codeInputId, 
            playButtonId, 
            resetButtonId);

        SceneBase.builderMode = true;

        this.levelMapAnchor = document.getElementById(levelMapSpanId) as HTMLAnchorElement;
        this.setWidthSlider = document.getElementById(setWidthSliderId) as HTMLInputElement;
        this.setWidthSlider.oninput = this.setGridWidths.bind(this);
        this.setHeightSlider = document.getElementById(setHeightSliderId) as HTMLInputElement;
        this.setHeightSlider.oninput = this.setGridHeights.bind(this);
        this.setNumGridsSlider = document.getElementById(setNumGridsId) as HTMLInputElement;
        this.setNumGridsSlider.oninput = this.setNumGrids.bind(this);

        if (mapAsString && mapAsString.length > 0) {
            this.currentConfig = Config.fromBase64(mapAsString);
        }
        else {
            this.currentConfig = new Config([ConfigGrid.createDefaultGrid(this.setWidthSlider.value, this.setHeightSlider.value)]);    
            //FOR TESTING
            //let objects2 = [];
            //objects2.push(new ConfigObject([2,2],0)); //0 = robot
            //let grid2 = new ConfigGrid(3,3,objects2);
            //this.currentConfig = new Config([grid1,grid2]);
        }


        this.levelMapAnchor.innerHTML = "solver.html?" + this.currentConfig.toBase64();
        this.levelMapAnchor.href = "solver.html?" + this.currentConfig.toBase64();
    }

    create() {
        super.create();


        this.add.existing(new Food(null,this,32,32,1));
        this.add.existing(new Food(null,this,32,32+64,2));
        this.add.existing(new Food(null,this,32,32+64+64,3));
        this.add.existing(new Food(null,this,32,32+64+64+64,4));        

        this.add.existing(new Box(null,this,96,32,5));
        this.add.existing(new Box(null,this,96,32+64,6));
        this.add.existing(new Box(null,this,96,32+64+64,7));
        this.add.existing(new Box(null,this,96,32+64+64+64,8)); 

        this.resetButtonAction();
    }


    setGridWidths(event) {
        this.currentConfig.configGrids.forEach(g => g.setWidth(Number(this.setWidthSlider.value)));
        this.resetButtonAction();
        this.updateConfigSpan();
    }

    setGridHeights(event) {
        this.currentConfig.configGrids.forEach(g => g.setHeight(Number(this.setHeightSlider.value)));
        this.resetButtonAction();
        this.updateConfigSpan();
    }

    setNumGrids(event) {
        this.currentConfig.setNumGrids(this.setNumGridsSlider.value);
        this.resetButtonAction();
        this.updateConfigSpan();
    }

    updateConfigSpan() {
        this.levelMapAnchor.innerHTML = "solver.html?" + this.currentConfig.toBase64();
        this.levelMapAnchor.href = "solver.html?" + this.currentConfig.toBase64();
    }

    updateCurrentConfigFromSprites() {
        let config = new Config(this.grids.map(g => g.getConfigGrid()));
        this.currentConfig = config; 
        this.updateConfigSpan();
    }
}

class SceneSolver extends SceneBase {
    firstMapAsString: string;

    constructor(codeInputId, 
        playButtonId, 
        resetButtonId,
        mapAsString) {
        super(
            codeInputId, 
            playButtonId, 
            resetButtonId
            );

        SceneBase.builderMode = false;
        this.currentConfig = Config.fromBase64(mapAsString);
        this.firstMapAsString = mapAsString;

        if (mapAsString && mapAsString.length > 0) {
            this.currentConfig = Config.fromBase64(mapAsString);
        }
        else {
            let objects = [];
            objects.push(new ConfigObject([0,1],0)); //0 = robot
            let grid1 = new ConfigGrid(3,3,objects);
            this.currentConfig = new Config([grid1]);    
            //FOR TESTING
            //let objects2 = [];
            //objects2.push(new ConfigObject([2,2],0)); //0 = robot
            //let grid2 = new ConfigGrid(3,3,objects2);
            //this.currentConfig = new Config([grid1,grid2]);
        }
    }

    create() {
        super.create();
        this.resetButtonAction();

    }

    checkWinCondition() {
        let win = (this.grids).every(b => b.checkWinCondition());
        if (win) {     
            try {
                if (!("ch" in window)) window["ch"] = new BroadcastChannel('teachometer-lesson');
                window["ch"].postMessage('foobot-' + this.firstMapAsString);
            }
            catch(e) {
                //do nothing
            }
        }
    }


}
