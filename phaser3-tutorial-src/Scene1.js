class Scene1 extends Phaser.Scene{
    constructor()
    {
        super("scene1");
    }
    
    preload()
    {
         this.load.spritesheet('vaisseau', 'assets/SpriteSheet_Vaisseau.png', { frameWidth: 62, frameHeight: 33 });
         this.load.image('fond', 'assets/FondV2.jpg');
    }
    create(){
        this.add.image(1280, 720, 'fond');
        this.player = this.physics.add.sprite(100, 450, 'vaisseau');
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        
    }
    update(){
            let pad = Phaser.Input.Gamepad.Gamepad;

        if(this.input.gamepad.total){
            pad = this.input.gamepad.getPad(0)
            xAxis = pad ? pad.axes[0].getValue() : 0;
            yAxis = pad ? pad.axes[1].getValue() : 0;
        }
    

        if (this.cursors.left.isDown || pad.left)
        {
            this.player.direction = 'left';
            this.player.setVelocityX(-300);
        }
        else if (this.cursors.right.isDown|| pad.right)
        {
            this.player.direction='right';
            this.player.setVelocityX(300);
        }
        else if (this.cursors.up.isDown || pad.up)
        {
            this.player.setVelocityY(-300);
        }
        else if (this.cursors.down.isDown|| pad.down)
        {
            this.player.setVelocityY(300);
        }
        else
        {
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
        }

      
    }
}