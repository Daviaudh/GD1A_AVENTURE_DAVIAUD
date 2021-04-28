class Scene1 extends Phaser.Scene{
    constructor()
    {
        super("scene1");
    }
    
    preload()
    {
        this.load.spritesheet('vaisseau', 'assets/SpriteSheet_Vaisseau.png', { frameWidth: 62, frameHeight: 33 });
        this.load.image('Set', 'tileSet.png');
        this.load.tilemapTiledJSON('village', 'carte1.json');
        this.load.tilemapTiledJSON('donjon', 'carte2.json');
    }
    create(){

        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.village = this.make.tilemap({key:'village'});
        this.tileSet = this.village.addTilesetImage('tileSet','Set');
        this.bot = this.village.createStaticLayer('bot', this.tileSet, 0,0);
        this.top = this.village.createStaticLayer('top', this.tileSet, 0,0);
        this.player = this.physics.add.sprite(1800, 450, 'vaisseau');
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.top);
        this.top.setCollisionByProperty({collides:true});

        this.camera=this.cameras.main.setSize(1920,1080);
        this.camera.startFollow(this.player, true, 0.08,0.08);
        this.camera.setBounds(0,0,3200,3200);
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
            this.player.setVelocityX(-500);
        }
        else if (this.cursors.right.isDown|| pad.right)
        {
            this.player.direction='right';
            this.player.setVelocityX(500);
        }
        else if (this.cursors.up.isDown || pad.up)
        {
            this.player.setVelocityY(-500);
        }
        else if (this.cursors.down.isDown|| pad.down)
        {
            this.player.setVelocityY(500);
        }
        else
        {
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
        }
        if(this.player.x>1900)
        {
            this.scene.start('scene2');
        }
      
    }
}