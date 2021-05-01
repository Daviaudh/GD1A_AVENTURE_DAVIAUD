class Scene1 extends Phaser.Scene{
    constructor()
    {
        super("scene1");
    }
    
    preload()
    {
        this.load.spritesheet('vaisseau', 'assets/SpriteSheet_Vaisseau.png', { frameWidth: 62, frameHeight: 33 });
        this.load.image('Set', 'tileSet.png');
        this.load.image('munition', 'assets/rapidFire.png');
        this.load.image('arme', 'assets/ville.png');
        this.load.image('courir', 'assets/rapidFire.png');
        this.load.image('hp', 'assets/cellule.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('meteorite', 'assets/Meteorite1.png');
        this.load.image('balle', 'assets/laser.png');
        this.load.tilemapTiledJSON('village', 'carte1.json');
        this.load.tilemapTiledJSON('donjon', 'carte2.json');

    }
    create(){
        
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.village = this.make.tilemap({key:'village'});
        this.tileSet = this.village.addTilesetImage('tileSet','Set');
        this.bot = this.village.createStaticLayer('bot', this.tileSet, 0,0);
        this.top = this.village.createDynamicLayer('top', this.tileSet, 0,0);
        this.player = this.physics.add.sprite(500, 450, 'vaisseau');
        this.basket = this.physics.add.sprite(800, 450, 'courir');
        this.player.setCollideWorldBounds(true);
        this.boutonFeu = this.input.keyboard.addKey('A');
        this.boutonCourse = this.input.keyboard.addKey('z');
        this.pistolet = this.physics.add.image(600, 500, 'arme');
        this.key = this.physics.add.image(700, 500, 'key');
        
 

        this.camera=this.cameras.main.setSize(1920,1080);
        this.camera.startFollow(this.player, true, 0.08,0.08);
        this.camera.setBounds(0,0,3200,3200);
        this.hptext = this.add.text(16, 32, 'hp : ' +hp, {fontSize:'32px', fill:'#fff'}).setScrollFactor(0);
        this.muntext = this.add.text(16, 64, 'Mun : ' +munition, {fontSize:'32px', fill:'#fff'}).setScrollFactor(0);
        


        this.ennemis = this.physics.add.group();
        this.groupeBalles = this.physics.add.group();
        this.groupeMunitions = this.physics.add.group();
        this.groupeHp = this.physics.add.group();
        
        new Ennemi(this, 400, 700, 'meteorite' );

        this.top.setTileLocationCallback(41, 15, 1, 1, ()=> {
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
    }
    update(){
        this.hptext.setText('hp : ' +hp);
        this.muntext.setText('Mun : ' +vitesse);
        let pad = Phaser.Input.Gamepad.Gamepad;
        

        if(this.ennemis.getLength()==0)
        {
            this.village.replaceByIndex(20, 21, 41, 15, 1, 1, 1);
            //                          +1, +1,           
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
            this.player.setVelocityX(-vitesse);
        }
        else if (this.cursors.right.isDown|| pad.right)
        {
            this.player.direction='right';
            this.player.setVelocityX(vitesse);
        }
        else if (this.cursors.up.isDown || pad.up)
        {
            this.player.setVelocityY(-vitesse);
        }
        else if (this.cursors.down.isDown|| pad.down)
        {
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
             munition--;
             peutTirer = false;
             this.time.addEvent({delay: fireRate, callback: function(){peutTirer= true;}, callbackScope: this}); 
             var coefDir;
	         if (player.direction == 'left') { coefDir = -1; } else { coefDir = 1 }
             // on crée la balle a coté du joueur
             var balle = this.groupeBalles.create(player.x + (25 * coefDir), player.y - 4, 'balle');
             // parametres physiques de la balle.
             balle.setCollideWorldBounds(false);
             balle.body.allowGravity =false;
             balle.setVelocity(1000 * coefDir, 0); // vitesse en x et en y
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
        this.village.replaceByIndex(20, 21, 40, 14, 3, 3, 1);
        key.destroy();
    }
}