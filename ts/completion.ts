class Completion {
    completedCodes = [];
    preferredLanguage = "";
    static instance: Completion;

    constructor(languageSelectId) {
        //get any completion data from localstorage
        if (localStorage) {
            let json = localStorage.getItem("foobot");
            if (json) {
                let obj = JSON.parse(json);
                this.completedCodes = obj["completed"];
                this.preferredLanguage = obj["preferredLanguage"];
            }
        } 
        //register listener for completion events in other tabs
        if (!("ch" in window)) {
            let ch = new BroadcastChannel('teachometer-lesson');
            ch.addEventListener('message', function(_completionInstance) {
                var completion = _completionInstance;
                return (e) => {
                    //typical message text: foobot-I000 where I000 is mapstring
                    if (e.data.substring(0,6) == "foobot") {
                        completion.add(e.data.substring(7));
                        completion.updateAllBoxes();
                        completion.save();
                    }
                }
            }(this)
            );
        }
        //register onchange event for language select box
        let languageSelect = document.getElementById(languageSelectId) as HTMLSelectElement;
        if (languageSelect) {
            if (this.preferredLanguage != "") {
                languageSelect.value = this.preferredLanguage;
            }
            languageSelect.onchange = (e) => {
                this.preferredLanguage = languageSelect.value;
                this.save();
            };
        }

        //if index.html, turns completed levels into filled boxes
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
            localStorage.setItem("foobot",JSON.stringify(obj));
        }
        else {
            throw("no local storage");
        }
    }

    static boxLetters = ["a","b","c","d"];
    static boxFullImages = ["pageImages/a-full.png","pageImages/b-full.png","pageImages/c-full.png","pageImages/d-full.png"];
    static boxEmptyImages = ["pageImages/a-empty.png","pageImages/b-empty.png","pageImages/c-empty.png","pageImages/d-empty.png"];

    updateAllBoxes() {
        //if image.alt matches a b c or d then change the image 
        //image.id = mapstring
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