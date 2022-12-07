const floorMapTextureCodes = ["sprite1", "sprite2", "sprite3", "sprite4"];
const mapTextureCodes = [
    "robot",
    "apple",
    "banana",
    "cherry",
    "dragonBallOrange",
    "appleBox",
    "bananaBox",
    "cherryBox",
    "dragonballBox",
    "appleBox-tick",
    "bananaBox-tick",
    "cherryBox-tick",
    "dragonballBox-tick",
    "spikes"
];
class GridSprite extends Phaser.GameObjects.Sprite {
    constructor(grid, scene, x, y, typeNumber, texture, frame, configObject) {
        if (frame) {
            super(scene, x, y, texture, frame);
        }
        else {
            super(scene, x, y, texture);
        }
        scene.add.existing(this);
        this.typeNumber = typeNumber;
        this.scene = scene;
        this.grid = grid;
        if (configObject)
            this.configObject = configObject;
    }
    get mapCoords() {
        if (!this.grid)
            throw "no grid";
        return this.grid.getMapCoordsFromXY(this.x, this.y);
    }
    destroy() {
        super.destroy();
    }
    createConfigObject(grid) {
        let coords = grid.getMapCoordsFromXY(this.x, this.y);
        return new ConfigObject(coords, this.typeNumber);
    }
}
class Floor extends GridSprite {
    constructor(grid, scene, x, y) {
        super(grid, scene, x, y, -1, "floor", helpers.getRandomItem(floorMapTextureCodes));
    }
}
class DraggableGridSprite extends GridSprite {
    constructor(grid, scene, x, y, typeNumber, texture, frame, configObject) {
        super(grid, scene, x, y, typeNumber, texture, frame, configObject);
        if (SceneBase.builderMode) {
            this.isDragging = false;
            this.notYetInGrid = true;
            this.scene.input.setDraggable(this.setInteractive());
            this.on('drag', this.onDrag);
            this.on('dragend', this.dragEnd);
        }
    }
    onDrag(pointer, dragX, dragY) {
        if (!this.isDragging) {
            this.isDragging = true;
            if (this.notYetInGrid) {
                this.scene.add.existing(this.clone());
            }
            if (this.grid && this.mapCoords) {
                this.grid.removeItem(this);
                if (this.configObject)
                    this.grid.configGrid.removeObject(this.configObject);
                this.grid = null;
            }
            SceneBase.instance.resetButtonAction();
        }
        this.x = dragX;
        this.y = dragY;
    }
    dragEnd(pointer) {
        if (!this.isDragging) {
            return;
        }
        this.isDragging = false;
        let grid = SceneBase.instance.getContainingGrid(this.x, this.y);
        if (grid) {
            this.grid = grid;
            let [destX, destY] = this.grid.snapToTileCentres(this.x, this.y);
            let getsPlaced = this.grid.allowsItemToBePlaced(this, destX, destY);
            if (getsPlaced) {
                grid.placeItem(this, destX, destY);
                this.configObject = this.createConfigObject(grid);
                this.grid.configGrid.addObject(this.configObject);
            }
            else {
                this.destroy();
            }
        }
        else {
            this.destroy();
        }
    }
}
class Food extends DraggableGridSprite {
    constructor(grid, scene, x, y, typeNumber, configObject) {
        super(grid, scene, x, y, typeNumber, "food", mapTextureCodes[typeNumber], configObject);
        this.setScale(FOOD_SCALE);
    }
    get letterForPeek() {
        return ["a", "b", "c", "d"][this.typeNumber - 1];
    }
    clone() { return new Food(null, this.scene, this.x, this.y, this.typeNumber); }
    get foodType() {
        return this.typeNumber;
    }
}
class Box extends DraggableGridSprite {
    constructor(grid, scene, x, y, typeNumber, configObject) {
        super(grid, scene, x, y, typeNumber, "boxes", mapTextureCodes[typeNumber], configObject);
        this._containsFruit = (typeNumber > 8);
    }
    get letterForPeek() {
        return ["A", "B", "C", "D"][this.typeNumber - 5];
    }
    clone() { return new Box(null, this.scene, this.x, this.y, this.typeNumber); }
    get foodType() {
        return this._containsFruit ? this.typeNumber - 8 : this.typeNumber - 4;
    }
    acceptFruit(item) {
        if (this.foodType != item.foodType)
            throw ("does not match food type");
        item.destroy();
        this.grid.removeItem(item);
        this.containsFruit = true;
    }
    set containsFruit(value) {
        if (this.containsFruit != value) {
            if (this._containsFruit) {
                this.typeNumber -= 4;
                this.setTexture("boxes", mapTextureCodes[this.typeNumber]);
            }
            else {
                this.typeNumber += 4;
                this.setTexture("boxes", mapTextureCodes[this.typeNumber]);
            }
        }
        this._containsFruit = value;
    }
    get containsFruit() {
        return this._containsFruit;
    }
}
class Completion {
    constructor(languageSelectId) {
        this.completedCodes = [];
        this.preferredLanguage = "";
        if (localStorage) {
            let json = localStorage.getItem("foobot");
            if (json) {
                let obj = JSON.parse(json);
                this.completedCodes = obj["completed"];
                this.preferredLanguage = obj["preferredLanguage"];
            }
        }
        if (!("ch" in window)) {
            let ch = new BroadcastChannel('teachometer-lesson');
            ch.addEventListener('message', function (_completionInstance) {
                var completion = _completionInstance;
                return (e) => {
                    if (e.data.substring(0, 6) == "foobot") {
                        completion.add(e.data.substring(7));
                        completion.updateAllBoxes();
                        completion.save();
                    }
                };
            }(this));
        }
        let languageSelect = document.getElementById(languageSelectId);
        if (languageSelect) {
            if (this.preferredLanguage != "") {
                languageSelect.value = this.preferredLanguage;
            }
            languageSelect.onchange = (e) => {
                this.preferredLanguage = languageSelect.value;
                this.save();
            };
        }
        this.updateAllBoxes();
    }
    add(mapString) {
        this.completedCodes.push(mapString);
    }
    mapIsCompleted(mapString) {
        return this.completedCodes.indexOf(mapString) != -1;
    }
    save() {
        if (localStorage) {
            let obj = {
                completed: this.completedCodes,
                preferredLanguage: this.preferredLanguage
            };
            localStorage.setItem("foobot", JSON.stringify(obj));
        }
        else {
            throw ("no local storage");
        }
    }
    updateAllBoxes() {
        let images = document.getElementsByTagName("img");
        for (let image of images) {
            if (image instanceof HTMLImageElement) {
                let letterIndex = Completion.boxLetters.indexOf(image.alt);
                if (letterIndex != -1) {
                    if (this.mapIsCompleted(image.id)) {
                        image.src = Completion.boxFullImages[letterIndex];
                    }
                    else {
                        image.src = Completion.boxEmptyImages[letterIndex];
                    }
                }
            }
        }
    }
}
Completion.boxLetters = ["a", "b", "c", "d"];
Completion.boxFullImages = ["pageImages/a-full.png", "pageImages/b-full.png", "pageImages/c-full.png", "pageImages/d-full.png"];
Completion.boxEmptyImages = ["pageImages/a-empty.png", "pageImages/b-empty.png", "pageImages/c-empty.png", "pageImages/d-empty.png"];
class ConfigObject {
    constructor(mapCoords, typeNumber) {
        this.mapCoords = mapCoords;
        this.typeNumber = typeNumber;
    }
    toBase64() {
        let ret = "";
        ret += Config.RADIX[8 * (this.mapCoords[0]) + this.mapCoords[1]];
        ret += Config.RADIX[this.typeNumber];
        return ret;
    }
    static fromBase64(str) {
        let c1 = Config.RADIX.indexOf(str[0]);
        let x = Math.floor(c1 / 8);
        let y = (c1 % 8);
        let c3 = Config.RADIX.indexOf(str[1]);
        return new ConfigObject([x, y], c3);
    }
}
class ConfigGrid {
    constructor(width, height, objects) {
        this.width = Number(width);
        this.height = Number(height);
        this.objects = objects;
    }
    static createDefaultGrid(width, height) {
        let objects = [];
        objects.push(new ConfigObject([0, 0], 0));
        return new ConfigGrid(width, height, objects);
    }
    toBase64() {
        if (this.objects.find(o => o.typeNumber == 0) == undefined)
            return "";
        let ret = "";
        ret += Config.RADIX[8 * (this.width - 1) + this.height - 1];
        ret += this.objects.map(o => o.toBase64()).join("");
        return ret;
    }
    static fromBase64(str) {
        let c1 = Config.RADIX.indexOf(str[0]);
        let height = (c1 % 8) + 1;
        let width = Math.floor(c1 / 8) + 1;
        let objects = [];
        for (let i = 1; i < str.length; i += 2) {
            let typeNumber = Config.RADIX.indexOf(str[i + 1]);
            objects.push(ConfigObject.fromBase64(str.substring(i, i + 2)));
        }
        return new ConfigGrid(width, height, objects);
    }
    setWidth(value) {
        this.width = Number(value);
        let deepCopy = [...this.objects];
        for (let o of deepCopy) {
            if (o.mapCoords[0] >= value) {
                if (o.typeNumber == 0) {
                    o.mapCoords = [value - 1, o.mapCoords[1]];
                    this.removeAllObjectsAtCoords([value - 1, o.mapCoords[1]]);
                }
                else {
                    helpers.removeFromArray(this.objects, o);
                }
            }
        }
        if (this.onUpdate)
            this.onUpdate();
    }
    setHeight(value) {
        this.height = Number(value);
        let deepCopy = [...this.objects];
        for (let o of deepCopy) {
            if (o.mapCoords[1] >= value) {
                if (o.typeNumber == 0) {
                    this.removeAllObjectsAtCoords([o.mapCoords[0], value - 1]);
                    o.mapCoords = [o.mapCoords[0], value - 1];
                }
                else {
                    helpers.removeFromArray(this.objects, o);
                }
            }
        }
        if (this.onUpdate)
            this.onUpdate();
    }
    removeAllObjectsAtCoords(mapCoords) {
        for (let o of this.objects) {
            if (o.mapCoords[0] == mapCoords[0] && o.mapCoords[1] == mapCoords[1]) {
                helpers.removeFromArray(this.objects, o);
            }
        }
    }
    removeObject(item) {
        helpers.removeFromArray(this.objects, item);
        if (this.onUpdate)
            this.onUpdate();
    }
    addObject(object) {
        this.objects.push(object);
        if (this.onUpdate)
            this.onUpdate();
    }
}
class Config {
    constructor(configGrids, charLimitUnmultiplied, levelMapAnchorId) {
        this.configGrids = configGrids;
        this.configGrids.forEach(g => g.onUpdate = this.updateConfigSpan.bind(this));
        this.charLimitUnmultiplied = charLimitUnmultiplied;
        this.levelMapAnchor = document.getElementById(levelMapAnchorId);
    }
    static createDefault(levelMapAnchorId) {
        return new Config([ConfigGrid.createDefaultGrid(3, 3)], 0, levelMapAnchorId);
    }
    updateConfigSpan() {
        let base64 = this.toBase64();
        this.levelMapAnchor.innerHTML = "solver.html?" + base64;
        this.levelMapAnchor.href = "solver.html?" + base64;
        if (this.resetGame)
            this.resetGame();
    }
    get charLimit() {
        return this.charLimitUnmultiplied * 10;
    }
    setCharLimit(value) {
        this.charLimitUnmultiplied = Math.floor(value / 10);
        let base64 = this.toBase64();
        this.levelMapAnchor.innerHTML = "solver.html?" + base64;
        this.levelMapAnchor.href = "solver.html?" + base64;
    }
    setNumGrids(value) {
        value = Number(value);
        if (value < 1) {
            return;
        }
        ;
        if (value > this.configGrids.length) {
            for (let i = this.configGrids.length; i < value; i++) {
                let h = this.configGrids[0].height;
                let w = this.configGrids[0].width;
                let newGrid = ConfigGrid.createDefaultGrid(w, h);
                newGrid.onUpdate = this.updateConfigSpan.bind(this);
                this.configGrids.push(newGrid);
            }
        }
        else if (value < this.configGrids.length) {
            this.configGrids = this.configGrids.slice(0, value);
        }
        this.updateConfigSpan();
    }
    toBase64() {
        let ret = "";
        for (let grid of this.configGrids) {
            if (grid.objects.length == 0)
                return "";
            ret += Config.RADIX[grid.objects.length - 1];
            ret += grid.toBase64();
        }
        if (this.charLimitUnmultiplied > 0) {
            ret += Config.DELIMITER;
            ret += Config.RADIX[this.charLimitUnmultiplied];
        }
        return ret;
    }
    static fromBase64(str, levelMapAnchorId) {
        let grids = [];
        let charLimit = 0;
        let i = 0;
        while (i < str.length) {
            if (str[i] != Config.DELIMITER) {
                let numObjects = Config.RADIX.indexOf(str[i]) + 1;
                let str2 = str.substring(i + 1, i + 1 + numObjects * 2 + 1);
                grids.push(ConfigGrid.fromBase64(str2));
                i += numObjects * 2 + 1 + 1;
            }
            else {
                i++;
                charLimit = Config.RADIX.indexOf(str[i]);
                i++;
            }
        }
        return new Config(grids, charLimit, levelMapAnchorId);
    }
}
Config.RADIX = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
Config.DELIMITER = "+";
const GAME_WIDTH = 700;
const GAME_HEIGHT = 300;
class fooBotBuilder extends Phaser.Game {
    constructor(parentId, codeInputId, playButtonId, resetButtonId, fastPlayButtonId, languageSelectId, configObject) {
        let config = {
            type: Phaser.AUTO,
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            autoFocus: true,
            transparent: true,
            parent: parentId,
            url: '',
            title: 'foobot',
            version: '0.0.1',
            physics: {
                default: 'arcade'
            },
            scale: {
                min: {
                    height: GAME_HEIGHT
                }
            },
            scene: [new SceneBuilder(codeInputId, playButtonId, resetButtonId, fastPlayButtonId, languageSelectId, configObject)]
        };
        super(config);
    }
}
class fooBotSolver extends Phaser.Game {
    constructor(parentId, codeInputId, playButtonId, resetButtonId, fastPlayButtonId, languageSelectId, configObject) {
        let config = {
            type: Phaser.AUTO,
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            autoFocus: true,
            transparent: true,
            parent: parentId,
            url: '',
            title: 'foobot',
            version: '0.0.1',
            physics: {
                default: 'arcade'
            },
            scene: [new SceneSolver(codeInputId, playButtonId, resetButtonId, fastPlayButtonId, languageSelectId, configObject)]
        };
        super(config);
    }
}
class Grid {
    constructor(scene, originX, originY, configGrid) {
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
    reset(configGrid) {
        this.widthInSquares = configGrid.width;
        this.heightInSquares = configGrid.height;
        this.floors.clear(true, true);
        this.food.clear(true, true);
        this.boxes.clear(true, true);
        this.numbers.clear(true, true);
        if (this.robot) {
            this.robot.destroy();
            this.robot = null;
        }
        for (let j = 0; j < configGrid.height; j++) {
            for (let i = 0; i < configGrid.width; i++) {
                let coords = this.getXYfromMapCoords([i, j]);
                this.floors.add(new Floor(this, this.scene, coords[0], coords[1]));
            }
        }
        this.floors.setDepth(-100);
        for (let object of configGrid.objects) {
            let coords = this.getXYfromMapCoords(object.mapCoords);
            if (object.typeNumber == 0) {
                this.robot = new Robot(this, this.scene, coords[0], coords[1], object);
                this.robot.lookingIndex = 0;
                if (this.robot.carryingFruit)
                    this.robot.carryingFruit.destroy();
                this.robot.isScoopDown = true;
            }
            else if (object.typeNumber >= 1 && object.typeNumber <= 4) {
                let newFood = new Food(this, this.scene, coords[0], coords[1], object.typeNumber, object);
                newFood.notYetInGrid = false;
                this.food.add(newFood);
            }
            else if (object.typeNumber >= 5 && object.typeNumber <= 12) {
                let newBox = new Box(this, this.scene, coords[0], coords[1], object.typeNumber, object);
                newBox.notYetInGrid = false;
                this.boxes.add(newBox);
            }
            else {
                throw ("bad typenumber");
            }
        }
        this.refreshFruitCounts();
    }
    refreshFruitCounts() {
        this.numbers.clear(true, true);
        let groupedByCoords = {};
        for (let food of this.food.getChildren()) {
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
                let newText = this.scene.add.text(x, y, groupedByCoords[key].length, {
                    fill: "#000",
                    fontSize: "14px",
                    fontFamily: "Arial Black"
                });
                this.numbers.add(newText);
            }
        }
    }
    getConfigGrid() {
        let objects = [];
        let constraints = [];
        for (let fruit of this.food.getChildren()) {
            objects.push(new ConfigObject(fruit.mapCoords, fruit.typeNumber));
        }
        for (let box of this.boxes.getChildren()) {
            objects.push(new ConfigObject(box.mapCoords, box.typeNumber));
        }
        if (this.robot)
            objects.push(new ConfigObject(this.robot.mapCoords, 0));
        return new ConfigGrid(this.widthInSquares, this.heightInSquares, objects);
    }
    containsMapCoords(i, j) {
        return i >= 0 && i < this.widthInSquares && j >= 0 && j < this.heightInSquares;
    }
    containsXY(x, y) {
        return x >= this.leftX && x < this.rightX && y >= this.topY && y < this.bottomY;
    }
    snapToTileCentres(x, y) {
        let mapCoords = this.getMapCoordsFromXY(x, y);
        if (mapCoords)
            return this.getXYfromMapCoords(mapCoords);
        return null;
    }
    getUniqueKeyFromXY(item) {
        let mapCoords = this.getMapCoordsFromXY(item.x, item.y);
        return mapCoords[0] * 8 + mapCoords[1];
    }
    getMapCoordsFromXY(x, y) {
        let i = Math.floor((x - this.leftX) / TILE_SIZE);
        let j = Math.floor((y - this.topY) / TILE_SIZE);
        if (this.containsMapCoords(i, j))
            return [i, j];
        return null;
    }
    getXYfromMapCoords(mapCoords) {
        let x = mapCoords[0] * TILE_SIZE + TILE_SIZE / 2 + this.leftX;
        let y = mapCoords[1] * TILE_SIZE + TILE_SIZE / 2 + this.topY;
        if (this.containsXY(x, y))
            return [x, y];
        return null;
    }
    getFoodOrBoxAtXY(x, y) {
        for (let fruit of this.food.getChildren()) {
            if (fruit.x == x && fruit.y == y) {
                return fruit;
            }
        }
        ;
        for (let box of this.boxes.getChildren()) {
            if (box.x == x && box.y == y) {
                return box;
            }
        }
        ;
        return null;
    }
    get bottomY() { return this.topY + this.heightInSquares * TILE_SIZE; }
    get rightX() { return this.leftX + this.widthInSquares * TILE_SIZE; }
    allowsItemToBePlaced(item, destX, destY) {
        let foodOrBoxAlreadyThere = this.getFoodOrBoxAtXY(destX, destY);
        if (foodOrBoxAlreadyThere) {
            if (item instanceof Food && foodOrBoxAlreadyThere.foodType == item.foodType) {
                return true;
            }
            return false;
        }
        if (this.robot.x == destX && this.robot.y == destY) {
            return false;
        }
        return true;
    }
    checkWinCondition() {
        return (this.food.getLength() == 0 && this.robot.carryingFruit == null);
    }
    placeItem(item, destX, destY) {
        let destItem = this.getFoodOrBoxAtXY(destX, destY);
        if (destItem instanceof Box && item instanceof Food) {
            destItem.acceptFruit(item);
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
    getGroup(item) {
        if (item instanceof Food)
            return this.food;
        if (item instanceof Box)
            return this.boxes;
        if (item instanceof Floor)
            return this.floors;
    }
    removeItem(item) {
        let group = this.getGroup(item);
        if (group)
            group.remove(item);
        this.refreshFruitCounts();
    }
    destroy() {
        this.food.clear(true, true);
        this.boxes.clear(true, true);
        if (this.robot)
            this.robot.destroy();
        this.floors.clear(true, true);
        this.numbers.clear(true, true);
    }
}
var helpersMaker = function () {
    var objToHash = function (obj, hash) {
        if (hash == undefined) {
            hash = 34898410941;
        }
        return stringToHash(JSON.stringify(obj), hash);
    };
    var stringToHash = function (str, hash) {
        if (hash == undefined) {
            hash = 34898410941;
        }
        ;
        if (str.length == 0) {
            return hash;
        }
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    };
    var createUID = function () {
        return 'ID' + Math.random().toString(36).substr(2, 16);
    };
    var shuffleInPlace = function (a, random) {
        for (var i = a.length - 1; i > 0; i--) {
            let index = random.next(i);
            a.push(a.splice(index, 1)[0]);
        }
        return a;
    };
    var toShuffled = function (a, random) {
        let ret = [];
        for (let item of a) {
            let index = random.next(a.length);
            while (ret[index]) {
                index++;
                index %= a.length;
            }
            ret[index] = item;
        }
        return ret;
    };
    var trimChar = function (str, char) {
        var i = 0;
        while (i < str.length && str[i] == char) {
            i++;
        }
        if (i == str.length) {
            return "";
        }
        var j = str.length - 1;
        while (j >= 0 && str[j] == char) {
            j--;
        }
        return str.substring(i, j + 1);
    };
    var IsStringNullOrEmpty = function (str) {
        return (str == undefined || str == null || typeof (str) != "string" || str.length === 0 || !str.trim());
    };
    var IsStringNullOrWhiteSpace = function (str) {
        return str == undefined || str == null || typeof (str) != "string" || str == "" || str.trim().length == 0;
    };
    var startsWith = function (a, ai, b, bi) {
        if (ai == 0 && bi != 0) {
            return false;
        }
        if (bi == 0) {
            return a[ai] == b[bi];
        }
        return a[ai] == b[bi] && startsWith(a, ai - 1, b, bi - 1);
    };
    var replaceAll = function (within, toReplace, replaceWith) {
        var ret = "";
        var i = 0;
        var toReplaceLength = toReplace.length;
        while (i < within.length) {
            if (startsWith(within, i + toReplaceLength - 1, toReplace, toReplaceLength - 1)) {
                ret += replaceWith;
                i += toReplaceLength;
            }
            else {
                ret += within[i];
                i += 1;
            }
        }
        return ret;
    };
    var stripQuotes = function (str) {
        if (str.charAt(0) === '"' && str.charAt(str.length - 1) === '"') {
            return str.substr(1, str.length - 2);
        }
        return str.toString();
    };
    var removeCrazySigFigs = function (n) {
        return Number(parseFloat(n).toPrecision(12)).toString();
    };
    var isNumeric = function (str) {
        return !isNaN(parseFloat(str)) && isFinite(str);
    };
    var getDomainFromUrl = function (url) {
        var a = document.createElement('a');
        a.setAttribute('href', url);
        return a.hostname;
    };
    var insertAfter = function (arr, ref, item) {
        let index = arr.indexOf(ref);
        if (index == -1)
            throw ("reference item not found in array");
        arr = arr.splice(index + 1, 0, item);
    };
    var insertBefore = function (arr, ref, item) {
        let refIndex = arr.indexOf(ref);
        if (refIndex == -1)
            throw ("reference item not found in array");
        arr = arr.splice(refIndex, 0, item);
    };
    var deepInsertBefore = function (arr, ref, item) {
        let refIndex = deepIndexOf(arr, ref);
        if (refIndex == -1)
            throw ("reference item not found in array");
        arr = arr.splice(refIndex, 0, item);
    };
    var getUniqueItems = function (arr) {
        let ret = [];
        for (let item of arr) {
            if (ret.indexOf[item] == -1)
                ret.push(item);
        }
        return ret;
    };
    var replaceItem = function (arr, oldItem, newItem) {
        let index = arr.indexOf(oldItem);
        if (index != -1)
            arr[index] = newItem;
    };
    var deepIndexOf = function (arr, item) {
        for (let i = 0; i < arr.length; i++) {
            if (deepCompare(item, arr[i]))
                return i;
        }
        return -1;
    };
    var deepReplaceItem = function (arr, oldItem, newItem) {
        let index = deepIndexOf(arr, oldItem);
        if (index != -1)
            arr[index] = newItem;
    };
    var getItemImmediatelyBefore = function (arr, after) {
        let index = arr.indexOf(after);
        return index == -1 ? undefined : arr[index - 1];
    };
    var getItemImmediatelyAfter = function (arr, after) {
        let index = arr.indexOf(after);
        return index == -1 ? undefined : arr[index + 1];
    };
    var getRandomItem = function (arr) {
        let index = Math.floor(Math.random() * arr.length);
        return arr[index];
    };
    var removeFromArray = function (array, item) {
        for (let i = array.length; i >= 0; i--) {
            if (array[i] == item) {
                array.splice(i, 1);
            }
        }
    };
    var removeFromArrayOnce = function (array, item) {
        for (let i = array.length; i >= 0; i--) {
            if (array[i] == item) {
                array.splice(i, 1);
                return;
            }
        }
    };
    var deepRemoveFromArrayOnce = function (array, item) {
        for (let i = array.length; i >= 0; i--) {
            if (deepCompare(array[i], item)) {
                array.splice(i, 1);
                return;
            }
        }
    };
    var deepRemoveFromArray = function (array, item) {
        for (let i = array.length; i >= 0; i--) {
            if (deepCompare(item, array[i])) {
                array.splice(i, 1);
            }
        }
    };
    var lowerCaseLetterFromIndex = function (i) { return String.fromCharCode(97 + i); };
    var lengthOfObject = function (obj) {
        let ret = 0;
        for (let key in obj) {
            ret++;
        }
        return ret;
    };
    var getValuesFromObject = function (obj) {
        let ret = [];
        for (let key in obj) {
            ret.push(obj[key]);
        }
        return ret;
    };
    var getKeysFromObject = function (obj) {
        let ret = [];
        for (let key in obj) {
            ret.push(key);
        }
        return ret;
    };
    var getKeyFromValue = function (obj, value) {
        for (let key in obj) {
            if (obj[key] == value)
                return key;
        }
    };
    var mergeObjects = function (obj1, obj2) {
        let ret = {};
        for (let key in obj1) {
            ret[key] = obj1[key];
        }
        for (let key in obj2) {
            ret[key] = obj2[key];
        }
        return ret;
    };
    var copyObject = function (obj1) {
        return JSON.parse(JSON.stringify(obj1));
    };
    var deepCompare = function (obj1, obj2) {
        if (typeof (obj1) != typeof (obj2))
            return false;
        if (typeof (obj1) == "object") {
            for (let key in obj1) {
                if (!(key in obj2) || !deepCompare(obj1[key], obj2[key]))
                    return false;
            }
            return true;
        }
        return obj1 == obj2;
    };
    var deepRemoveDuplicatesUsingHash = function (arr) {
        let obj = {};
        for (let i = 0; i < arr.length; i++) {
            obj[arr[i].toString()] = arr[i];
        }
        return helpers.getValuesFromObject(obj);
    };
    return {
        objToHash: objToHash,
        IsStringNullOrEmpty: IsStringNullOrEmpty,
        IsStringNullOrWhiteSpace: IsStringNullOrWhiteSpace,
        createUID: createUID,
        shuffleInPlace: shuffleInPlace,
        replaceAll: replaceAll,
        startsWith: startsWith,
        stripQuotes: stripQuotes,
        trimChar: trimChar,
        isNumeric: isNumeric,
        getDomainFromUrl: getDomainFromUrl,
        insertAfter: insertAfter,
        insertBefore: insertBefore,
        deepInsertBefore: deepInsertBefore,
        getUniqueItems: getUniqueItems,
        getItemImmediatelyBefore: getItemImmediatelyBefore,
        getItemImmediatelyAfter: getItemImmediatelyAfter,
        getRandomItem: getRandomItem,
        replaceItem: replaceItem,
        deepIndexOf: deepIndexOf,
        deepReplaceItem: deepReplaceItem,
        removeFromArray: removeFromArray,
        removeFromArrayOnce: removeFromArrayOnce,
        deepRemoveFromArrayOnce: deepRemoveFromArrayOnce,
        deepRemoveFromArray: deepRemoveFromArray,
        removeCrazySigFigs: removeCrazySigFigs,
        lowerCaseLetterFromIndex: lowerCaseLetterFromIndex,
        toShuffled: toShuffled,
        lengthOfObject: lengthOfObject,
        getKeyFromValue: getKeyFromValue,
        getValuesFromObject: getValuesFromObject,
        getKeysFromObject: getKeysFromObject,
        mergeObjects: mergeObjects,
        copyObject: copyObject,
        deepCompare: deepCompare,
        deepRemoveDuplicatesUsingHash: deepRemoveDuplicatesUsingHash
    };
};
var helpers = helpersMaker();
class Random {
    constructor(seed) {
        if (!seed) {
            this._seed = Random.generateSeed();
        }
        else {
            this._seed = seed;
        }
        this._seed = this._seed % 2147483647;
        if (this._seed <= 0)
            this._seed += 2147483646;
    }
    next(limit) {
        if (limit == undefined) {
            limit = 2147483647;
        }
        this._seed = this._seed * 16807 % 2147483647;
        return this._seed % limit;
    }
    static generateSeed() {
        let now = new Date();
        let seed = now.getTime();
        seed = seed % 2147483647;
        if (seed <= 0)
            seed += 2147483646;
        return seed;
    }
}
const TILE_SIZE = 64;
const FOOD_SCALE = 0.75;
class Robot extends GridSprite {
    constructor(grid, scene, x, y, configObject) {
        super(grid, scene, x, y, 1, "body", "RightLowered", configObject);
        this._lookingIndex = 0;
        this.isScoopDown = true;
        this.callStack = [];
        this.setDepth(10);
        this.typeNumber = 0;
        this.isDragging = false;
        this.scene.input.setDraggable(this.setInteractive());
        this.on('drag', this.onDrag.bind(this));
        this.on('dragend', this.dragEnd.bind(this));
    }
    ahead(onComplete, repeats) {
        if (repeats < 1 || this.lookingXY == null) {
            if (onComplete)
                onComplete();
            return;
        }
        let aheadTween = this.getAheadTween();
        if (repeats > 1) {
            aheadTween.on("complete", this.ahead.bind(this, onComplete, repeats - 1));
        }
        else {
            aheadTween.on("complete", onComplete);
        }
        aheadTween.play();
    }
    back(onComplete, repeats) {
        if (repeats < 1 || this.lookingBehindXY == null) {
            if (onComplete)
                onComplete();
            return;
        }
        let moveBackTween = this.getMoveBackTween();
        if (repeats > 1) {
            moveBackTween.on("complete", this.back.bind(this, onComplete, repeats - 1));
        }
        else {
            moveBackTween.on("complete", onComplete);
        }
        moveBackTween.play();
    }
    right(onComplete, repeats) {
        this.lookingIndex = (this.lookingIndex + 1) % 4;
        if (repeats > 1) {
            setTimeout(this.right.bind(this, onComplete, repeats - 1), Robot.duration / 2);
        }
        else {
            setTimeout(onComplete, Robot.duration / 2);
        }
    }
    left(onComplete, repeats) {
        this.lookingIndex = (this.lookingIndex + 3) % 4;
        if (repeats > 1) {
            setTimeout(this.left.bind(this, onComplete, repeats - 1), Robot.duration / 2);
        }
        else {
            setTimeout(onComplete, Robot.duration / 2);
        }
    }
    peek(onComplete) {
        let fruit = this.lookingFruitNotBox;
        setTimeout(onComplete, Robot.duration / 2);
        if (fruit)
            return fruit.letterForPeek;
        return "";
    }
    lift(onComplete) {
        if (!this.isScoopDown) {
            if (onComplete)
                onComplete();
            return;
        }
        let liftScoopInjector = function (paramOnCompleteTween, robot, fruit) {
            var paramOnCompleteTween = paramOnCompleteTween;
            var robot = robot;
            return () => {
                robot.isScoopDown = false;
                robot.setFrame(Robot.lookingBodyFrames[robot.isScoopDown ? 1 : 0][robot.lookingIndex]);
                if (fruit) {
                    robot.grid.removeItem(fruit);
                    fruit.setPosition(robot.x, robot.y - Robot.carryingHeight);
                }
                if (paramOnCompleteTween)
                    paramOnCompleteTween.play();
            };
        };
        let moveTowardsTween = this.getMoveTowardsFruitTween();
        if (this.lookingFruitNotBox && this.carryingFruit == null) {
            this.carryingFruit = this.lookingFruitNotBox;
        }
        ;
        let moveAwayTween = this.getMoveAwayFomFruitTween();
        if (onComplete)
            moveAwayTween.on("complete", onComplete);
        moveTowardsTween.on("complete", liftScoopInjector(moveAwayTween, this, this.carryingFruit));
        moveTowardsTween.play();
    }
    drop(onComplete) {
        if (this.isScoopDown) {
            if (onComplete)
                onComplete();
            return;
        }
        let dropScoopInjector = function (paramOnCompleteTween, robot, fruit, coords, paramCanDrop) {
            var paramOnCompleteTween = paramOnCompleteTween;
            var robot = robot;
            let dropCoords = coords;
            var canDrop = paramCanDrop;
            return () => {
                if (fruit) {
                    if (canDrop) {
                        robot.grid.placeItem(fruit, dropCoords[0], dropCoords[1]);
                        robot.isScoopDown = true;
                        robot.setFrame(Robot.lookingBodyFrames[robot.isScoopDown ? 1 : 0][robot.lookingIndex]);
                    }
                    else {
                    }
                }
                else {
                    robot.isScoopDown = true;
                    robot.setFrame(Robot.lookingBodyFrames[robot.isScoopDown ? 1 : 0][robot.lookingIndex]);
                }
                if (paramOnCompleteTween)
                    paramOnCompleteTween.play();
            };
        };
        let dropCoords = this.lookingXY;
        let canDrop = (dropCoords != null) && (this.carryingFruit != null) && this.grid.allowsItemToBePlaced(this.carryingFruit, dropCoords[0], dropCoords[1]);
        let moveTowardsTween = this.getMoveTowardsFruitTween();
        let droppedFruit = this.carryingFruit;
        if (canDrop)
            this.carryingFruit = null;
        let moveAwayTween = this.getMoveAwayFomFruitTween();
        if (onComplete)
            moveAwayTween.on("complete", onComplete);
        moveTowardsTween.on("complete", dropScoopInjector(moveAwayTween, this, droppedFruit, dropCoords, canDrop));
        moveTowardsTween.play();
    }
    get lookingIndex() { return this._lookingIndex; }
    set lookingIndex(value) {
        this._lookingIndex = value;
        this.setFrame(Robot.lookingBodyFrames[this.isScoopDown ? 1 : 0][value]);
    }
    get lookingBehindXY() {
        let lookingX = this.x + Robot.lookingX[(this.lookingIndex + 2) % 4] * TILE_SIZE;
        let lookingY = this.y + Robot.lookingY[(this.lookingIndex + 2) % 4] * TILE_SIZE;
        if (this.grid.containsXY(lookingX, lookingY))
            return [lookingX, lookingY];
        return null;
    }
    get lookingXY() {
        let lookingX = this.x + Robot.lookingX[this.lookingIndex] * TILE_SIZE;
        let lookingY = this.y + Robot.lookingY[this.lookingIndex] * TILE_SIZE;
        if (this.grid.containsXY(lookingX, lookingY))
            return this.grid.snapToTileCentres(lookingX, lookingY);
        return null;
    }
    get isLookingRight() { return this.lookingIndex == 0; }
    get isSideView() { return this.lookingIndex == 0 || this.lookingIndex == 2; }
    get isLookingDown() { return this.lookingIndex == 1; }
    get lookingFruitNotBox() {
        let lookingCoords = this.lookingXY;
        if (lookingCoords) {
            let found = this.grid.getFoodOrBoxAtXY(lookingCoords[0], lookingCoords[1]);
            if (found instanceof Food)
                return found;
        }
        return null;
    }
    getMoveTowardsFruitTween() {
        return this.scene.tweens.create({
            targets: this.carryingFruit ? [this, this.carryingFruit] : this,
            x: "+= " + (this.isSideView ? Robot.lookingX[this.lookingIndex] * Robot.liftAndDropDistance : 0),
            y: "+= " + (this.isSideView ? 0 : Robot.lookingY[this.lookingIndex] * Robot.liftAndDropDistance),
            duration: Robot.duration / 2, ease: Robot.ease, repeat: 0, yoyo: false, paused: false
        });
    }
    getMoveAwayFomFruitTween() {
        return this.scene.tweens.create({
            targets: this.carryingFruit ? [this, this.carryingFruit] : this,
            x: "-= " + (this.isSideView ? Robot.lookingX[this.lookingIndex] * Robot.liftAndDropDistance : 0),
            y: "-= " + (this.isSideView ? 0 : Robot.lookingY[this.lookingIndex] * Robot.liftAndDropDistance),
            duration: Robot.duration / 2, ease: Robot.ease, repeat: 0, yoyo: false, paused: false
        });
    }
    getMoveBackTween() {
        return this.scene.tweens.create({
            targets: this.carryingFruit ? [this, this.carryingFruit] : this,
            x: "-= " + Robot.lookingX[this.lookingIndex] * TILE_SIZE,
            y: "-= " + Robot.lookingY[this.lookingIndex] * TILE_SIZE,
            duration: Robot.duration, ease: Robot.ease, repeat: 0, yoyo: false, paused: false
        });
    }
    getAheadTween() {
        return this.scene.tweens.create({
            targets: this.carryingFruit ? [this, this.carryingFruit] : this,
            x: "+= " + Robot.lookingX[this.lookingIndex] * TILE_SIZE,
            y: "+= " + Robot.lookingY[this.lookingIndex] * TILE_SIZE,
            duration: Robot.duration, ease: Robot.ease, repeat: 0, yoyo: false, paused: false
        });
    }
    aheadPromise(repeats) {
        return new Promise((resolve, reject) => {
            this.ahead(() => { console.log("resolved"); resolve(0); }, repeats);
        });
    }
    backPromise(repeats) {
        return new Promise((resolve, reject) => {
            this.back(() => { console.log("resolved"); resolve(0); }, repeats);
        });
    }
    leftPromise(repeats) {
        return new Promise((resolve, reject) => {
            this.left(() => { console.log("resolved"); resolve(0); }, repeats);
        });
    }
    rightPromise(repeats) {
        return new Promise((resolve, reject) => {
            this.right(() => { console.log("resolved"); resolve(0); }, repeats);
        });
    }
    liftPromise() {
        return new Promise((resolve, reject) => {
            this.lift(() => { console.log("resolved"); resolve(0); });
        });
    }
    dropPromise() {
        return new Promise((resolve, reject) => {
            this.drop(() => { console.log("resolved"); resolve(0); });
        });
    }
    peekPromise() {
        return new Promise((resolve, reject) => {
            this.peek(() => { console.log("resolved"); resolve(0); });
        });
    }
    runJSCode(myCode, onComplete, playSpeed) {
        var robot = this;
        Robot.duration = 1000 / playSpeed;
        var initFunc = (interpreter, globalObject) => {
            var aheadWrapper = function (repeats) {
                robot.moving = true;
                robot.ahead(() => { robot.moving = false; robot.nextStepJS(); }, repeats);
            };
            interpreter.setProperty(globalObject, 'ahead', interpreter.createNativeFunction(aheadWrapper));
            var backWrapper = function (repeats) {
                robot.moving = true;
                robot.back(() => { robot.moving = false; robot.nextStepJS(); }, repeats);
            };
            interpreter.setProperty(globalObject, 'back', interpreter.createNativeFunction(backWrapper));
            var rightWrapper = function (repeats) {
                robot.moving = true;
                robot.right(() => { robot.moving = false; robot.nextStepJS(); }, repeats);
            };
            interpreter.setProperty(globalObject, 'right', interpreter.createNativeFunction(rightWrapper));
            var leftWrapper = function (repeats) {
                robot.moving = true;
                robot.left(() => { robot.moving = false; robot.nextStepJS(); }, repeats);
            };
            interpreter.setProperty(globalObject, 'left', interpreter.createNativeFunction(leftWrapper));
            var liftWrapper = function () {
                robot.moving = true;
                robot.lift(() => { robot.moving = false; robot.nextStepJS(); });
            };
            interpreter.setProperty(globalObject, 'lift', interpreter.createNativeFunction(liftWrapper));
            var dropWrapper = function () {
                robot.moving = true;
                robot.drop(() => { robot.moving = false; robot.nextStepJS(); });
            };
            interpreter.setProperty(globalObject, 'drop', interpreter.createNativeFunction(dropWrapper));
            var peekWrapper = function () {
                robot.moving = true;
                return robot.peek(() => { robot.moving = false; robot.nextStepJS(); });
            };
            interpreter.setProperty(globalObject, 'peek', interpreter.createNativeFunction(peekWrapper));
            var logWrapper = function (str) {
                console.log(str);
            };
            interpreter.setProperty(globalObject, 'log', interpreter.createNativeFunction(logWrapper));
        };
        this.myInterpreter = newInterpreter(myCode, initFunc);
        this.onComplete = onComplete;
        setTimeout(this.nextStepJS.bind(this), Robot.duration / 2);
    }
    nextStepJS() {
        while (!this.moving && this.myInterpreter.step()) {
        }
        ;
        if (!this.moving && this.onComplete) {
            this.onComplete(this);
        }
    }
    onDrag(pointer, dragX, dragY) {
        let dummy = 0;
        if (!(this instanceof Robot))
            return;
        if (this.isDragging == undefined)
            return;
        if (!this.isDragging) {
            this.isDragging = true;
            if (this.grid && this.mapCoords) {
                this.grid.robot = null;
                if (this.configObject)
                    this.grid.configGrid.removeObject(this.configObject);
                this.configObject = null;
            }
            SceneBase.instance.resetButtonAction();
        }
        if (dragX < this.grid.leftX)
            dragX = this.grid.leftX + 1;
        if (dragX > this.grid.rightX)
            dragX = this.grid.rightX - 1;
        if (dragY < this.grid.topY)
            dragY = this.grid.topY + 1;
        if (dragY > this.grid.bottomY)
            dragY = this.grid.bottomY - 1;
        this.x = dragX;
        this.y = dragY;
    }
    dragEnd(pointer) {
        if (!(this instanceof Robot))
            return;
        if (!this.isDragging) {
            return;
        }
        this.isDragging = false;
        let grid = SceneBase.instance.getContainingGrid(this.x, this.y);
        if (grid.topY == this.grid.topY) {
            let [x, y] = this.grid.snapToTileCentres(this.x, this.y);
            this.x = x;
            this.y = y;
            let food = this.grid.getFoodOrBoxAtXY(x, y);
            if (food) {
                food.destroy();
            }
            this.grid = grid;
            this.grid.robot = this;
            this.configObject = this.createConfigObject(this.grid);
            this.grid.configGrid.addObject(this.configObject);
        }
    }
    destroy() {
        if (this.carryingFruit)
            this.carryingFruit.destroy();
        super.destroy();
    }
}
Robot.ease = 'Cubic.easeInOut';
Robot.duration = 1000;
Robot.lookingX = [1, 0, -1, 0];
Robot.lookingY = [0, 1, 0, -1];
Robot.lookingBodyFrames = [["RightRaised", "DownRaised", "LeftRaised", "UpRaised"],
    ["RightLowered", "DownLowered", "LeftLowered", "UpLowered"]];
Robot.liftAndDropDistance = 32;
Robot.carryingHeight = 32;
const GRID_LEFT = 192;
const GRID_TOP = 32;
class SceneBase extends Phaser.Scene {
    constructor(codeInputId, playButtonId, resetButtonId, fastPlayButtonId, languageSelectId, config) {
        super({
            key: 'sceneA',
            active: true,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                }
            },
        });
        this.grids = [];
        this.gridIsCompletedByIndex = [];
        SceneBase.instance = this;
        window["SceneBaseInstance"] = this;
        this.codeInput = document.getElementById(codeInputId);
        this.playButton = document.getElementById(playButtonId);
        this.playButton.onclick = this.runCodeOnAllRobots.bind(this, [1]);
        this.resetButton = document.getElementById(resetButtonId);
        this.resetButton.onclick = this.resetButtonAction.bind(this);
        this.fastPlayButton = document.getElementById(fastPlayButtonId);
        this.fastPlayButton.onclick = this.runCodeOnAllRobots.bind(this, [5]);
        this.languageSelect = document.getElementById(languageSelectId);
        this.currentConfig = config;
    }
    preload() {
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
        if (this.languageSelect.value == "javascript") {
            let code = this.codeInput.value;
            try {
                for (let robot of this.robots) {
                    robot.runJSCode(code, this.setRobotCompleted.bind(this), playSpeed);
                }
            }
            catch (err) {
                alert(err.toString());
            }
        }
        if (this.languageSelect.value == "python") {
            Sk.builtins.ahead = new Sk.builtin.func(function (n, steps) {
                if (steps == undefined) {
                    steps = 1;
                }
                return new Sk.misceval.promiseToSuspension(SceneBase.instance.robots[n].aheadPromise(steps).then(() => Sk.builtin.none.none$));
            });
            Sk.builtins.back = new Sk.builtin.func(function (n, steps) {
                if (steps == undefined) {
                    steps = 1;
                }
                return new Sk.misceval.promiseToSuspension(SceneBase.instance.robots[n].backPromise(steps).then(() => Sk.builtin.none.none$));
            });
            Sk.builtins.right = new Sk.builtin.func(function (n, steps) {
                if (steps == undefined) {
                    steps = 1;
                }
                return new Sk.misceval.promiseToSuspension(SceneBase.instance.robots[n].rightPromise(steps).then(() => Sk.builtin.none.none$));
            });
            Sk.builtins.left = new Sk.builtin.func(function (n, steps) {
                if (steps == undefined) {
                    steps = 1;
                }
                return new Sk.misceval.promiseToSuspension(SceneBase.instance.robots[n].leftPromise(steps).then(() => Sk.builtin.none.none$));
            });
            Sk.builtins.lift = new Sk.builtin.func(function (n) {
                return new Sk.misceval.promiseToSuspension(SceneBase.instance.robots[n].liftPromise().then(() => Sk.builtin.none.none$));
            });
            Sk.builtins.drop = new Sk.builtin.func(function (n) {
                return new Sk.misceval.promiseToSuspension(SceneBase.instance.robots[n].dropPromise().then(() => Sk.builtin.none.none$));
            });
            Sk.builtins.peek = new Sk.builtin.func((n) => {
                let letter = SceneBase.instance.robots[n].peek(() => { });
                return new Sk.builtins['str'](letter);
            });
            for (let i = 0; i < this.robots.length; i++) {
                let code = this.codeInput.value;
                code = code.replace(/ahead\(/g, `ahead(${i},`);
                code = code.replace(/back\(/g, `back(${i},`);
                code = code.replace(/right\(/g, `right(${i},`);
                code = code.replace(/left\(/g, `left(${i},`);
                code = code.replace(/lift\(\)/g, `lift(${i})`);
                code = code.replace(/drop\(\)/g, `drop(${i})`);
                code = code.replace(/peek\(\)/g, `peek(${i})`);
                Sk.configure({
                    output: (s) => { console.log(s); },
                    killableWhile: true,
                    killableFor: true,
                    __future__: Sk.python3
                });
                let stopExecution = false;
                Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true), {
                    "*": () => {
                        if (stopExecution)
                            throw "Execution interrupted";
                    }
                }).catch(err => {
                    alert(err.toString());
                }).finally(() => {
                });
            }
        }
    }
    setRobotCompleted(robot) {
        let index = this.robots.indexOf(robot);
        this.gridIsCompletedByIndex[index] = true;
        if (this.gridIsCompletedByIndex.every(r => r)) {
            console.log("all complete");
            if (this instanceof SceneSolver)
                this.checkWinCondition();
        }
    }
    setAllRobotsIncomplete() {
        this.gridIsCompletedByIndex = this.robots.map(r => false);
    }
    resetButtonAction() {
        ;
        let x = GRID_LEFT;
        let y = GRID_TOP;
        this.grids.forEach(g => g.destroy());
        this.grids = [];
        for (let configGrid of this.currentConfig.configGrids) {
            let newGrid = new Grid(this, x, y, configGrid);
            this.grids.push(newGrid);
            x = newGrid.rightX + TILE_SIZE;
        }
        let lastGrid = this.grids[this.grids.length - 1];
        this.scale.resize(lastGrid.rightX + 2 * TILE_SIZE, Math.max(lastGrid.bottomY + TILE_SIZE, GAME_HEIGHT));
    }
    getContainingGrid(x, y) {
        for (let grid of this.grids) {
            if (grid.containsXY(x, y))
                return grid;
        }
        return null;
    }
}
class SceneBuilder extends SceneBase {
    constructor(codeInputId, playButtonId, resetButtonId, fastPlayButtonId, languageSelectId, config) {
        super(codeInputId, playButtonId, resetButtonId, fastPlayButtonId, languageSelectId, config);
        SceneBase.builderMode = true;
        config.resetGame = this.resetButtonAction.bind(this);
    }
    create() {
        super.create();
        this.add.existing(new Food(null, this, 32, 32, 1));
        this.add.existing(new Food(null, this, 32, 32 + 64, 2));
        this.add.existing(new Food(null, this, 32, 32 + 64 + 64, 3));
        this.add.existing(new Food(null, this, 32, 32 + 64 + 64 + 64, 4));
        this.add.existing(new Box(null, this, 96, 32, 5));
        this.add.existing(new Box(null, this, 96, 32 + 64, 6));
        this.add.existing(new Box(null, this, 96, 32 + 64 + 64, 7));
        this.add.existing(new Box(null, this, 96, 32 + 64 + 64 + 64, 8));
        this.resetButtonAction();
    }
}
class SceneSolver extends SceneBase {
    constructor(codeInputId, playButtonId, resetButtonId, fastPlayButtonId, languageSelectId, config) {
        super(codeInputId, playButtonId, resetButtonId, fastPlayButtonId, languageSelectId, config);
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
                if (!("ch" in window))
                    window["ch"] = new BroadcastChannel('teachometer-lesson');
                window["ch"].postMessage('foobot-' + this.firstMapAsString);
            }
            catch (e) {
            }
        }
    }
}
//# sourceMappingURL=foobot.js.map