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
    mazo.push({ tipo: nombre });
  });

  Phaser.Utils.Array.Shuffle(mazo);

  const columnas = (config.width < 600) ? 3 : 4;
  const filas = Math.ceil(mazo.length / columnas);
  const espacioX = config.width / (columnas + 1);
  const espacioY = config.height / (filas + 1);

  const escala = (config.width < 400) ? 0.16 :
                 (config.width < 600) ? 0.19 : 0.22;

  for (let i = 0; i < mazo.length; i++) {
    const x = espacioX * ((i % columnas) + 1);
    const y = espacioY * (Math.floor(i / columnas) + 1);

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
        this.time.delayedCall(1500, () => {
          this.scene.restart();
        });
      }
    });
  }
}