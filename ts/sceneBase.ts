
    const GRID_LEFT = 192;
    const GRID_TOP = 32;
    
class SceneBase extends Phaser.Scene {

    static instance: SceneBase;
    grids: Grid[] = [];
    gridIsCompletedByIndex: boolean[] = [];

    codeInput: HTMLTextAreaElement;
    playButton: HTMLImageElement;
    resetButton: HTMLImageElement;
    fastPlayButton: HTMLImageElement;

    currentConfig: Config;
    static builderMode: boolean;

    constructor(
        codeInputId, 
        playButtonId, 
        resetButtonId, 
        fastPlayButtonId,
        config: Config) {
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
        this.playButton.onclick = this.runCodeOnAllRobots.bind(this,[1]);
        
        this.resetButton = document.getElementById(resetButtonId) as HTMLImageElement;
        this.resetButton.onclick = this.resetButtonAction.bind(this);

        this.fastPlayButton = document.getElementById(fastPlayButtonId) as HTMLImageElement;
        this.fastPlayButton.onclick = this.runCodeOnAllRobots.bind(this,[5]);

        this.currentConfig = config;
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

    runCodeOnAllRobots(playSpeed) {
        this.resetButtonAction();
        let code = this.codeInput.value;
        for (let robot of this.robots) {
            robot.runCode(code,this.setRobotCompleted.bind(this),playSpeed);
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

}

class SceneBuilder extends SceneBase {
    
    constructor(codeInputId, 
        playButtonId, 
        resetButtonId,
        fastPlayButtonId,
        config: Config) {
        super(codeInputId, 
            playButtonId, 
            resetButtonId,
            fastPlayButtonId,
            config);

        SceneBase.builderMode = true;
        config.resetGame = this.resetButtonAction.bind(this);
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

/*        this.setHeightSlider.value = this.currentConfig.configGrids[0].height.toString();
        this.setWidthSlider.value = this.currentConfig.configGrids[0].width.toString();
        this.setNumGridsSlider.value = this.currentConfig.configGrids.length.toString();
        */
    }
}

class SceneSolver extends SceneBase {
    firstMapAsString: string;

    constructor(codeInputId, 
        playButtonId, 
        resetButtonId,
        fastPlayButtonId, 
        config: Config) {
        super(codeInputId, 
            playButtonId, 
            resetButtonId,
            fastPlayButtonId,
            config
            );
        SceneBase.builderMode = false;
        this.firstMapAsString = config.toBase64();
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
