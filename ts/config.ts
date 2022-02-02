class ConfigObject {
    mapCoords: number[]; //0 - 7
    typeNumber: number;

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

    constructor(width,height,objects) {
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
                    this.removeFood([value - 1, o.mapCoords[1]]);
                }
                else {
                    helpers.removeFromArray(this.objects,o);
                }
            }
        }
    }


    setHeight(value) {
        this.height = Number(value);
        //must deep copy before altering array in loop
        let deepCopy = [...this.objects];
        for (let o of deepCopy) {
            if (o.mapCoords[1] >= value) {
                if (o.typeNumber == 0) { //robot 
                    this.removeFood([o.mapCoords[0], value-1]);
                    o.mapCoords = [o.mapCoords[0], value-1];
                }
                else {
                    helpers.removeFromArray(this.objects,o);
                }
            }
        }
    }

    removeFood(mapCoords: number[]) {
        for (let o of this.objects) {
            if (o.mapCoords[0] == mapCoords[0] && o.mapCoords[1] == mapCoords[1]) {
                helpers.removeFromArray(this.objects, o);
            }
        }
    }
}

class Config {
    static RADIX = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    //https://en.wikipedia.org/wiki/Base64#Base64_table
    configGrids: ConfigGrid[];

    constructor(configGrids: ConfigGrid[]) {
        this.configGrids = configGrids;
    }

    setNumGrids(value) {
        value = Number(value);
        if (value < 1) {return};
        if (value > this.configGrids.length) {
            for (let i = this.configGrids.length; i < value; i++) {
                let h = this.configGrids[0].height;
                let w = this.configGrids[0].width;
                this.configGrids.push(ConfigGrid.createDefaultGrid(w,h));
            }
        }
        else if (value < this.configGrids.length) {
            this.configGrids = this.configGrids.slice(0, value);
        }
    }

    toBase64() {
        let ret = "";
        for (let grid of this.configGrids) {
            //first char is number of objects - 1 (there must be a robot)
            ret += Config.RADIX[grid.objects.length-1];
            //then add the encoded grid
            ret += grid.toBase64();
        }
        return ret;
    }

    static fromBase64(str) {
        let grids = []; 
        let i = 0;
        while (i < str.length) {
            //first char is number of objects -1
            let numObjects = Config.RADIX.indexOf(str[i]) +1;
            //heightwidth is 1 char + each object is 2 chars
            let str2 = str.substring(i+1,i+1+numObjects*2+1);
            grids.push(ConfigGrid.fromBase64(str2));
            i += numObjects*2 + 1 + 1;
        }
        return new Config(grids);
    }
    
}