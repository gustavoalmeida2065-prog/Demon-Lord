export default class HouseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HouseScene' });
  }

  create() {
    // Paleta de cores
    this.colors = {
      grass: 0x263d2b,
      grassLight: 0x405638,
      grassDark: 0x1c3022,
      wall: 0x493126,
      wallLight: 0x755039,
      wood: 0x805333,
      woodLight: 0xb08050,
      woodDark: 0x38251b,
      floor: 0x795538,
      floorLight: 0x956b46,
      gold: 0xd2ad66,
      cream: 0xe6d4b2,
      red: 0x792f32,
      redDark: 0x482126,
      green: 0x557747
    };

    this.physics.world.setBounds(0, 0, 800, 600);

    // Textura utilizada nas colisões invisíveis
    const pixel = this.make.graphics({ x: 0, y: 0, add: false });
    pixel.fillStyle(0xffffff, 1);
    pixel.fillRect(0, 0, 2, 2);
    pixel.generateTexture('collision-pixel', 2, 2);
    pixel.destroy();

    this.walls = this.physics.add.staticGroup();
    this.furniture = this.physics.add.staticGroup();

    this.drawExterior();
    this.drawHouse();
    this.drawFloor();
    this.drawWindow();
    this.drawBed();
    this.drawDesk();
    this.drawBookshelf();
    this.drawCabinet();
    this.drawTable();
    this.drawChest();
    this.drawPlants();
    this.drawLamps();
    this.drawRug();

    this.createCollisions();
    this.createPlayer();
    this.createUI();

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.furniture);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.keys = this.input.keyboard.addKeys({
      up: 'W',
      down: 'S',
      left: 'A',
      right: 'D'
    });
  }

  // =====================================================
  // EXTERIOR
  // =====================================================

  drawExterior() {
    this.add.rectangle(400, 300, 800, 600, this.colors.grass);

    const grass = this.add.graphics();

    for (let i = 0; i < 500; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 600);

      grass.fillStyle(
        Phaser.Math.RND.pick([
          this.colors.grassLight,
          this.colors.grassDark,
          0x354a30,
          0x4a6038
        ]),
        Phaser.Math.FloatBetween(0.3, 0.8)
      );

      grass.fillRect(x, y, 2, 3);
    }

    // Pequenas flores
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(10, 790);
      const y = Phaser.Math.Between(10, 590);

      if (x > 155 && x < 645 && y > 115 && y < 485) {
        continue;
      }

      this.add.rectangle(
        x,
        y,
        3,
        3,
        Phaser.Math.RND.pick([
          0xe4d6ad,
          0xd5a5a0,
          0xe4c76b
        ])
      );
    }

    // Caminho de pedras até a entrada
    for (let i = 0; i < 7; i++) {
      this.add.rectangle(
        400 + (i % 2) * 8,
        490 + i * 13,
        25,
        10,
        0x756b58
      ).setStrokeStyle(1, 0x514a3c);
    }

    // Cerca
    const fence = this.add.graphics();
    fence.fillStyle(0x65432e, 1);

    for (let x = 15; x < 155; x += 30) {
      fence.fillRect(x, 260, 5, 45);
    }

    fence.fillRect(15, 269, 140, 5);
    fence.fillRect(15, 290, 140, 5);

    for (let x = 645; x < 790; x += 30) {
      fence.fillRect(x, 260, 5, 45);
    }

    fence.fillRect(645, 269, 145, 5);
    fence.fillRect(645, 290, 145, 5);
  }

  // =====================================================
  // HOUSE STRUCTURE
  // =====================================================

  drawHouse() {
    // Sombra da construção
    this.add.rectangle(
      405, 307, 490, 370, 0x101810, 0.65
    );

    // Estrutura externa
    this.add.rectangle(
      400, 300, 470, 350, this.colors.wall
    ).setStrokeStyle(8, 0x261b17);

    // Parede superior
    this.add.rectangle(
      400, 145, 438, 35, this.colors.wallLight
    );

    // Detalhes das pedras
    const bricks = this.add.graphics();
    bricks.lineStyle(1, 0x39271f, 0.8);

    for (let y = 132; y < 165; y += 11) {
      bricks.lineBetween(185, y, 615, y);
    }

    for (let y = 132; y < 165; y += 11) {
      for (let x = 190; x < 615; x += 35) {
        bricks.lineBetween(x, y, x, y + 11);
      }
    }

    // Vigas
    this.add.rectangle(
      400, 125, 470, 12, this.colors.woodDark
    );

    this.add.rectangle(
      400, 136, 470, 5, this.colors.woodLight
    );

    // Rodapés
    this.add.rectangle(
      400, 455, 438, 8, this.colors.woodDark
    );

    this.add.rectangle(
      181, 300, 8, 310, this.colors.woodDark
    );

    this.add.rectangle(
      619, 300, 8, 310, this.colors.woodDark
    );

    // Pilares
    for (const x of [170, 630]) {
      this.add.rectangle(x, 300, 15, 350, this.colors.woodDark);
      this.add.rectangle(x, 300, 5, 350, this.colors.woodLight);
    }

    // Porta de entrada
    this.add.rectangle(
      420, 458, 60, 12, this.colors.woodDark
    );

    this.add.rectangle(
      420, 455, 52, 7, this.colors.woodLight
    );

    this.add.circle(439, 455, 2, this.colors.gold);
  }

  // =====================================================
  // FLOOR
  // =====================================================

  drawFloor() {
    this.add.rectangle(
      400, 300, 438, 318, this.colors.floor
    );

    const floor = this.add.graphics();

    // Tábuas horizontais
    for (let y = 150; y < 455; y += 16) {
      floor.lineStyle(1, 0x38271d, 0.9);
      floor.lineBetween(182, y, 618, y);
    }

    // Divisões desencontradas
    for (let row = 0; row < 19; row++) {
      const y = 150 + row * 16;
      const offset = row % 2 === 0 ? 0 : 27;

      for (let x = 185 + offset; x < 618; x += 54) {
        floor.lineStyle(1, 0x38271d, 0.8);
        floor.lineBetween(x, y, x, y + 16);
      }
    }

    // Variações da madeira
    for (let i = 0; i < 75; i++) {
      this.add.rectangle(
        Phaser.Math.Between(190, 610),
        Phaser.Math.Between(155, 445),
        Phaser.Math.Between(5, 20),
        2,
        Phaser.Math.RND.pick([
          0x9b7048,
          0xb18659,
          0x4c3527
        ]),
        0.4
      );
    }
  }

  // =====================================================
  // WINDOW
  // =====================================================

  drawWindow() {
    this.add.rectangle(400, 153, 105, 35, 0x7a5439);
    this.add.rectangle(400, 150, 90, 27, 0x7e9a91);

    this.add.rectangle(
      400, 151, 86, 30, 0x39271e
    ).setStrokeStyle(3, this.colors.woodLight);

    this.add.rectangle(400, 151, 36, 24, 0x93b6ad);
    this.add.rectangle(400, 151, 3, 28, 0x65432e);
    this.add.rectangle(400, 151, 80, 3, 0x65432e);

    this.add.rectangle(
      385, 145, 12, 4, 0xd8e4c2, 0.7
    );

    this.add.rectangle(351, 153, 12, 34, 0xd9c39b);
    this.add.rectangle(449, 153, 12, 34, 0xd9c39b);
    this.add.rectangle(400, 169, 103, 5, 0x9b7048);
  }

  // =====================================================
  // BED
  // =====================================================

  drawBed() {
    // Sombra
    this.add.rectangle(
      270, 215, 105, 145, 0x17100d, 0.35
    );

    // Estrutura
    this.add.rectangle(
      270, 210, 100, 140, 0x634029
    ).setStrokeStyle(3, 0x38241a);

    // Cabeceira
    this.add.rectangle(
      270, 146, 104, 15, 0x805333
    ).setStrokeStyle(3, 0x38241a);

    // Colchão
    this.add.rectangle(270, 207, 88, 117, 0xd8c5a1);

    // Cobertor
    this.add.rectangle(270, 230, 84, 68, 0x8a3334);
    this.add.rectangle(270, 211, 84, 5, 0xc49a5c);

    // Travesseiro
    this.add.rectangle(
      270, 161, 56, 23, 0xe9ddc3
    ).setStrokeStyle(2, 0xb49b78);

    // Bordados
    const embroidery = this.add.graphics();
    embroidery.lineStyle(1, 0xd4a65f, 0.9);

    for (let x = 238; x <= 302; x += 16) {
      embroidery.lineBetween(x, 238, x + 5, 244);
      embroidery.lineBetween(x + 5, 244, x, 250);
    }

    this.add.rectangle(
      270, 285, 125, 75, 0x263b4a
    ).setStrokeStyle(3, this.colors.gold);
  }

  // =====================================================
  // DESK
  // =====================================================

  drawDesk() {
    this.add.rectangle(
      400, 195, 125, 27, 0x684329
    ).setStrokeStyle(3, 0x38251b);

    this.add.rectangle(400, 184, 115, 5, 0xa77949);

    // Gavetas
    for (const x of [370, 430]) {
      this.add.rectangle(
        x, 203, 34, 12, 0x805333
      ).setStrokeStyle(1, 0x38251b);

      this.add.circle(x, 203, 2, this.colors.gold);
    }

    // Livro aberto
    this.add.rectangle(
      400, 175, 32, 10, 0xe0d0aa
    ).setStrokeStyle(1, 0x77573c);

    this.add.rectangle(400, 175, 2, 10, 0x77573c);

    // Pés
    this.add.rectangle(357, 211, 7, 18, 0x493020);
    this.add.rectangle(443, 211, 7, 18, 0x493020);
  }

  // =====================================================
  // BOOKSHELF
  // =====================================================

  drawBookshelf() {
    this.add.rectangle(
      205, 385, 42, 115, 0x17100d, 0.3
    );

    this.add.rectangle(
      205, 380, 46, 110, 0x70472e
    ).setStrokeStyle(3, 0x38251b);

    const bookColors = [
      0x8b3434,
      0x4e6a78,
      0xb58b48,
      0x526744,
      0x6b4b77
    ];

    for (let shelf = 0; shelf < 3; shelf++) {
      const y = 346 + shelf * 32;

      this.add.rectangle(205, y + 10, 42, 4, 0xb08050);

      for (let i = 0; i < 5; i++) {
        const x = 189 + i * 8;

        this.add.rectangle(
          x,
          y,
          6,
          Phaser.Math.Between(15, 22),
          bookColors[(shelf + i) % bookColors.length]
        ).setStrokeStyle(1, 0x38251b);
      }
    }
  }

  // =====================================================
  // CABINET
  // =====================================================

  drawCabinet() {
    this.add.rectangle(
      565, 190, 75, 95, 0x70472e
    ).setStrokeStyle(3, 0x38251b);

    this.add.rectangle(
      547, 190, 30, 78, 0x8a5b37
    ).setStrokeStyle(2, 0x493020);

    this.add.rectangle(
      583, 190, 30, 78, 0x8a5b37
    ).setStrokeStyle(2, 0x493020);

    this.add.circle(558, 190, 2, this.colors.gold);
    this.add.circle(572, 190, 2, this.colors.gold);

    this.add.rectangle(565, 141, 82, 8, 0xa77949);

    // Vaso
    this.add.rectangle(565, 130, 14, 12, 0x8d563b);

    this.add.ellipse(565, 125, 20, 12, 0x557448);
    this.add.ellipse(558, 120, 12, 15, 0x6c8a51);
    this.add.ellipse(572, 119, 12, 15, 0x476b3e);
  }

  // =====================================================
  // TABLE
  // =====================================================

  drawTable() {
    // Estrutura
    this.add.rectangle(
      520, 340, 100, 58, 0x70472e
    ).setStrokeStyle(3, 0x38251b);

    // Tampo
    this.add.rectangle(
      520, 331, 100, 43, 0x9a6a40
    ).setStrokeStyle(3, 0x50321f);

    // Toalha
    this.add.rectangle(520, 331, 26, 39, 0xd8c7a3);

    // Cadeiras
    this.add.rectangle(
      459, 330, 15, 32, 0x70472e
    ).setStrokeStyle(2, 0x38251b);

    this.add.rectangle(
      581, 330, 15, 32, 0x70472e
    ).setStrokeStyle(2, 0x38251b);

    // Prato
    this.add.circle(
      520, 330, 10, 0xe2d4b7
    ).setStrokeStyle(2, 0xa78b61);

    // Caneca
    this.add.rectangle(540, 320, 8, 10, 0x9b6a47);
  }

  // =====================================================
  // CHEST
  // =====================================================

  drawChest() {
    this.add.rectangle(
      270, 383, 45, 30, 0x493020
    ).setStrokeStyle(2, 0x2b1b14);

    this.add.rectangle(
      270, 378, 43, 15, 0x805333
    ).setStrokeStyle(2, 0x493020);

    this.add.rectangle(270, 384, 5, 16, this.colors.gold);
    this.add.circle(270, 385, 2, 0x2b1b14);
  }

  // =====================================================
  // PLANTS
  // =====================================================

  drawPlants() {
    this.createPlant(195, 430);
    this.createPlant(605, 410);
    this.createPlant(590, 245);
  }

  createPlant(x, y) {
    this.add.rectangle(
      x, y + 8, 17, 19, 0x965b3c
    ).setStrokeStyle(2, 0x593625);

    this.add.rectangle(x, y, 20, 4, 0xb17b4c);

    this.add.ellipse(x - 7, y - 8, 15, 24, 0x476c3e)
      .setRotation(-0.4);

    this.add.ellipse(x + 6, y - 11, 15, 25, 0x66864c)
      .setRotation(0.4);

    this.add.ellipse(x, y - 19, 13, 24, 0x527747);
    this.add.ellipse(x - 10, y - 17, 12, 15, 0x789457);
  }

  // =====================================================
  // LAMPS
  // =====================================================

  drawLamps() {
    this.createLamp(335, 174);
    this.createLamp(465, 174);
    this.createLamp(600, 350);
  }

  createLamp(x, y) {
    // Luz decorativa
    this.add.circle(x, y, 29, 0xf2ba56, 0.08);
    this.add.circle(x, y, 19, 0xf2ba56, 0.12);

    // Base
    this.add.ellipse(x, y + 5, 20, 7, 0x4a3020);

    // Haste
    this.add.rectangle(x, y - 3, 4, 13, 0x70472e);

    // Chama
    this.add.ellipse(x, y - 13, 9, 15, 0xf2a43a);
    this.add.ellipse(x, y - 13, 4, 9, 0xffe9a3);
  }

  // =====================================================
  // RUG
  // =====================================================

  drawRug() {
    this.add.rectangle(
      400, 340, 166, 103, 0x17100d, 0.4
    );

    this.add.rectangle(
      400, 334, 158, 95, this.colors.red
    ).setStrokeStyle(4, this.colors.redDark);

    this.add.rectangle(
      400, 334, 142, 79, 0x792f32, 1
    ).setStrokeStyle(2, this.colors.gold);

    this.add.rectangle(
      400, 334, 124, 61, 0x792f32, 1
    ).setStrokeStyle(1, 0xb17b4c);

    const pattern = this.add.graphics();
    pattern.lineStyle(1, this.colors.gold, 0.9);

    for (let x = 350; x <= 450; x += 20) {
      pattern.lineBetween(x, 315, x + 5, 320);
      pattern.lineBetween(x + 5, 320, x, 325);
      pattern.lineBetween(x, 325, x - 5, 320);
      pattern.lineBetween(x - 5, 320, x, 315);
    }

    pattern.lineBetween(340, 348, 460, 348);
    pattern.lineBetween(340, 352, 460, 352);
  }

  // =====================================================
  // COLLISIONS
  // =====================================================

  addCollider(group, x, y, width, height) {
    const collider = group.create(x, y, 'collision-pixel');

    collider.setDisplaySize(width, height);
    collider.setVisible(false);
    collider.refreshBody();

    return collider;
  }

  createCollisions() {
    // Paredes
    this.addCollider(this.walls, 400, 128, 470, 20);
    this.addCollider(this.walls, 165, 300, 20, 350);
    this.addCollider(this.walls, 635, 300, 20, 350);

    // Abertura central para a porta
    this.addCollider(this.walls, 290, 468, 250, 20);
    this.addCollider(this.walls, 535, 468, 200, 20);

    // Móveis
    this.addCollider(this.furniture, 270, 210, 96, 110);
    this.addCollider(this.furniture, 400, 195, 120, 25);
    this.addCollider(this.furniture, 565, 190, 78, 90);
    this.addCollider(this.furniture, 205, 380, 44, 105);
    this.addCollider(this.furniture, 520, 340, 95, 45);
    this.addCollider(this.furniture, 270, 383, 44, 25);
  }

  // =====================================================
  // PLAYER
  // =====================================================

  createPlayer() {
    const graphics = this.make.graphics({
      x: 0,
      y: 0,
      add: false
    });

    // Sombra
    graphics.fillStyle(0x17100d, 0.35);
    graphics.fillEllipse(18, 53, 28, 9);

    // Cabelo castanho
    graphics.fillStyle(0x59311f);
    graphics.fillEllipse(18, 15, 29, 30);
    graphics.fillRect(5, 12, 7, 23);
    graphics.fillRect(24, 11, 8, 24);

    // Rosto
    graphics.fillStyle(0xe8b58c);
    graphics.fillEllipse(18, 20, 20, 22);

    // Franja
    graphics.fillStyle(0x704027);
    graphics.fillTriangle(7, 15, 18, 7, 27, 15);
    graphics.fillRect(9, 12, 5, 8);
    graphics.fillRect(16, 10, 5, 9);
    graphics.fillRect(23, 12, 4, 8);

    // Olhos
    graphics.fillStyle(0x665126);
    graphics.fillRect(12, 20, 3, 4);
    graphics.fillRect(21, 20, 3, 4);

    graphics.fillStyle(0x211710);
    graphics.fillRect(13, 21, 2, 2);
    graphics.fillRect(22, 21, 2, 2);

    // Blusa creme
    graphics.fillStyle(0xe8d4b3);
    graphics.fillRect(9, 30, 18, 10);

    // Vestido marrom
    graphics.fillStyle(0x59331f);
    graphics.fillTriangle(9, 34, 27, 34, 32, 50);
    graphics.fillTriangle(9, 34, 32, 50, 4, 50);

    // Bordados dourados
    graphics.lineStyle(1, 0xc69a52, 1);
    graphics.lineBetween(18, 35, 18, 47);
    graphics.lineBetween(9, 43, 14, 46);
    graphics.lineBetween(27, 43, 22, 46);

    // Mangas
    graphics.fillStyle(0xe8d4b3);
    graphics.fillRect(4, 32, 6, 9);
    graphics.fillRect(26, 32, 6, 9);

    // Mãos
    graphics.fillStyle(0xe8b58c);
    graphics.fillRect(4, 40, 5, 4);
    graphics.fillRect(27, 40, 5, 4);

    // Botas
    graphics.fillStyle(0x493020);
    graphics.fillRect(10, 49, 7, 8);
    graphics.fillRect(20, 49, 7, 8);

    // Fivelas
    graphics.fillStyle(0xc69a52);
    graphics.fillRect(12, 51, 3, 2);
    graphics.fillRect(22, 51, 3, 2);

    graphics.generateTexture('player-placeholder', 36, 60);
    graphics.destroy();

    this.player = this.physics.add.sprite(
      400,
      405,
      'player-placeholder'
    );

    this.player.setDepth(405);
    this.player.setCollideWorldBounds(true);

    // A colisão fica nos pés da personagem
    this.player.body.setSize(20, 18);
    this.player.body.setOffset(8, 38);
  }

  // =====================================================
  // INTERFACE
  // =====================================================

  createUI() {
    this.add.rectangle(
      400, 35, 130, 30, 0x17100d, 0.95
    ).setStrokeStyle(2, this.colors.gold);

    this.add.text(400, 35, 'CASA', {
      fontFamily: 'Georgia, serif',
      fontSize: '17px',
      color: '#f0d5a0',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.rectangle(
      400, 565, 340, 28, 0x17100d, 0.95
    ).setStrokeStyle(1, this.colors.gold);

    this.add.text(
      400,
      565,
      'Use as setas ou WASD para andar',
      {
        fontFamily: 'Georgia, serif',
        fontSize: '12px',
        color: '#f0d5a0'
      }
    ).setOrigin(0.5);
  }

  // =====================================================
  // MOVEMENT
  // =====================================================

  update() {
    if (!this.player || !this.cursors || !this.keys) {
      return;
    }

    const speed = 125;

    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.keys.left.isDown) {
      vx = -1;
    }

    if (this.cursors.right.isDown || this.keys.right.isDown) {
      vx = 1;
    }

    if (this.cursors.up.isDown || this.keys.up.isDown) {
      vy = -1;
    }

    if (this.cursors.down.isDown || this.keys.down.isDown) {
      vy = 1;
    }

    // Velocidade uniforme nas diagonais
    const direction = new Phaser.Math.Vector2(vx, vy);

    if (direction.length() > 0) {
      direction.normalize();
    }

    this.player.setVelocity(
      direction.x * speed,
      direction.y * speed
    );

    // Profundidade conforme a posição vertical
    this.player.setDepth(this.player.y);
  }
}
