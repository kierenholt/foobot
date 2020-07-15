


class myGame extends Phaser.Game {
    constructor() {
      let config = {
      
        type    : Phaser.CANVAS,
        width   : RippleTank.instance.imageWidth + RippleTank.LEFT_PADDING,
        height  : RippleTank.instance.imageHeight,
            
        autoFocus: true,
  
        transparent: true,
        parent  : 'gameDiv',
        
        url     : '',
        title   : 'Blue Ripple tank',
        version : '0.0.1', 
  
        scene   : [ new Scene1() ],
  
        canvas: document.getElementById("objects") as HTMLCanvasElement
      };
      super(config);
  
    }
  }
    
    