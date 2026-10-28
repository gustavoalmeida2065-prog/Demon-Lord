import HouseScene from './scenes/HouseScene.js';

const config = {
  type: Phaser.AUTO,

  parent: 'game',

  width: 800,
  height: 600,

  backgroundColor: '#365b3d',

  pixelArt: true,

  render: {
    antialias: false
  },

  physics: {
    default: 'arcade',

    arcade: {
      debug: false,
      gravity: {
        x: 0,
        y: 0
      }
    }
  },

  scene: [HouseScene]
};

new Phaser.Game(config);
