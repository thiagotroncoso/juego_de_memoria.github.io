const isMobile = window.innerWidth < 768;

const config = {
  type: Phaser.AUTO,
  width: isMobile ? window.innerWidth : 1000,
  height: isMobile ? window.innerHeight - 100 : 720,
  backgroundColor: '#1a1a1a',
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
  'Miloconbiza',
  'milocute',
  'miloespaña',
  'milofoton',
  'miloganador',
  'milolimon',
  'milomatero',
  'milopelin',
  'Milorevista',
  'miloserio'
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
    mazo.push({ tipo: nombre }); // pares
  });

  Phaser.Utils.Array.Shuffle(mazo);

  const columnas = isMobile ? 4 : 6;
  const filas = Math.ceil(mazo.length / columnas);
  const espaciadoX = config.width / (columnas + 1);
  const espaciadoY = config.height / (filas + 1);

  for (let i = 0; i < mazo.length; i++) {
    const col = i % columnas;
    const row = Math.floor(i / columnas);
    const x = espaciadoX * (col + 1);
    const y = espaciadoY * (row + 1);

    const carta = this.add.image(x, y, 'back').setInteractive();
    carta.setScale(isMobile ? 0.18 : 0.22);
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

      // Verificar si se descubrieron todas
      if (cards.every(c => c.flipped)) {
        this.time.delayedCall(1500, () => {
          this.scene.restart();
        });
      }
    });
  }
}

