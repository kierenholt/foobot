
const GAME_WIDTH = 704;
const GAME_HEIGHT = 400;

class fooBotBuilder extends Phaser.Game {

  constructor(levelMapInputId,
    parentId,
    codeInputId,
    playButtonId,
    resetButtonId,
    setWidthSliderId,
    setHeightSliderId) {

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

      scene   : [ new SceneBuilder(levelMapInputId, 
        codeInputId,
        playButtonId,
        resetButtonId,
        setWidthSliderId,
        setHeightSliderId,
        window.location.search.substring(1)) ]
    };
    super(config);
  }
}


class fooBotSolver extends Phaser.Game {

  constructor(
    parentId,
    codeInputId,
    playButtonId,
    resetButtonId) {

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
        window.location.search.substring(1)) ]
    };
    super(config);
  }
}

