class Scene2 extends Phaser.Scene{
    constructor()
    {
        super("scene2");
    }
    
    preload()
    {
         this.load.spritesheet('vaisseau', 'assets/SpriteSheet_Vaisseau.png', { frameWidth: 62, frameHeight: 33 });
         this.load.image('fond', 'assets/FondV2.jpg');
    }
    create(){
        this.add.image(1280, 720, 'fond');
        player = this.physics.add.sprite(100, 450, 'vaisseau');
        player.setCollideWorldBounds(true);
    }
}