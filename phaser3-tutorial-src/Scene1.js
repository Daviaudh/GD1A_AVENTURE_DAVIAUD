class Scene1 extends Phaser.Scene{
    constructor()
    {
        super("scene1");
    }
    
    preload()
    {
        this.load.spritesheet('player', 'assets/persoPrincipal.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('set', 'tileSheet.png');
        this.load.image('setInterieur', 'maisonInterieur.png');
        this.load.image('munition', 'assets/ammo.png');
        this.load.image('arme', 'assets/gun.png');
        this.load.image('courir', 'assets/speedUp.png');
        this.load.image('hp', 'assets/hp.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('zombie1', 'assets/zombie1.png');
        this.load.image('balle', 'assets/laser.png');
        this.load.tilemapTiledJSON('village', 'carte1.json');
        this.load.tilemapTiledJSON('donjon', 'carte2.json');

    }
    create(){
        
        

        this.cursors = this.input.keyboard.createCursorKeys();
        this.village = this.make.tilemap({key:'village'});
        this.tileSet = this.village.addTilesetImage('tileSet','set');
        this.bot = this.village.createStaticLayer('bot', this.tileSet, 0,0);
        this.top = this.village.createDynamicLayer('top', this.tileSet, 0,0);
        this.player = this.physics.add.sprite(500, 450, 'player');
        this.basket = this.physics.add.sprite(800, 450, 'courir');
        this.player.setCollideWorldBounds(true);
        this.boutonFeu = this.input.keyboard.addKey('A');
        this.boutonCourse = this.input.keyboard.addKey('z');
        this.pistolet = this.physics.add.image(600, 500, 'arme');
        this.key = this.physics.add.image(700, 500, 'key');
       //animation sans armes
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 5,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
            frameRate: 5,
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
            frameRate: 5,
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 5,
        });

        ///////////animation avec arme/////////
        this.anims.create({
            key: 'leftArme',
            frames: this.anims.generateFrameNumbers('player', { start: 3+12, end: 5+12 }),
            frameRate: 5,
        });

        this.anims.create({
            key: 'rightArme',
            frames: this.anims.generateFrameNumbers('player', { start: 6+12, end: 8+12 }),
            frameRate: 5,
        });

        this.anims.create({
            key: 'upArme',
            frames: this.anims.generateFrameNumbers('player', { start: 9+12, end: 11+12 }),
            frameRate: 5,
        });

        this.anims.create({
            key: 'downArme',
            frames: this.anims.generateFrameNumbers('player', { start: 0+12, end: 2+12 }),
            frameRate: 5,
        });
 

        this.camera=this.cameras.main.setSize(1920,1080);
        this.camera.startFollow(this.player, true, 0.08,0.08);
        this.camera.setBounds(0,0,3200,3200);
        this.hptext = this.add.text(16, 32, 'hp : ' +hp, {fontSize:'32px', fill:'#fff'}).setScrollFactor(0);
        this.muntext = this.add.text(16, 64, 'Mun : ' +munition, {fontSize:'32px', fill:'#fff'}).setScrollFactor(0);
        


        this.ennemis = this.physics.add.group();
        this.groupeBalles = this.physics.add.group();
        this.groupeMunitions = this.physics.add.group();
        this.groupeHp = this.physics.add.group();
        
        new Ennemi(this, 400, 700, 'zombie1' );

        this.top.setTileLocationCallback(36, 11, 2, 1, ()=> {
            if(cles)
            {
                this.scene.start('scene2');
            }
        })
        
        this.physics.add.overlap(this.player, this.ennemis, this.pertehp, null,this);
        this.physics.add.overlap(this.player, this.groupeMunitions, this.recupMunition, null,this);
        this.physics.add.overlap(this.player, this.key, this.getKey, null,this);
        this.physics.add.overlap(this.player, this.basket, this.recupBasket, null,this);
        this.physics.add.overlap(this.groupeBalles, this.ennemis, this.dead, null,this);
        this.physics.add.overlap(this.player, this.groupeHp, this.recupHp, null,this);
        this.physics.add.overlap(this.player, this.pistolet, this.recupArme, null,this);
        this.physics.add.collider(this.player, this.top);
        this.physics.add.collider(this.ennemis, this.top);
        this.top.setCollisionByProperty({collides:true});
        this.physics.add.collider(this.player, this.bot);
        this.bot.setCollisionByProperty({collides:true});

    }
    update(){
        this.hptext.setText('hp : ' +hp);
        this.muntext.setText('Mun : ' +munition);
        let pad = Phaser.Input.Gamepad.Gamepad;
        


        if(this.ennemis.getLength()==0)
        {
            cles = true ;
            this.top.replaceByIndex(107, 123, 36, 11, 1, 1, 1);
            this.top.replaceByIndex(108, 124, 37, 11, 1, 1, 1);
                  
        }

        if(this.input.gamepad.total){
            pad = this.input.gamepad.getPad(0)
            xAxis = pad ? pad.axes[0].getValue() : 0;
            yAxis = pad ? pad.axes[1].getValue() : 0;
        }
    
        if ( this.boutonCourse.isDown && run )
        {
            vitesse = 500;
        }
        else {
            vitesse = 300;
        }

        if (this.cursors.left.isDown || pad.left)
        {
            this.player.direction = 'left';
            if(arme){this.player.anims.play('leftArme',true);}
            else{this.player.anims.play('left',true);}
            this.player.setVelocityX(-vitesse);
        }
        else if (this.cursors.right.isDown|| pad.right)
        {
            this.player.direction='right';
            if(arme){this.player.anims.play('rightArme',true);}
            else{this.player.anims.play('right',true);}
            this.player.setVelocityX(vitesse);
        }
        else if (this.cursors.up.isDown || pad.up)
        {
            this.player.direction='up';
            if(arme){this.player.anims.play('upArme',true);}
            else{this.player.anims.play('up',true);}
            this.player.setVelocityY(-vitesse);
        }
        else if (this.cursors.down.isDown|| pad.down)
        {
            this.player.direction='down';
            if(arme){this.player.anims.play('downArme',true);}
            else{this.player.anims.play('down',true);}
            this.player.setVelocityY(vitesse);
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
        for(var i = 0; i < this.ennemis.getChildren().length; i++){
            var ennemi = this.ennemis.getChildren()[i];

            ennemi.movement(this.player);
          
        }
        if ( Phaser.Input.Keyboard.JustDown(this.boutonFeu)) {
            this.tirer(this.player);
        }
    }
    pertehp(player,ennemi){
          
        if (invulnerable == false )
        {
            hp--; 
            invulnerable=true;
            this.time.addEvent({delay: 2000, callback: function(){invulnerable= false;}, callbackScope: this}); 

            if (hp>0)
            {
                this.time.addEvent({delay: 200, repeat: 9, callback: function(){player.visible= !player.visible;}, callbackScope: this}); 
            }

            
        }
    }
    tirer(player) {
       if (peutTirer && munition > 0 && arme )
       {
        var coefDirX;
        var coefDirY;
             munition--;
             peutTirer = false;
             this.time.addEvent({delay: fireRate, callback: function(){peutTirer= true;}, callbackScope: this}); 
             var coefDir;
	         if (this.player.direction == 'left') { coefDirX = -1; } else if(this.player.direction == 'right') { coefDirX = 1 } else {coefDirX = 0}
             if (this.player.direction == 'up') {coefDirY = -1;} else if(this.player.direction == 'down') {coefDirY = 1} else {coefDirY =0}
             // on crée la balle a coté du joueur
             var balle = this.groupeBalles.create(player.x + (25 * coefDirX), player.y - 4, 'balle');
             // parametres physiques de la balle.
             balle.setCollideWorldBounds(false);
             balle.body.allowGravity =false;
             balle.setVelocity(1000 * coefDirX, 1000 * coefDirY); // vitesse en x et en y
        }
    }
    dead(balles, ennemis)
    {
        let random = Math.floor(Math.random()*2);
        if (random == 0 ){
            var munition = this.groupeMunitions.create(ennemis.x,ennemis.y,'munition')
        } 
        else
        {
            var munition = this.groupeHp.create(ennemis.x,ennemis.y,'hp')

        }     
        ennemis.destroy();
        balles.destroy();
    }
    recupMunition(player, munitions)
    {
        munition +=10;
        munitions.destroy();
    }
    recupHp(player,cellule)
    {
        if (hp<10)
        {
        hp +=1;
        cellule.destroy();
        }
    }
    recupArme(player, pistolet)
    {
        arme = true;
        pistolet.destroy();
    }
    recupBasket(player, basket)
    {
        run = true;
        basket.destroy();
    }

    getKey(player, key)
    {
        cles = true;
        this.top.replaceByIndex(107, 123, 36, 11, 1, 1, 1);
        this.top.replaceByIndex(108, 124, 37, 11, 1, 1, 1);
        key.destroy();
    }
}