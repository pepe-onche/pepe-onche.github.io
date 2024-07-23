import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor() {
        super('Game')
        this.groundHeight = 60
        this.stageTypes = ['createLMC']

        this.shitpost = [
            'JE MANGE SA MERDE',
            'QU\'EST-CE QUI EST PETIT ET MARRON ? UN MARRON',
            'POST OU CANCER',
            'AYAAAAA',
            'AHIII',
            'CLIQUEZ BANDE DE SALOPES',
            'AH ÇA C\'EST BEAU, BRAVO CHAMPION',
            'JE LICK SES FEET',
            '#FREEMICKEY',
            'JE PARTIRA PAS',
        ]
    }

    preload() {
        this.load.image('ground', 'assets/ground2.png')
        this.load.image('bg1', 'assets/bg1.png')
        this.load.image('bg2', 'assets/bg2.png')
        this.load.image('bg3', 'assets/bg3.png')
        this.load.image('player', 'assets/player.png')
        this.load.spritesheet('lmc', 'assets/lmc5.png', {
            frameWidth: 670,
            frameHeight: 298
        })
        this.load.spritesheet('player_running', 'assets/player_running.png', {
            frameWidth: 222,
            frameHeight: 321
        })

        this.load.audio('main_music', 'assets/lady-of-the-80s.mp3')
        this.load.audio('audio_wolf', 'assets/wolf.mp3')
    }

    create() {
        this.mainMusic = this.sound.add('main_music', { loop: true, volume: 0.5 })
        this.wolfSound = this.sound.add('audio_wolf', { loop: false })
        this.mainMusic.play()

        this.anims.create({
            key: 'run1',
            frames: this.anims.generateFrameNumbers('player_running', { start: 0, end: 2 }),
            frameRate: 16,
            repeat: 0
        });
        this.anims.create({
            key: 'run2',
            frames: this.anims.generateFrameNumbers('player_running', { start: 3, end: 5 }),
            frameRate: 16,
            repeat: 0
        });

        this.anims.create({
            key: 'lmc_running',
            frames: this.anims.generateFrameNumbers('lmc', { start: 0, end: 11 }),
            frameRate: 30,
            repeat: -1
        });

        this.score = 0
        this.stage = 0
        this.started = false

        this.backgroundLayer3 = this.add.tileSprite(0, this.scale.height - 360, this.scale.width, this.textures.get('bg2').getSourceImage().height, 'bg3');
        this.backgroundLayer3.setOrigin(0, 0);
        this.backgroundLayer3.setScrollFactor(0);
        this.backgroundLayer3.postFX.addBlur(0, 3, 3, 1);

        this.backgroundLayer2 = this.add.tileSprite(0, this.scale.height - 360, this.scale.width, this.textures.get('bg2').getSourceImage().height, 'bg2');
        this.backgroundLayer2.setOrigin(0, 0);
        this.backgroundLayer2.setScrollFactor(0);
        this.backgroundLayer2.postFX.addBlur(0, 2, 2, 1);

        this.backgroundLayer1 = this.add.tileSprite(0, this.scale.height - 260, this.scale.width, this.textures.get('bg1').getSourceImage().height, 'bg1');
        this.backgroundLayer1.setOrigin(0, 0);
        this.backgroundLayer1.setScrollFactor(0);
        this.backgroundLayer1.postFX.addBlur(0, 1, 1, 1);

        this.ground = this.add.tileSprite(0, this.scale.height - 321, this.scale.width, this.textures.get('ground').getSourceImage().height, 'ground');
        this.ground.setOrigin(0, 0);
        this.ground.setScrollFactor(0);

        this.player = this.physics.add.sprite(200, 0, 'player_running', 2)
        this.player.y = this.scale.height - (this.player.height / 2) - this.groundHeight;

        this.cameras.main.setBounds(0, 0, Infinity, this.cameras.main.height);
        this.physics.world.setBounds(0, 0, Infinity, this.cameras.main.height);

        this.scoreText = this.add.text(20, 16, '', { fontSize: '36px', fill: '#000', fontStyle: 'bold' })
        this.scoreText.setScrollFactor(0)
        this.stageText = this.add.text(20, 56, '', { fontSize: '36px', fill: '#000', fontStyle: 'bold' })
        this.stageText.setScrollFactor(0)
        this.cameras.main.startFollow(this.player, false, 0.3, 1, 300, 0)

        this.loadingBar = this.add.graphics();
        this.loadingBar.fillStyle(0x000000, 1);
        this.loadingBar.fillRect(
            0,
            0,
            this.scale.width,
            5,
        );
        this.loadingBar.setScrollFactor(0);

        // this.cameras.main.postFX.addPixelate(4)
        this.cameras.main.postFX.addBloom(0xffffff, 1, 1, 1, 1, 1)

        this.createPeace()

        this.input.on('pointerdown', () => {
            this.playerStep()
        })
    }

    playerStep() {
        // this.player.x += 10

        this.tweens.add({
            targets: this.player,
            x: this.player.x+130,
            y: this.player.y,
            duration: 50,
            ease: 'Linear',
            onComplete: () => {
            }
        })

        if (this.score % 2 === 0) this.player.play('run1')
        else this.player.play('run2')

        this.score += 1
        this.scoreText.setText(this.score)

        if (this.score === 10) {
            this.started = true
            this.createRandomStage()
        }
    }

    update() {
        this.backgroundLayer1.tilePositionX = this.cameras.main.scrollX * 0.5;
        this.backgroundLayer2.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.backgroundLayer3.tilePositionX = this.cameras.main.scrollX * 0.1;
        this.ground.tilePositionX = this.cameras.main.scrollX;

        if (!this.started) {
            this.loadingBar.clear();
            return
        }

        if (this.enemy) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.enemy.x, this.enemy.y);
    
            if (distance > (this.enemyDistance || 30)) {
                this.physics.moveTo(this.enemy, this.player.x, this.enemy.y, 500+80*this.stage);
            } else {
                this.mainMusic.destroy()
                this.enemy.destroy()
                delete this.enemy
                this.scene.start('GameOver')
            }
        }

        if (this.peaceTimer && this.peaceTimer.getProgress() < 1) {
            let progress = this.peaceTimer.getProgress()
            this.loadingBar.clear();
            this.loadingBar.fillStyle(0x000000, 1);
            this.loadingBar.fillRect(
                0,
                0,
                this.scale.width * progress,
                5
            );
        } else if (this.stageTimer && this.stageTimer.getProgress() < 1) {
            let progress = this.stageTimer.getProgress()
            this.loadingBar.clear();
            this.loadingBar.fillStyle(0x000000, 1);
            this.loadingBar.fillRect(
                0,
                0,
                this.scale.width * progress,
                5
            );
        }
    }

    stageSwitcher() {
        this.createPeace()
        this.peaceTimer = this.time.addEvent({
            delay: 5000,
            callback: this.createRandomStage,
            callbackScope: this,
            loop: false
        })
    }

    createRandomStage() {
        this.stage += 1
        this.stageText.setText('STAGE ' + this.stage)
        const randomIndex = Math.floor(Math.random() * this.stageTypes.length)
        this[this.stageTypes[randomIndex]]() // create the stage
        this.stageTimer = this.time.addEvent({
            delay: 20000,
            callback: this.stageSwitcher,
            callbackScope: this,
            loop: false
        })
    }

    randomSay() {
        if (!this.started) return

        const randomIndex = Math.floor(Math.random() * this.shitpost.length)
        this.say(this.shitpost[randomIndex])
    }

    createPeace() {
        this.randomSay()

        if (this.enemy) {
            this.enemy.destroy()
            delete this.enemy
        }

        this.setBackground(0x999999)
    }

    createLMC() {
        this.say('MERDE, UN LOUP MANGE-COUILLES !')
        this.wolfSound.play()
        this.enemy = this.physics.add.sprite(0, 0, 'lmc', 0)
        this.enemy.x = this.player.x - this.scale.width * 0.75
        this.enemy.y = this.cameras.main.height - (this.enemy.height / 2) - this.groundHeight + 40
        this.enemy.play('lmc_running')
        this.enemyDistance = 220

        this.setBackground(0xff2222)
    }

    setBackground(color) {
        this.cameras.main.setBackgroundColor(color)
        this.backgroundLayer1.setTint(this.blendColor(0x000000, color, 0.5))
        this.backgroundLayer2.setTint(this.blendColor(0x000000, color, 0.3))
        this.backgroundLayer3.setTint(this.blendColor(0x000000, color, 0.15))
    }

    say(message, duration=2000) {
        const notificationHeight = 40
        const margin = 150
        const padding = 20
        const y = 270

        // Create the text for the notification
        const text = this.add.text(
            this.scale.width - margin,
            y + notificationHeight / 2,
            message, {
            fontSize: '30px',
            fill: '#ffffff',
            fontStyle: 'bold',
            align: 'right',
            wordWrap: { width: 700 }
        }).setOrigin(1, 0.5);
        text.setDepth(1001)
        text.setScrollFactor(0)

        // Create background for the notification
        const bg = this.add.graphics()
        bg.fillStyle(0x000000);
        bg.fillRoundedRect(
            this.scale.width - text.width - margin - padding,
            y,
            text.width+padding*2,
            notificationHeight,
            6
        );
        bg.setDepth(1000)
        bg.setScrollFactor(0)

        const graphics = this.add.graphics()
        graphics.fillStyle(0x000000, 1)
        graphics.beginPath()
        graphics.moveTo(text.x+padding-20, y + notificationHeight)
        graphics.lineTo(text.x+padding-20, y + notificationHeight+20)
        graphics.lineTo(text.x+padding-40, y + notificationHeight)
        graphics.closePath()
        graphics.fillPath()
        graphics.setDepth(1000)
        graphics.setScrollFactor(0)

        // Add animation for the notification (e.g., fade in)
        this.tweens.add({
            targets: [bg, text, graphics],
            alpha: { from: 0, to: 1 },
            ease: 'Cubic.easeInOut',
            duration: 500,
            onComplete: () => {
                // Hide after duration
                this.time.delayedCall(duration, () => {
                    this.tweens.add({
                        targets: [bg, text, graphics],
                        alpha: { from: 1, to: 0 },
                        ease: 'Cubic.easeInOut',
                        duration: 500,
                        onComplete: function () {
                            bg.destroy();
                            text.destroy();
                            graphics.destroy();
                        }
                    });
                });
            }
        });
    }

    showNotification(scene, message, duration) {
        const notificationWidth = 600;
        const notificationHeight = 40;
        const margin = 20;

        // Create background for the notification
        const bg = scene.add.graphics();
        bg.fillStyle(0x000000);
        bg.fillRoundedRect(
            scene.scale.width - notificationWidth - margin,
            margin,
            notificationWidth,
            notificationHeight,
            6
        );
        bg.setScrollFactor(0)

        // Create the text for the notification
        const text = scene.add.text(
            scene.scale.width - notificationWidth / 2 - margin,
            margin + notificationHeight / 2,
            message, {
            fontSize: '22px',
            fill: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: notificationWidth - 20 }
        }).setOrigin(0.5);
        text.setScrollFactor(0)

        // Add animation for the notification (e.g., fade in)
        scene.tweens.add({
            targets: [bg, text],
            alpha: { from: 0, to: 1 },
            ease: 'Cubic.easeInOut',
            duration: 500,
            onComplete: function () {
                // Hide after duration
                scene.time.delayedCall(duration, () => {
                    scene.tweens.add({
                        targets: [bg, text],
                        alpha: { from: 1, to: 0 },
                        ease: 'Cubic.easeInOut',
                        duration: 500,
                        onComplete: function () {
                            bg.destroy();
                            text.destroy();
                        }
                    });
                });
            }
        });
    }

    blendColor(foregroundHex, backgroundHex, alpha) {
        // Convert hex to RGB components
        function hexToRGB(hex) {
            return {
                r: (hex >> 16) & 0xFF,
                g: (hex >> 8) & 0xFF,
                b: hex & 0xFF
            };
        }

        // Convert RGB components to hex
        function rgbToHex(r, g, b) {
            return (r << 16) | (g << 8) | b;
        }

        const foregroundRGB = hexToRGB(foregroundHex);
        const backgroundRGB = hexToRGB(backgroundHex);

        const r = Math.round(alpha * foregroundRGB.r + (1 - alpha) * backgroundRGB.r);
        const g = Math.round(alpha * foregroundRGB.g + (1 - alpha) * backgroundRGB.g);
        const b = Math.round(alpha * foregroundRGB.b + (1 - alpha) * backgroundRGB.b);

        return rgbToHex(r, g, b);
    }
}
