import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO, // Automatically use WebGL or Canvas
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d', // Background color
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/images/background.png'); // Example background
}

function create() {
    // Add a background image
    this.add.image(400, 300, 'background');

    // Add static text
    this.add.text(50, 50, 'TypeSlayer', { fontSize: '32px', color: '#fff' });

    // Add interactive input
    this.input.keyboard.on('keydown', (event) => {
        console.log('Key pressed:', event.key); // Log pressed keys
    });
}

function update() {
    // Add game logic to be updated every frame
}
