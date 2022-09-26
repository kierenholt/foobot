
class ConfigObject {
    mapCoords: number[]; //0 - 7
    typeNumber: number;
    howMany: number;

    constructor(mapCoords,typeNumber) {
        this.mapCoords = mapCoords;
        this.typeNumber = typeNumber;
    }

    toBase64() {
        let ret = "";
        //position
        ret += Config.RADIX[8*(this.mapCoords[0]) + this.mapCoords[1]];
        //type
        ret += Config.RADIX[this.typeNumber];
        return ret;
    }

    static fromBase64(str) {
        let c1 = Config.RADIX.indexOf(str[0]);
        let x = Math.floor(c1 / 8);
        let y = (c1 % 8);
        let c3 = Config.RADIX.indexOf(str[1]);
        return new ConfigObject([x,y],c3);
    }
}

class ConfigGrid {
    width: number;
    height: number;
    objects: ConfigObject[];
    onUpdate;

    constructor(width, height, objects) {
        this.width = Number(width);
        this.height = Number(height);
        this.objects = objects;
    }

    static createDefaultGrid(width, height) {
        let objects = [];
        objects.push(new ConfigObject([0,0],0)); //0 = robot
        return new ConfigGrid(width,height,objects);
    }

    toBase64(): string {
        //if robot is not present, just return blank
        if (this.objects.find(o => o.typeNumber == 0) == undefined) return "";
        //first char is height and width up to max 8
        let ret = "";
        ret += Config.RADIX[8*(this.width-1) + this.height - 1];
        //for each object, 2 chars
        ret += this.objects.map(o => o.toBase64()).join("");
        return ret;
    }

    static fromBase64(str: string) : ConfigGrid {
        let c1 = Config.RADIX.indexOf(str[0]);
        let height = (c1 % 8) + 1;
        let width = Math.floor(c1 / 8) + 1;
        //objects in pairs of chars
        let objects = [];
        for (let i = 1; i < str.length; i+=2) {
            let typeNumber = Config.RADIX.indexOf(str[i+1]);
            objects.push(ConfigObject.fromBase64(str.substring(i,i+2)));
        }
        return new ConfigGrid(width,height,objects);
    }

    setWidth(value) {
        this.width = Number(value);
        //must deep copy before altering array in loop
        let deepCopy = [...this.objects];
        for (let o of deepCopy) {
            if (o.mapCoords[0] >= value) {
                if (o.typeNumber == 0) { //robot 
                    o.mapCoords = [value - 1, o.mapCoords[1]];
                    this.removeAllObjectsAtCoords([value - 1, o.mapCoords[1]]);
                }
                else {
                    helpers.removeFromArray(this.objects,o);
                }
            }
        }
        if (this.onUpdate) this.onUpdate(); //update the link text
    }


    setHeight(value) {
        this.height = Number(value);
        //must deep copy before altering array in loop
        let deepCopy = [...this.objects];
        for (let o of deepCopy) {
            if (o.mapCoords[1] >= value) {
                if (o.typeNumber == 0) { //robot - remove food already in the way
                    this.removeAllObjectsAtCoords([o.mapCoords[0], value-1]);
                    o.mapCoords = [o.mapCoords[0], value-1];
                }
                else {
                    helpers.removeFromArray(this.objects,o);
                }
            }
        }
        if (this.onUpdate) this.onUpdate(); //update the link text
    }

    removeAllObjectsAtCoords(mapCoords: number[]) {
        for (let o of this.objects) {
            if (o.mapCoords[0] == mapCoords[0] && o.mapCoords[1]== mapCoords[1]) {
                helpers.removeFromArray(this.objects, o);                
            }
        }
    }

    removeObject(item: ConfigObject) {
        helpers.removeFromArray(this.objects, item);
        if (this.onUpdate) this.onUpdate();
    }

    addObject(object: ConfigObject) {
        this.objects.push(object);
        if (this.onUpdate) this.onUpdate(); //update the link text
    }
}

class Config {
    static RADIX = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    static DELIMITER = "+";
    //https://en.wikipedia.org/wiki/Base64#Base64_table
    configGrids: ConfigGrid[];
    charLimitUnmultiplied: number;
    levelMapAnchor: HTMLAnchorElement;
    resetGame: any;

    constructor(configGrids: ConfigGrid[], 
            charLimitUnmultiplied,
            levelMapAnchorId) {
        this.configGrids = configGrids;
        this.configGrids.forEach(g => g.onUpdate = this.updateConfigSpan.bind(this));
        this.charLimitUnmultiplied = charLimitUnmultiplied;
        this.levelMapAnchor = document.getElementById(levelMapAnchorId) as HTMLAnchorElement;
    }

    static createDefault(levelMapAnchorId) {
        return new Config(
            [ConfigGrid.createDefaultGrid(3, 3)],
            0,
            levelMapAnchorId
        );
    }


    updateConfigSpan() {
        let base64 = this.toBase64(); 
        this.levelMapAnchor.innerHTML = "solver.html?" + base64;
        this.levelMapAnchor.href = "solver.html?" + base64;
        if (this.resetGame) this.resetGame();
    }

    get charLimit() {
        return this.charLimitUnmultiplied*10;
    }
    
    setCharLimit(value) {
        this.charLimitUnmultiplied = Math.floor(value/10);
        let base64 = this.toBase64(); 
        this.levelMapAnchor.innerHTML = "solver.html?" + base64;
        this.levelMapAnchor.href = "solver.html?" + base64;
    }
    
    setNumGrids(value) {
        value = Number(value);
        if (value < 1) {return};
        if (value > this.configGrids.length) {
            for (let i = this.configGrids.length; i < value; i++) {
                let h = this.configGrids[0].height;
                let w = this.configGrids[0].width;
                let newGrid = ConfigGrid.createDefaultGrid(w,h);
                newGrid.onUpdate = this.updateConfigSpan.bind(this);
                this.configGrids.push(newGrid);
            }
        }
        else if (value < this.configGrids.length) {
            this.configGrids = this.configGrids.slice(0, value);
        }
        this.updateConfigSpan(); //updates the link text
    }

    toBase64() {
        let ret = "";
        for (let grid of this.configGrids) {
            //if no robot then return empty
            if (grid.objects.length == 0) return "";
            //first char is number of objects - 1 (there must be a robot)
            ret += Config.RADIX[grid.objects.length-1];
            //then add the encoded grid
            ret += grid.toBase64();
        }
        //for each constraint, 2 chars
        if (this.charLimitUnmultiplied > 0) {
            ret += Config.DELIMITER;
            ret += Config.RADIX[this.charLimitUnmultiplied];
        }
        return ret;
    }

    static fromBase64(str,levelMapAnchorId) {
        let grids = [];
        let charLimit = 0; 
        let i = 0;
        while (i < str.length) {
            if (str[i] != Config.DELIMITER) {
                //first char is number of objects -1
                let numObjects = Config.RADIX.indexOf(str[i]) +1;
                //heightwidth is 1 char + each object is 2 chars
                let str2 = str.substring(i+1,i+1+numObjects*2+1);
                grids.push(ConfigGrid.fromBase64(str2));
                i += numObjects*2 + 1 + 1;
            }
            else {
                i++;
                //constraints at the end
                charLimit = Config.RADIX.indexOf(str[i]);
                i++;
            }
        }
        return new Config(grids,charLimit,levelMapAnchorId);
    }
    
}