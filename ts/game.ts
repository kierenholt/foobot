
const GAME_WIDTH = 700;
const GAME_HEIGHT = 300;

class fooBotBuilder extends Phaser.Game {

  constructor(levelMapInputId,
    parentId,
    codeInputId,
    playButtonId,
    resetButtonId,
    setWidthSliderId,
    setHeightSliderId,
    setNumGridsId,
    fastPlayButtonId) {

    let config = { 
    
      type    : Phaser.AUTO,
      width   : GAME_WIDTH,
      height  : GAME_HEIGHT,
          
      autoFocus: true,

      transparent: true,
      parent: parentId,
      
      url     : '',
      title   : 'foobot',
      version : '0.0.1', 
      physics: {
          default: 'arcade'
      },

      scale: {
        min: {
          height: GAME_HEIGHT
        }
      },

      scene   : [ new SceneBuilder(levelMapInputId, 
        codeInputId,
        playButtonId,
        resetButtonId,
        setWidthSliderId,
        setHeightSliderId,
        setNumGridsId,
        window.location.search.substring(1),
        fastPlayButtonId) ]
    };
    super(config);
  }
}


class fooBotSolver extends Phaser.Game {

  constructor(
    parentId,
    codeInputId,
    playButtonId,
    resetButtonId,
    fastPlayButtonId) {

    let config = { 
    
      type    : Phaser.AUTO,
      width   : GAME_WIDTH,
      height  : GAME_HEIGHT,
          
      autoFocus: true,

      transparent: true,
      parent: parentId,
      
      url     : '',
      title   : 'foobot',
      version : '0.0.1', 
      physics: {
          default: 'arcade'
      },

      scene   : [ new SceneSolver(
        codeInputId,
        playButtonId,
        resetButtonId,
        window.location.search.substring(1),
        fastPlayButtonId) ]
    };
    super(config);
  }
}

