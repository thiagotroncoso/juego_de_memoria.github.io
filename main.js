const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight - 100,
  backgroundColor: '#111',
  parent: 'game-container',
  scene: {
    preload,
    create
  }
};

const game = new Phaser.Game(config);

let cards = [];
let firstCard = null;
let secondCard = null;
let canClick = true;

const nombresCartas = [
  'miloangel',
  'milochomba',
  'milocute',
  'milomatero'
];

function preload() {
  this.load.image('back', 'assets/Logomiloj.png');
  nombresCartas.forEach(nombre => {
    this.load.image(nombre, `assets/${nombre}.png`);
  });
}

function create() {
  cards = [];
  firstCard = null;
  secondCard = null;
  canClick = true;

  const mazo = [];
  nombresCartas.forEach(nombre => {
    mazo.push({ tipo: nombre });
    mazo.push({ tipo: nombre });
  });

  Phaser.Utils.Array.Shuffle(mazo);

  const columnas = 4;
  const filas = 2;

  const margenX = 20;
  const margenY = 40;

  const espacioX = (config.width - margenX * 2) / columnas;
  const espacioY = (config.height - margenY * 2) / filas;

  const tamaño = Math.min(espacioX, espacioY * 0.8);
  const escala = tamaño / 300;

  for (let i = 0; i < mazo.length; i++) {
    const col = i % columnas;
    const fila = Math.floor(i / columnas);

    const x = margenX + espacioX * col + espacioX / 2;
    const y = margenY + espacioY * fila + espacioY / 2;

    const carta = this.add.image(x, y, 'back').setInteractive();
    carta.setScale(escala);
    carta.tipo = mazo[i].tipo;
    carta.flipped = false;

    carta.on('pointerdown', () => manejarClick.call(this, carta));
    cards.push(carta);
  }
}

function manejarClick(carta) {
  if (!canClick || carta.flipped) return;

  carta.setTexture(carta.tipo);
  carta.flipped = true;

  if (!firstCard) {
    firstCard = carta;
  } else {
    secondCard = carta;
    canClick = false;

    this.time.delayedCall(600, () => {
      if (firstCard.tipo === secondCard.tipo) {
        firstCard.disableInteractive();
        secondCard.disableInteractive();
      } else {
        firstCard.setTexture('back');
        secondCard.setTexture('back');
        firstCard.flipped = false;
        secondCard.flipped = false;
      }

      firstCard = null;
      secondCard = null;
      canClick = true;

      if (cards.every(c => c.flipped)) {
        this.time.delayedCall(700, () => mostrarVictoria(this));
      }
    });
  }
}

function mostrarVictoria(scene) {
  const texto = scene.add.text(config.width / 2, config.height / 2, '¡Ganaste!', {
    fontFamily: 'Permanent Marker',
    fontSize: '48px',
    color: '#00ffff',
    stroke: '#000000',
    strokeThickness: 6
  }).setOrigin(0.5).setAlpha(0).setScale(0.5);

  scene.tweens.add({
    targets: texto,
    alpha: 1,
    scale: 1,
    duration: 1000,
    ease: 'Bounce.easeOut'
  });

  scene.time.delayedCall(3000, () => {
    scene.scene.restart();
  });
}