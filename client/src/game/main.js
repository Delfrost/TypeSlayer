import Phaser from "phaser";

const words = ["Phaser", "React", "JavaScript", "Code", "Game", "Type", "Speed", "Challenge", "Developer", "Fun"];

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  scene: {
    // preload: preload,
    create: create,
    update: update,
  },
};

let wordGroup;
let inputText;

// function preload() {
//   this.load.image("background", "assets/background.png"); // Optional background
// }

function create() {
//   this.add.image(400, 300, "background"); // Background (optional)
  wordGroup = this.add.group();
  
  this.time.addEvent({
    delay: 2000, // Every 2 seconds
    callback: spawnWord,
    callbackScope: this,
    loop: true,
  });
  
  // Create input text field
  inputText = this.add.text(400, 550, "", {
    fontSize: "32px",
    fill: "#ffffff",
    backgroundColor: "#222222",
    padding: { x: 10, y: 5 },
  }).setOrigin(0.5);
  
  // Capture keyboard input
  this.input.keyboard.on("keydown", (event) => {
    if (event.key === "Enter") {
      inputText.setText(""); // Reset input on Enter
    } else if (event.key.length === 1) {
      inputText.setText(inputText.text + event.key);
    }
  });
}

function spawnWord() {
  const randomWord = Phaser.Utils.Array.GetRandom(words); // Get random word

  // Ensure words stay within left and right borders
  const startX = Phaser.Math.Between(150, 650);
  const startY = -50;

  const wordText = this.add.text(startX, startY, randomWord, {
    fontSize: "32px",
    fill: "#ffffff",
    backgroundColor: "#000000",
    padding: { x: 10, y: 5 },
  });

  wordGroup.add(wordText);

  // Animate word floating downwards
  this.tweens.add({
    targets: wordText,
    y: 600, // Bottom of the screen
    duration: 4000,
    ease: "Linear",
    onComplete: () => wordText.destroy(),
  });
}

function update() {}

if (!window.phaserGame) {
  window.phaserGame = new Phaser.Game(config);
}
