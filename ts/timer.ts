class CountUpTimer {
    span: HTMLSpanElement;
    msElapsed: number;
    static instance: CountUpTimer;
    constructor(span) {
        CountUpTimer.instance = this; 
        this.span = span;
        this.msElapsed = 0;
        this.span.innerHTML = this.timerText;
    }

    timestep() {
        this.msElapsed += 1000 / RippleTank.FRAMES_PER_SECOND;
        this.span.innerHTML = this.timerText;
    }

    get timerText() {
        let ms = this.msElapsed;
        var hours = Math.floor(ms / 3600000);
        var hoursString = hours.toString();
        ms -= hours * 3600000;

        var minutes = Math.floor(ms / 60000) % 60;
        var minutesString = minutes.toString();
        ms -= minutes * 60000;

        var seconds = Math.floor(ms / 1000) % 60;  // in theory the modulus is not required
        var secondsString = seconds.toString();
        ms -= seconds * 1000;

        ms = Math.floor(ms);
        var msString = ms.toString();

        return (hours ? this.padLeftZeroes(hoursString,1) + "h"  : "") + 
            this.padLeftZeroes(minutesString,2) +  "m" +
            this.padLeftZeroes(secondsString,2) + "s" + 
            this.padLeftZeroes(msString,3) + "ms";
    }

    padLeftZeroes(str,num) {
        while (str.length < num) {
            str = "0" + str;
        }
        return str;
    }

    reset() {

        this.msElapsed = 0;
        this.span.innerHTML = this.timerText;
    }
}