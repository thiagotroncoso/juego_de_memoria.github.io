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

// Agrego 4 imágenes más según los nombres que aparecen en tu carpeta
const nombresCartas = [
  'miloangel',
  'milochomba',
  'milocute',
  'milomatero',
  'miloconbiza',    // nueva
  'miloespaña',     // nueva
  'milofoton',      // nueva
  'milolimon'       // nueva
];

function preload() {
  // Corregí el nombre para que coincida exactamente con la imagen: Logomiloj.png
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

  // Ajusto filas y columnas para 16 cartas (8 pares)
  const columnas = 4;
  const filas = 4;

  const padding = 20; // Menos espacio para más cartas
  const totalWidth = config.width * 0.9;
  const totalHeight = config.height * 0.8;

  const espacioX = totalWidth / columnas;
  const espacioY = totalHeight / filas;

  const tamañoBase = 300; // tamaño original de las cartas
  const escala = Math.min(
    (espacioX - padding * 2) / tamañoBase,
    (espacioY - padding * 2) / tamañoBase
  );

  const offsetX = (config.width - (espacioX * columnas)) / 2 + espacioX / 2;
  const offsetY = (config.height - (espacioY * filas)) / 2 + espacioY / 2;

  for (let i = 0; i < mazo.length; i++) {
    const col = i % columnas;
    const fila = Math.floor(i / columnas);

    const x = offsetX + col * espacioX;
    const y = offsetY + fila * espacioY;

    const carta = this.add.image(x, y, 'back').setInteractive();

    // Quitar cualquier rotación que pueda tener la carta para que no esté dada vuelta
    carta.setRotation(0);

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
  carta.setRotation(0); // aseguro que la imagen frontal tampoco esté rotada
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
    fontSize: config.width < 600 ? '32px' : '48px',
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

  const padding = 60; // espacio entre cartas
  const totalWidth = config.width * 0.9;
  const totalHeight = config.height * 0.8;

  const espacioX = totalWidth / columnas;
  const espacioY = totalHeight / filas;

  const tamañoBase = 300; // tamaño original de las cartas
  const escala = Math.min(
    (espacioX - padding * 2) / tamañoBase,
    (espacioY - padding * 2) / tamañoBase
  );

  const offsetX = (config.width - (espacioX * columnas)) / 2 + espacioX / 2;
  const offsetY = (config.height - (espacioY * filas)) / 2 + espacioY / 2;

  for (let i = 0; i < mazo.length; i++) {
    const col = i % columnas;
    const fila = Math.floor(i / columnas);

    const x = offsetX + col * espacioX;
    const y = offsetY + fila * espacioY;

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
    fontSize: config.width < 600 ? '32px' : '48px', // Ajuste dinámico para pantallas pequeñas
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
