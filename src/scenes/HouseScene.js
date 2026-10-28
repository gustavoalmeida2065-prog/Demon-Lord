export default class HouseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HouseScene' });
  }

  create() {
    // Cenário externo
    this.add.rectangle(
      400, 300, 800, 600, 0x365b3d
    );

    // Grama decorativa
    const grass = this.add.graphics();

    grass.fillStyle(0x477447, 0.85);

    for (let i = 0; i < 150; i++) {
      const x = Phaser.Math.Between(12, 788);
      const y = Phaser.Math.Between(12, 588);

      grass.fillRect(x, y, 3, 3);
    }

    // Estrutura externa da casa
    this.add.rectangle(
      400, 300, 470, 350, 0x29231f
    ).setStrokeStyle(8, 0x4b3022);

    // Piso da casa
    this.add.rectangle(
      400, 300, 438, 318, 0xc9a878
    );

    // Desenho das tábuas do piso
    const floor = this.add.graphics();

    floor.lineStyle(1, 0xb28e61, 0.7);

    for (let x = 190; x <= 610; x += 32) {
      floor.lineBetween(x, 145, x, 455);
    }

    for (let y = 145; y <= 455; y += 32) {
      floor.lineBetween(180, y, 620, y);
    }

    // Tapete
    this.add.rectangle(
      400, 330, 150, 95, 0x8f3434
    ).setStrokeStyle(4, 0x5c2424);

    // Móveis superiores
    this.add.rectangle(
      285, 190, 90, 42, 0x6d472e
    ).setStrokeStyle(4, 0x3e291c);

    this.add.rectangle(
      515, 190, 90, 42, 0x6d472e
    ).setStrokeStyle(4, 0x3e291c);

    // Móvel azul
    this.add.rectangle(
      270, 405, 60, 28, 0x477c9a
    ).setStrokeStyle(3, 0x25495d);

    // Grupo de colisões
    this.walls = this.physics.add.staticGroup();

    // Paredes
    this.addWall(400, 132, 470, 24);
    this.addWall(400, 468, 470, 24);
    this.addWall(165, 300, 24, 350);
    this.addWall(635, 300, 24, 350);

    // Colisões dos móveis
    this.addWall(285, 190, 100, 50);
    this.addWall(515, 190, 100, 50);
    this.addWall(270, 405, 70, 36);

    // Porta decorativa
    this.add.rectangle(
      400, 465, 60, 10, 0x5b3926
    );

    // Criar o personagem
    this.createPlayer();

    // Colisão entre personagem e paredes
    this.physics.add.collider(
      this.player,
      this.walls
    );

    // Controles do teclado
    this.cursors = this.input.keyboard.createCursorKeys();

    this.keys = this.input.keyboard.addKeys(
      'W,A,S,D'
    );

    // Título da cena
    this.add.text(400, 42, 'CASA', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: {
        x: 8,
        y: 5
      }
    }).setOrigin(0.5);

    // Instruções
    this.add.text(
      400,
      530,
      'Use as setas ou WASD para andar',
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: {
          x: 8,
          y: 5
        }
      }
    ).setOrigin(0.5);
  }

  createPlayer() {
    // Criar uma textura simples sem imagens externas
    const graphics = this.make.graphics({
      x: 0,
      y: 0,
      add: false
    });

    // Sombra
    graphics.fillStyle(0x000000, 0.25);
    graphics.fillEllipse(16, 39, 22, 8);

    // Cabelo
    graphics.fillStyle(0x4a2c1d);
    graphics.fillRect(8, 3, 16, 12);

    // Rosto
    graphics.fillStyle(0xe0b18a);
    graphics.fillRect(9, 8, 14, 13);

    // Corpo
    graphics.fillStyle(0x315f9b);
    graphics.fillRect(6, 21, 20, 13);

    // Braços
    graphics.fillStyle(0xe0b18a);
    graphics.fillRect(2, 22, 5, 12);
    graphics.fillRect(25, 22, 5, 12);

    // Pernas
    graphics.fillStyle(0x30303a);
    graphics.fillRect(8, 33, 6, 7);
    graphics.fillRect(19, 33, 6, 7);

    // Registrar a textura
    graphics.generateTexture(
      'player-placeholder',
      32,
      42
    );

    graphics.destroy();

    // Criar o personagem com física
    this.player = this.physics.add.sprite(
      400,
      350,
      'player-placeholder'
    );

    this.player.setDepth(5);

    this.player.setCollideWorldBounds(true);

    this.player.body.setSize(18, 22);
  }

  addWall(x, y, width, height) {
    const wall = this.add.rectangle(
      x,
      y,
      width,
      height,
      0x000000,
      0
    );

    this.physics.add.existing(wall, true);

    this.walls.add(wall);

    return wall;
  }

  update() {
    const speed = 160;

    const left =
      this.cursors.left.isDown ||
      this.keys.A.isDown;

    const right =
      this.cursors.right.isDown ||
      this.keys.D.isDown;

    const up =
      this.cursors.up.isDown ||
      this.keys.W.isDown;

    const down =
      this.cursors.down.isDown ||
      this.keys.S.isDown;

    let vx = 0;
    let vy = 0;

    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    // Evitar que o personagem ande mais rápido na diagonal
    const direction = new Phaser.Math.Vector2(
      vx,
      vy
    );

    if (direction.length() > 0) {
      direction.normalize();
    }

    this.player.setVelocity(
      direction.x * speed,
      direction.y * speed
    );
  }
}
