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
let aciertos = 0;       
let textoAciertos;
let intentos = 5;
let textoIntentos; 
let tiempoRestante = 30; 
let timerText;            
let cuentaAtras;
let mostrarMensaje;         


const nombresCartas = [
  'Miloconbiza',
  'miloserio',
  'milolimon',
  'milopelin'
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
  aciertos = 0;
  intentos = 5;
// Texto de los Aciertos
  const styleAciertos = { 
    font: "48px Arial", 
    fill: "#fff", 
    backgroundColor: "rgba(0,0,0,0.5)", 
    padding: { x: 15, y: 10 }, 
  };
  textoAciertos = this.add.text(20, 20, `Aciertos: ${aciertos}`, styleAciertos);
  textoAciertos.setDepth(1); 
  textoAciertos.setShadow(2, 2, "#000", 2, true, true);

//Texto de los Intentos
  const styleIntentos = { 
    font: "48px Arial", 
    fill: "#fff", 
    backgroundColor: "rgba(0,0,0,0.5)", 
    padding: { x: 15, y: 10 },
  };
  textoIntentos = this.add.text(350, 20, `Intentos: ${intentos}`, styleIntentos);
  textoIntentos.setDepth(1); 
  textoIntentos.setShadow(2, 2, "#000", 2, true, true);

  // Texto del temporizador
const styleTiempo = { font: "48px Arial", fill: "#00ffff" };
timerText = this.add.text(config.width - 250, 20, `Tiempo: ${tiempoRestante}`, styleTiempo);
timerText.setDepth(1); 
timerText.setShadow(2, 2, "#000", 2, true, true);

// Inicia la cuenta regresiva
cuentaAtras = this.time.addEvent({
  delay: 1000, // cada segundo
  callback: () => {
    if (tiempoRestante > 0) {
      tiempoRestante--;
      timerText.setText(`Tiempo: ${tiempoRestante}`);
    } 
    else if(tiempoRestante == 0){
        canClick = false
          const style = { 
  font: "80px Arial", 
    fill: "rgba(0, 170, 255, 1)", 
       backgroundColor: "rgba(0,0,0,0.7)", 
          padding: { x: 20, y: 20 }, 
            align: "center" 
        };
        
        const mensaje = this.add.text(config.width/2, config.height/2, "¡Se termino el tiempo!", style);
        mensaje.setOrigin(0.5);
        mensaje.setDepth(2);
        mensaje.alpha = 0;
      
        this.tweens.add({
          targets: mensaje,
          alpha: 1,
          duration: 1000,
          ease: 'Power2',
          yoyo: false,
          onComplete: () => {
            // Esperar 2 segundos y luego reiniciar la escena
            this.time.delayedCall(1000, () => {
              this.scene.restart();
              tiempoRestante = 30
            });
          }
        });
      cuentaAtras.remove(); // Detiene el temporizador
    }
  },
  loop: true
});





  const mazo = [];
  nombresCartas.forEach(nombre => {
    mazo.push({ tipo: nombre });
    mazo.push({ tipo: nombre });
  });

  Phaser.Utils.Array.Shuffle(mazo);

  const columnas = 4;
  const filas = 2;
  const margen = 15;

  const cartaAncho = (config.width - (margen * (columnas + 1))) / columnas;
  const cartaAlto = (config.height - (margen * (filas + 1))) / filas;

  const escala = Math.min(cartaAncho / 600, cartaAlto / 600);

  for (let i = 0; i < mazo.length; i++) {
    const col = i % columnas;
    const fil = Math.floor(i / columnas);

    const x = margen + (cartaAncho / 2) + col * (cartaAncho + margen);
    const y = margen + (cartaAlto / 2) + fil * (cartaAlto + margen);

    const carta = this.add.image(x, y, 'back').setInteractive();
    carta.setScale(escala);
    carta.tipo = mazo[i].tipo;
    carta.flipped = false;

    carta.on('pointerdown', () => manejarClick.call(this, carta));
    cards.push(carta);
  }
}

function manejarClick(carta) {

  console.log("canClick: ", canClick);
  console.log("flipped: ", carta.flipped);

      if (intentos === 0){
        //this.scene.restart()
        canClick = false
          const style = { 
  font: "80px Arial", 
    fill: "rgba(255, 0, 0, 1)", 
       backgroundColor: "rgba(0,0,0,0.7)", 
          padding: { x: 20, y: 20 }, 
            align: "center" 
        };
        
        const mensaje = this.add.text(config.width/2, config.height/2, "¡Perdiste!", style);
        mensaje.setOrigin(0.5);
        mensaje.setDepth(2);
        mensaje.alpha = 0;
      
        this.tweens.add({
          targets: mensaje,
          alpha: 1,
          duration: 1000,
          ease: 'Power2',
          yoyo: false,
          onComplete: () => {
            // Esperar 2 segundos y luego reiniciar la escena
            this.time.delayedCall(2000, () => {
              this.scene.restart();
              tiempoRestante = 30
            });
          }
        });
    }

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

        aciertos++;
        textoAciertos.setText(`Aciertos: ${aciertos}`);
      } else {
        firstCard.setTexture('back');
        secondCard.setTexture('back');
        firstCard.flipped = false;
        secondCard.flipped = false;
        intentos--;
        textoIntentos.setText(`intentos: ${intentos}`)
      }

  

      firstCard = null;
      secondCard = null;
      canClick = true;

      if (cards.every(c => c.flipped)) {
        const style = { 
          font: "80px Arial", 
          fill: "rgba(72, 255, 0, 1)", 
          backgroundColor: "rgba(0,0,0,0.7)", 
          padding: { x: 20, y: 20 }, 
          align: "center" 
        };
        const mensaje = this.add.text(config.width/2, config.height/2, "¡Ganaste!", style);
        mensaje.setOrigin(0.5);
        mensaje.setDepth(2);
        mensaje.alpha = 0;

        this.tweens.add({
          targets: mensaje,
          alpha: 1,
          duration: 1000,
          ease: 'Power2',
          yoyo: false,
          onComplete: () => {
            // Esperar 2 segundos y luego reiniciar la escena
            this.time.delayedCall(2000, () => {
              this.scene.restart();
              tiempoRestante = 30
            });
          }
        });
      }
    });
  }
}