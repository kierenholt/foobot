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
    constructor(grid, scene, x, y, typeNumber, texture, frame) {
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
    }
    get mapCoords() {
        if (!this.grid)
            throw "no grid";
        return this.grid.getMapCoordsFromXY(this.x, this.y);
    }
}
class Floor extends GridSprite {
    constructor(grid, scene, x, y) {
        super(grid, scene, x, y, -1, "floor", helpers.getRandomItem(floorMapTextureCodes));
    }
}
class DraggableGridSprite extends GridSprite {
    constructor(grid, scene, x, y, typeNumber, texture, frame) {
        super(grid, scene, x, y, typeNumber, texture, frame);
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
                this.getGridGroup().remove(this);
                SceneBase.instance.removeObjectFromGridConfig(this.grid, this.mapCoords);
                this.grid = null;
                SceneBase.instance.updateCurrentConfigFromSprites();
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
                let box = this.grid.getFoodOrBoxAtXY(destX, destY);
                if (box && this instanceof Food) {
                    box.acceptFruit(this);
                }
                else {
                    this.x = destX;
                    this.y = destY;
                    this.notYetInGrid = false;
                    this.getGridGroup().add(this);
                }
                SceneBase.instance.updateCurrentConfigFromSprites();
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
    constructor(grid, scene, x, y, typeNumber) {
        super(grid, scene, x, y, typeNumber, "food", mapTextureCodes[typeNumber]);
        this.setScale(FOOD_SCALE);
    }
    get letterForPeek() {
        return ["a", "b", "c", "d"][this.typeNumber - 1];
    }
    clone() { return new Food(null, this.scene, this.x, this.y, this.typeNumber); }
    getGridGroup() { return this.grid.food; }
    destroy() {
        if (this.grid)
            this.getGridGroup().remove(this);
        super.destroy();
    }
}
class Box extends DraggableGridSprite {
    constructor(grid, scene, x, y, typeNumber) {
        super(grid, scene, x, y, typeNumber, "boxes", mapTextureCodes[typeNumber]);
        this._containsFruit = (typeNumber > 8);
    }
    get letterForPeek() {
        return ["A", "B", "C", "D"][this.typeNumber - 5];
    }
    clone() { return new Box(null, this.scene, this.x, this.y, this.typeNumber); }
    getGridGroup() { return this.grid.boxes; }
    destroy() {
        super.destroy();
        if (this.grid)
            helpers.removeFromArray(this.grid.boxes, this);
    }
    matchesFoodType(food) {
        return food.typeNumber == this.typeNumber - 4;
    }
    acceptFruit(item) {
        if (!this.matchesFoodType(item))
            throw ("does not match food type");
        item.destroy();
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
        this.width = width;
        this.height = height;
        this.objects = objects;
    }
    toBase64() {
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
            objects.push(ConfigObject.fromBase64(str.substring(i, i + 2)));
        }
        return new ConfigGrid(width, height, objects);
    }
    setWidth(value) {
        this.width = value;
        let deepCopy = [...this.objects];
        for (let o of deepCopy) {
            if (o.mapCoords[0] >= value) {
                if (o.typeNumber == 0) {
                    o.mapCoords = [value - 1, o.mapCoords[1]];
                    this.removeFood([value - 1, o.mapCoords[1]]);
                }
                else {
                    helpers.removeFromArray(this.objects, o);
                }
            }
        }
    }
    setHeight(value) {
        this.height = value;
        let deepCopy = [...this.objects];
        for (let o of deepCopy) {
            if (o.mapCoords[1] >= value) {
                if (o.typeNumber == 0) {
                    this.removeFood([o.mapCoords[0], value - 1]);
                    o.mapCoords = [o.mapCoords[0], value - 1];
                }
                else {
                    helpers.removeFromArray(this.objects, o);
                }
            }
        }
    }
    removeFood(mapCoords) {
        for (let o of this.objects) {
            if (o.mapCoords[0] == mapCoords[0] && o.mapCoords[1] == mapCoords[1]) {
                helpers.removeFromArray(this.objects, o);
            }
        }
    }
}
class Config {
    constructor(configGrids) {
        this.configGrids = configGrids;
    }
    toBase64() {
        let ret = "";
        for (let grid of this.configGrids) {
            ret += Config.RADIX[grid.objects.length - 1];
            ret += grid.toBase64();
        }
        return ret;
    }
    static fromBase64(str) {
        let grids = [];
        let i = 0;
        while (i < str.length) {
            let numObjects = Config.RADIX.indexOf(str[i]) + 1;
            let str2 = str.substring(i + 1, i + 1 + numObjects * 2 + 1);
            grids.push(ConfigGrid.fromBase64(str2));
            i += numObjects * 2 + 1 + 1;
        }
        return new Config(grids);
    }
}
Config.RADIX = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const GAME_WIDTH = 704;
const GAME_HEIGHT = 400;
class fooBotBuilder extends Phaser.Game {
    constructor(levelMapInputId, parentId, codeInputId, playButtonId, resetButtonId, setWidthSliderId, setHeightSliderId) {
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
            scene: [new SceneBuilder(levelMapInputId, codeInputId, playButtonId, resetButtonId, setWidthSliderId, setHeightSliderId, window.location.search.substring(1))]
        };
        super(config);
    }
}
class fooBotSolver extends Phaser.Game {
    constructor(parentId, codeInputId, playButtonId, resetButtonId) {
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
            scene: [new SceneSolver(codeInputId, playButtonId, resetButtonId, window.location.search.substring(1))]
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
        this.reset(configGrid);
    }
    reset(configGrid) {
        this.widthInSquares = configGrid.width;
        this.heightInSquares = configGrid.height;
        this.floors.clear(true, true);
        this.food.clear(true, true);
        this.boxes.clear(true, true);
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
                this.robot = new Robot(this, this.scene, coords[0], coords[1]);
                this.robot.lookingIndex = 0;
                if (this.robot.carryingFruit)
                    this.robot.carryingFruit.destroy();
                this.robot.isScoopDown = true;
            }
            else if (object.typeNumber >= 1 && object.typeNumber <= 4) {
                let newFood = new Food(this, this.scene, coords[0], coords[1], object.typeNumber);
                newFood.notYetInGrid = false;
                this.food.add(newFood);
            }
            else if (object.typeNumber >= 5 && object.typeNumber <= 12) {
                let newBox = new Box(this, this.scene, coords[0], coords[1], object.typeNumber);
                newBox.notYetInGrid = false;
                this.boxes.add(newBox);
            }
            else {
                throw ("bad typenumber");
            }
        }
    }
    getConfigGrid() {
        let objects = [];
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
            if (foodOrBoxAlreadyThere instanceof Box && item instanceof Food) {
                if (!foodOrBoxAlreadyThere.containsFruit && foodOrBoxAlreadyThere.matchesFoodType(item)) {
                    return true;
                }
            }
            return false;
        }
        if (this.robot.x == destX && this.robot.y == destY) {
            return false;
        }
        return true;
    }
    checkWinCondition() {
        return this.boxes.getChildren().every(b => b.containsFruit);
    }
    destroy() {
        this.food.clear(true, true);
        this.boxes.clear(true, true);
        if (this.robot)
            this.robot.destroy();
        this.floors.clear(true, true);
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
    constructor(grid, scene, x, y) {
        super(grid, scene, x, y, 1, "body", "RightLowered");
        this._lookingIndex = 0;
        this.isScoopDown = true;
        this.setDepth(10);
        this.isDragging = false;
        this.scene.input.setDraggable(this.setInteractive());
        this.on('drag', this.onDrag.bind(this));
        this.on('dragend', this.dragEnd.bind(this));
    }
    ahead(onComplete, repeats) {
        if (this.lookingXY == null) {
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
        if (this.lookingBehindXY == null) {
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
        return null;
    }
    raise(onComplete) {
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
                    fruit.getGridGroup().remove(fruit);
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
    lower(onComplete) {
        if (this.isScoopDown) {
            if (onComplete)
                onComplete();
            return;
        }
        let lowerScoopInjector = function (paramOnCompleteTween, robot, fruit, coords, paramCanDrop) {
            var paramOnCompleteTween = paramOnCompleteTween;
            var robot = robot;
            let dropCoords = coords;
            var canDrop = paramCanDrop;
            return () => {
                if (fruit) {
                    if (canDrop) {
                        let box = robot.grid.getFoodOrBoxAtXY(dropCoords[0], dropCoords[1]);
                        if (box) {
                            box.acceptFruit(fruit);
                        }
                        else {
                            fruit.setPosition(dropCoords[0], dropCoords[1]);
                            fruit.grid = robot.grid;
                            fruit.getGridGroup().add(fruit);
                        }
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
        moveTowardsTween.on("complete", lowerScoopInjector(moveAwayTween, this, droppedFruit, dropCoords, canDrop));
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
        let found = this.grid.getFoodOrBoxAtXY(lookingCoords[0], lookingCoords[1]);
        if (found instanceof Food)
            return found;
        return null;
    }
    getMoveTowardsFruitTween() {
        return this.scene.tweens.create({
            targets: this.carryingFruit ? [this, this.carryingFruit] : this,
            x: "+= " + (this.isSideView ? Robot.lookingX[this.lookingIndex] * Robot.raiseAndLowerDistance : 0),
            y: "+= " + (this.isSideView ? 0 : Robot.lookingY[this.lookingIndex] * Robot.raiseAndLowerDistance),
            duration: Robot.duration / 2, ease: Robot.ease, repeat: 0, yoyo: false, paused: false
        });
    }
    getMoveAwayFomFruitTween() {
        return this.scene.tweens.create({
            targets: this.carryingFruit ? [this, this.carryingFruit] : this,
            x: "-= " + (this.isSideView ? Robot.lookingX[this.lookingIndex] * Robot.raiseAndLowerDistance : 0),
            y: "-= " + (this.isSideView ? 0 : Robot.lookingY[this.lookingIndex] * Robot.raiseAndLowerDistance),
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
                SceneBase.instance.removeObjectFromGridConfig(this.grid, this.mapCoords);
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
            SceneBase.instance.updateCurrentConfigFromSprites();
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
Robot.raiseAndLowerDistance = 32;
Robot.carryingHeight = 32;
const GRID_LEFT = 192;
const GRID_TOP = 32;
class SceneBase extends Phaser.Scene {
    constructor(codeInputId, playButtonId, resetButtonId) {
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
        this.codeInput = document.getElementById(codeInputId);
        this.playButton = document.getElementById(playButtonId);
        this.resetButton = document.getElementById(resetButtonId);
        this.playButton.onclick = this.runCodeOnAllRobots.bind(this);
        this.resetButton.onclick = this.resetButtonAction.bind(this);
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
    runCodeOnAllRobots() {
        this.resetButtonAction();
        let code = this.codeInput.value;
        for (let robot of this.robots) {
            robot.runCode(code, this.setRobotCompleted.bind(this));
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
            y += newGrid.heightInSquares * TILE_SIZE + 64;
        }
    }
    getContainingGrid(x, y) {
        for (let grid of this.grids) {
            if (grid.containsXY(x, y))
                return grid;
        }
        return null;
    }
    removeObjectFromGridConfig(grid, mapCoords) {
        let gridIndex = this.grids.indexOf(grid);
        this.currentConfig.configGrids[gridIndex].removeFood(mapCoords);
    }
}
class SceneBuilder extends SceneBase {
    constructor(levelMapSpanId, codeInputId, playButtonId, resetButtonId, setWidthSliderId, setHeightSliderId, mapAsString) {
        super(codeInputId, playButtonId, resetButtonId);
        SceneBase.builderMode = true;
        this.levelMapAnchor = document.getElementById(levelMapSpanId);
        this.setWidthSlider = document.getElementById(setWidthSliderId);
        this.setWidthSlider.oninput = this.setGridWidths.bind(this);
        this.setHeightSlider = document.getElementById(setHeightSliderId);
        this.setHeightSlider.oninput = this.setGridHeights.bind(this);
        if (mapAsString && mapAsString.length > 0) {
            this.currentConfig = Config.fromBase64(mapAsString);
        }
        else {
            let objects = [];
            objects.push(new ConfigObject([0, 1], 0));
            let grid1 = new ConfigGrid(3, 3, objects);
            this.currentConfig = new Config([grid1]);
        }
        this.levelMapAnchor.innerHTML = "solver.html?" + this.currentConfig.toBase64();
        this.levelMapAnchor.href = "solver.html?" + this.currentConfig.toBase64();
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
    constructor(codeInputId, playButtonId, resetButtonId, mapAsString) {
        super(codeInputId, playButtonId, resetButtonId);
        SceneBase.builderMode = false;
        this.currentConfig = Config.fromBase64(mapAsString);
        this.firstMapAsString = mapAsString;
        if (mapAsString && mapAsString.length > 0) {
            this.currentConfig = Config.fromBase64(mapAsString);
        }
        else {
            let objects = [];
            objects.push(new ConfigObject([0, 1], 0));
            let grid1 = new ConfigGrid(3, 3, objects);
            this.currentConfig = new Config([grid1]);
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