class Scene2 extends Phaser.Scene{
    constructor()
    {
        super("scene2");
    }
    
    create(){        
            this.cursors = this.input.keyboard.createCursorKeys();
            this.donjon = this.make.tilemap({key:'donjon'});
            this.tileSet = this.donjon.addTilesetImage('tileSet','Set');
            this.bot = this.donjon.createStaticLayer('bot', this.tileSet, 0,0);
            this.top = this.donjon.createStaticLayer('top', this.tileSet, 0,0);
            this.player = this.physics.add.sprite(100, 450, 'vaisseau');
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
                this.player.setVelocityX(-400);
            }
            else if (this.cursors.right.isDown|| pad.right)
            {
                this.player.direction='right';
                this.player.setVelocityX(400);
            }
            else if (this.cursors.up.isDown || pad.up)
            {
                this.player.setVelocityY(-400);
            }
            else if (this.cursors.down.isDown|| pad.down)
            {
                this.player.setVelocityY(400);
            }
            else
            {
                this.player.setVelocityY(0);
                this.player.setVelocityX(0);
            }

          
    
          
        }
    }
    