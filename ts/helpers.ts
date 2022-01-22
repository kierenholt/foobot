

var helpersMaker = function() {

    //HASHING
    //http://programmers.stackexchange.com/questions/49550/which-hashing-algorithm-is-best-for-uniqueness-and-speed
    var objToHash = function(obj, hash?) {
      if (hash == undefined) { hash = 34898410941; }
      return stringToHash(JSON.stringify(obj),hash);
    }
    
    var stringToHash = function(str, hash?) {
        if (hash == undefined) { hash = 34898410941 };
        if (str.length == 0) {
            return hash;
        }
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }


    var createUID = function() {
      return 'ID' + Math.random().toString(36).substr(2, 16);
    }

    //arrays
    var shuffleInPlace = function(a, random: Random) {
        for (var i = a.length-1; i > 0; i--) {
            let index = random.next(i);
            a.push(a.splice(index, 1)[0]);
            //this.appendChildElement(this._childNodes[random.next(this._childNodes.length)]);
        }
        return a;
    }

    var toShuffled = function(a, random: Random) {
      let ret = [];
      for (let item of a) {
          let index = random.next(a.length);
          while(ret[index]) {index++; index %= a.length}
          ret[index] = item;
      }
      return ret;
    }

    //strings
    
    var trimChar = function(str,char) {
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
      return str.substring(i,j+1);
    }

    var IsStringNullOrEmpty = function(str) {
      return (str == undefined || str == null || typeof(str) != "string" || str.length === 0 || !str.trim());
    };
    
    var IsStringNullOrWhiteSpace = function(str) {
        return str == undefined || str == null || typeof(str) != "string" || str == "" || str.trim().length == 0;
    }

    
    var startsWith = function(a,ai,b,bi) {
      if (ai == 0 && bi != 0) {
        return false;
      }
      if (bi == 0) {
        return a[ai] == b[bi];
      }
      return a[ai] == b[bi] && startsWith(a,ai-1,b,bi-1);
    }

    var replaceAll = function(within,toReplace,replaceWith) {
      var ret = "";
      var i = 0;
      var toReplaceLength = toReplace.length;
      while (i < within.length) {
        if (startsWith(within,i+toReplaceLength-1,toReplace,toReplaceLength-1)) {
          ret += replaceWith;
          i+=toReplaceLength;
        }
        else {
          ret += within[i];
          i+= 1;
        }
      } 
      return ret;
    }


    var stripQuotes = function(str) {
        if (str.charAt(0) === '"' && str.charAt(str.length-1) === '"') {
            return str.substr(1, str.length-2);
        }
        return str.toString();
    }
  

    //numbers
    var removeCrazySigFigs = function(n):string {
      return Number(parseFloat(n).toPrecision(12)).toString();
    }

    var isNumeric = function(str) {
      return !isNaN(parseFloat(str)) && isFinite(str);
    }


    var getDomainFromUrl = function(url) {
      var a = document.createElement('a');
      a.setAttribute('href', url);
      return a.hostname;
    }

    //ARRAYS
    var insertAfter = function(arr, ref, item) {
      let index = arr.indexOf(ref);
      if (index == -1) throw ("reference item not found in array");
      arr = arr.splice(index + 1,0,item);
    }

    var insertBefore = function(arr, ref, item) {
      let refIndex = arr.indexOf(ref);
      if (refIndex == -1) throw ("reference item not found in array");
      arr = arr.splice(refIndex,0,item);
    }

    var deepInsertBefore = function(arr, ref, item) {
      let refIndex = deepIndexOf(arr,ref);
      if (refIndex == -1) throw ("reference item not found in array");
      arr = arr.splice(refIndex,0,item);
    }

    var getUniqueItems = function(arr) : any[] {
      let ret = [];
      for (let item of arr) {
        if (ret.indexOf[item] == -1) ret.push(item);
      }
      return ret;
    }

    var replaceItem = function(arr,oldItem,newItem) {
      let index = arr.indexOf(oldItem);
      if (index != -1) arr[index] = newItem;
    }
    
    var deepIndexOf = function(arr,item) {
      for (let i = 0; i < arr.length; i++) {
        if (deepCompare(item,arr[i])) return i;
      }
      return -1;
    }

    var deepReplaceItem = function(arr,oldItem,newItem) {
      let index = deepIndexOf(arr,oldItem);
      if (index != -1) arr[index] = newItem;
    }

    var getItemImmediatelyBefore = function(arr, after) {
      let index = arr.indexOf(after);
      return index == -1 ? undefined : arr[index-1];
    }

    var getItemImmediatelyAfter = function(arr, after) {
      let index = arr.indexOf(after);
      return index == -1 ? undefined : arr[index+1];
    }
    
    var getRandomItem = function(arr) {
      let index = Math.floor(Math.random() * arr.length);
      return arr[index];
    }

    //removes all instances not just the first
    var removeFromArray = function(array, item) {
      for (let i = array.length; i >= 0 ; i--) {
        if (array[i] == item) { array.splice(i, 1); }
      }
    }

    //removes one instance
    var removeFromArrayOnce = function(array, item) {
      for (let i = array.length; i >= 0 ; i--) {
        if (array[i] == item) { array.splice(i, 1); return; }
      }
    }

    var deepRemoveFromArrayOnce = function(array, item) {
      for (let i = array.length; i >= 0 ; i--) {
        if (deepCompare(array[i],item)) { array.splice(i, 1); return; }
      }
    }
    
    var deepRemoveFromArray = function(array, item) {
      for (let i = array.length; i >= 0 ; i--) {
        if (deepCompare(item,array[i])) { array.splice(i, 1); }
      }
    }



    var lowerCaseLetterFromIndex = function(i: number) { return String.fromCharCode(97 + i); }

    var lengthOfObject = function(obj: any) {
      let ret = 0;
      for (let key in obj) { ret++ }
      return ret;
    }

    var getValuesFromObject = function(obj: any) {
      let ret = [];
      for (let key in obj) { ret.push(obj[key]) }
      return ret;
    }

    var getKeysFromObject = function(obj: any) {
      let ret = [];
      for (let key in obj) { ret.push(key) }
      return ret;
    }
    
    var getKeyFromValue = function(obj, value) {
      for (let key in obj) { if (obj[key] == value) return key }
    }

    var mergeObjects = function(obj1, obj2) {
      let ret = {};
      for (let key in obj1) {
        ret[key] = obj1[key];
      }
      for (let key in obj2) {
        ret[key] = obj2[key];
      }
      return ret;
    }

    var copyObject = function(obj1) {
      return JSON.parse(JSON.stringify(obj1))
    }
      
    var deepCompare = function(obj1,obj2) {
      if (typeof(obj1) != typeof(obj2)) return false;
      if (typeof(obj1) == "object") {
        for (let key in obj1) {
          if (!(key in obj2) || !deepCompare(obj1[key], obj2[key])) return false;
        }
        return true;
      }
      return obj1 == obj2;
      
    }

    var deepRemoveDuplicatesUsingHash = function(arr) {
      let obj = {};
      for (let i = 0; i < arr.length; i++) {
        obj[arr[i].toString()] = arr[i];
      }
      return helpers.getValuesFromObject(obj);
    }

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




/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */
class Random {
  _seed: number;
  constructor(seed?: number) {
    if (!seed) {this._seed = Random.generateSeed()}
    else { this._seed = seed }
    this._seed = this._seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
    //console.log(this._seed);
  }
  
  next(limit?) {
    if (limit == undefined) {
      limit =  2147483647;
    }
    this._seed = this._seed * 16807 % 2147483647;
    return this._seed % limit;
  }

  static generateSeed():number {
    let now = new Date();
    let seed = now.getTime();
    seed = seed % 2147483647;
    if (seed <= 0) seed += 2147483646;
    return seed;
  }
}
  
  