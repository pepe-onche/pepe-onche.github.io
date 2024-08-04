import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor() {
        super('Game')
        this.groundHeight = 60
        this.jumpStrength = 1600
        this.gravity = 5000
        this.stepSize = 130
        this.baseStepSize = 130
        this.fishInterval = 200
        this.stageTypes = ['createLMC', 'createMickey']

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
            'L\'ODEUR DES CHATTES NOUS ENIVRES',
        ]

        this.firstEnemySay = 'MERDE, UN LOUP MANGE-COUILLES'

        this.enemySays = [
            'AAAAAAAAHHH',
            'JE SUE DU FION',
            'A L\'AIDE ! POURQUOI Y\'A PERSONNE',
            'PLUS VITE PUTAIN',
        ]

        this.bonuses = [{
            text: 'VITESSE +20%',
            time: 10000,
            apply: () => this.stepSize *= 1.2,
            remove: () => this.stepSize = this.baseStepSize,
        }, {
            text: 'VITESSE +50%',
            time: 10000,
            apply: () => this.stepSize *= 1.5,
            remove: () => this.stepSize = this.baseStepSize,
        }, {
            text: 'CORTEX',
            time: 2000,
            apply: () => this.showFag('cortex', this.cortexSound),
            remove: () => this.hideFag(),
        }, {
            text: 'MORSAY',
            time: 4600,
            apply: () => this.showFag('morsay', this.morsaySound),
            remove: () => this.hideFag(),
        }]
    }

    preload() {
    }

    create() {
        this.musicManager = this.scene.get('MusicManager');
        this.wolfSound = this.sound.add('audio_wolf', { loop: false })
        this.mickeySound = this.sound.add('audio_mickey', { loop: false, volume: 3 })

        this.cortexSound = this.sound.add('audio_cortex', { loop: false, volume: 6 })
        this.morsaySound = this.sound.add('audio_morsay', { loop: false, volume: 3 })

        this.guide = this.add.sprite(0, 0, 'guide').setOrigin(0, 0)
        this.guide.setDepth(10000)
        this.guide.setScrollFactor(0)
        this.guideText1 = this.add.text(this.scale.width / 4, this.scale.height / 2, 'SAUTER', { fontSize: '64px', fill: '#fff', fontFamily: 'Vollkorn' }).setOrigin(0.5)
        this.guideText1.setDepth(10000)
        this.guideText1.setScrollFactor(0)
        this.guideText1.postFX.addBloom(0xffffff, 1, 1, 1, 1, 2)
        this.guideText2 = this.add.text(this.scale.width * 0.75, this.scale.height / 2, 'COURIR', { fontSize: '64px', fill: '#fff', fontFamily: 'Vollkorn' }).setOrigin(0.5)
        this.guideText2.setDepth(10000)
        this.guideText2.setScrollFactor(0)
        this.guideText2.postFX.addBloom(0xffffff, 1, 1, 1, 1, 2)
        this.guideTextZone = this.add.graphics()
        this.guideTextZone.fillStyle(0x000000)
        this.guideTextZone.fillRoundedRect(
            this.scale.width / 2 - 800 / 2,
            this.scale.height / 4 - 100 / 2,
            800,
            100,
            6
        )
        this.guideTextZone.setDepth(10000)
        this.guideTextZone.setScrollFactor(0)
        this.guideText3 = this.add.text(this.scale.width / 2, this.scale.height / 4,
            'Cliquez/pressez à gauche pour sauter, et à droite pour courir.\nSur ordinateur appuyez sur la barre d\'espace pour sauter.',
            { fontSize: '26px', fill: '#fff', fontFamily: 'Vollkorn', align: 'center', fontStyle: 'bold' }
        ).setOrigin(0.5)
        this.guideText3.setDepth(10000)
        this.guideText3.setScrollFactor(0)

        this.guideTextContainer = this.add.container()
        this.guideTextContainer.add([this.guideTextZone, this.guideText3])
        this.guideTextContainer.setDepth(10000)
        this.guideTextContainer.postFX.addBloom(0xffffff, 1, 1, 1, 1, 2)

        if (!this.anims.exists('run1')) {
            this.anims.create({
                key: 'run1',
                frames: this.anims.generateFrameNumbers('player_running', { start: 0, end: 14 }),
                frameRate: 90,
                repeat: 0
            })
        }

        if (!this.anims.exists('run2')) {
            this.anims.create({
                key: 'run2',
                frames: this.anims.generateFrameNumbers('player_running', { start: 15, end: 29 }),
                frameRate: 90,
                repeat: 0
            })
        }

        if (!this.anims.exists('lmc_running')) {
            this.anims.create({
                key: 'lmc_running',
                frames: this.anims.generateFrameNumbers('lmc', { start: 0, end: 11 }),
                frameRate: 30,
                repeat: -1
            })
        }

        if (!this.anims.exists('mickey_running')) {
            this.anims.create({
                key: 'mickey_running',
                frames: this.anims.generateFrameNumbers('mickey', { start: 0, end: 11 }),
                frameRate: 20,
                repeat: -1
            })
        }

        if (!this.anims.exists('fish_rotate')) {
            this.anims.create({
                key: 'fish_rotate',
                frames: this.anims.generateFrameNumbers('fish', { start: 0, end: 24 }),
                frameRate: 30,
                repeat: -1
            })
        }

        this.score = 0
        this.stage = 0
        this.started = false
        this.bonus = false

        this.peaceTimer = null
        this.stageTimer = null
        this.bonusTimer = null

        this.backgroundLayer3 = this.add.tileSprite(0, this.scale.height - 700, this.scale.width, this.textures.get('bg3').getSourceImage().height*2, 'bg3')
        this.backgroundLayer3.setOrigin(0, 0)
        this.backgroundLayer3.setScrollFactor(0)
        // this.backgroundLayer3.setScale(2)
        // this.backgroundLayer3.postFX.addBlur(0, 3, 3, 1)

        this.backgroundLayer2 = this.add.tileSprite(0, this.scale.height - 600, this.scale.width, this.textures.get('bg2').getSourceImage().height*2, 'bg2')
        this.backgroundLayer2.setOrigin(0, 0)
        this.backgroundLayer2.setScrollFactor(0)
        // this.backgroundLayer2.setScale(2)
        // this.backgroundLayer2.postFX.addBlur(0, 2, 2, 1)

        this.backgroundLayer1 = this.add.tileSprite(0, this.scale.height - 452, this.scale.width, this.textures.get('bg1').getSourceImage().height*2, 'bg1')
        this.backgroundLayer1.setOrigin(0, 0)
        this.backgroundLayer1.setScrollFactor(0)
        // this.backgroundLayer1.setScale(2)
        this.backgroundLayer1.tilePositionY = 1
        // this.backgroundLayer1.postFX.addBlur(0, 1, 1, 1);

        this.ground = this.add.tileSprite(0, this.scale.height - 321, this.scale.width, this.textures.get('ground').getSourceImage().height, 'ground');
        this.ground.setOrigin(0, 0);
        this.ground.setScrollFactor(0);

        this.player = this.add.sprite(200, 0, 'player_running', 2)
        this.player.y = this.scale.height - (this.player.height / 2) - this.groundHeight;
        this.playerBaseY = this.player.y
        // this.player.postFX.addShadow(0, 0, 0.1, 0x000000)

        this.cameras.main.setBounds(0, 0, Infinity, this.cameras.main.height);

        this.scoreText = this.add.text(40, 20, '', { fontSize: '64px', fill: '#000', fontFamily: 'Vollkorn' })
        this.scoreText.setScrollFactor(0)
        this.scoreText.postFX.addBloom(0xffffff, 1, 1, 1, 1, 2)
        this.stageText = this.add.text(40, 100, '', { fontSize: '42px', fill: '#000', fontFamily: 'Vollkorn', fontStyle: 'bold' })
        this.stageText.setScrollFactor(0)
        this.stageText.postFX.addBloom(0xffffff, 1, 1, 1, 1, 2)

        this.cameras.main.startFollow(this.player, false, 0.7, 1, 200, 0)

        this.loadingBar = this.add.graphics();
        this.loadingBar.clear()
        this.loadingBar.setScrollFactor(0);

        this.bonusLoadingBar = this.add.graphics();
        this.bonusLoadingBar.clear()
        this.bonusLoadingBar.setScrollFactor(0);

        // this.cameras.main.postFX.addBloom(0xffffff, 1, 1, 1, 1, 2)

        this.createPeace()

        this.input.on('pointerdown', (e) => {
            if (e.x > this.scale.width / 2) this.playerStep()
            else if (!this.isJumping) {
                this.destroyGuide()
                this.isJumping = true
                this.jumpVelocity = this.jumpStrength
            }
        })
    }

    destroyGuide() {
        if (this.guide) {
            this.guide.destroy()
            this.guideText1.destroy()
            this.guideText2.destroy()
            this.guideText3.destroy()
            this.guideTextZone.destroy()
            this.guideTextContainer.destroy()
            delete this.guide
        }
    }

    playerStep() {
        this.destroyGuide()
        // this.player.x += this.stepSize

        this.tweens.add({
            targets: this.player,
            x: this.player.x+this.stepSize,
            duration: 50,
            ease: 'Linear',
        })

        if (!this.isJumping) {
            if (this.score % 2 === 0) this.player.play('run1')
            else this.player.play('run2')
        }

        this.score += 1
        this.scoreText.setText(this.score)

        if (this.score === 10) {
            this.started = true
            this.createRandomStage()
        }

        if (this.score % this.fishInterval === 0) this.spawnFish()
    }

    handleJump(dt) {
        if (this.isJumping) {
            this.player.y -= this.jumpVelocity * (dt / 1000)
            // if (this.enemy && this.enemyType === 'follow') {
            //     this.enemy.y = this.player.y + this.enemyOffsetY
            // }
            this.jumpVelocity -= this.gravity * (dt / 1000)
            if (this.sayContainer) this.sayContainer.y = this.player.y - this.playerBaseY

            // Check if player lands on the ground
            if (this.player.y >= this.playerBaseY) {
                this.player.y = this.playerBaseY
                // if (this.enemy && this.enemyType === 'follow') {
                //     this.enemy.y = this.player.y + this.enemyOffsetY
                // }
                if (this.sayContainer) this.sayContainer.y = 0
                this.isJumping = false
                this.jumpVelocity = 0
            }
        }
    }

    spawnFish() {
        if (this.fish) {
            this.fish.destroy()
            delete this.fish
        }
        if (this.flag) {
            this.flag.destroy()
            delete this.flag
        }

        if (this.bonus) return

        this.flagConsumed = false
        this.flag = this.add.sprite(0, 0, 'flag', 0)
        this.flag.x = this.player.x + this.scale.width * 0.75
        this.flag.y = this.scale.height - this.flag.height/2
        this.fish = this.add.sprite(0, 0, 'fish', 0)
        this.fish.x = this.player.x + this.scale.width * 0.75 - 35
        this.fish.y = this.scale.height - 510
        this.fish.play('fish_rotate')
    }

    applyRandomBonus() {
        this.bonus = true
        
        this.bonusIndex = Math.floor(Math.random() * this.bonuses.length)
        const bonus = this.bonuses[this.bonusIndex]

        bonus.apply()

        this.showNotification(this, bonus.text)

        this.bonusTimer = this.time.addEvent({
            delay: bonus.time,
            callback: () => {
                this.bonus = false
                bonus.remove()
                this.bonusLoadingBar.clear()
            },
            callbackScope: this,
            loop: false
        })
    }

    update(time, dt) {
        this.backgroundLayer1.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.backgroundLayer2.tilePositionX = this.cameras.main.scrollX * 0.1;
        this.backgroundLayer3.tilePositionX = this.cameras.main.scrollX * 0.05;
        this.ground.tilePositionX = this.cameras.main.scrollX;

        // this.debug.text(this.time.fps, 5, 14, '#00ff00');

        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('SPACE')) && !this.isJumping) {
            this.isJumping = true
            this.jumpVelocity = this.jumpStrength
        }

        this.handleJump(dt)

        if (!this.started) {
            this.loadingBar.clear();
            return
        }

        if (this.flag) {
            if(!this.flagConsumed && Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.flag.getBounds())) {
                this.flagConsumed = true
                this.applyRandomBonus()
                // this.fish.destroy()
                // delete this.fish
            }

            // Remove offscreen fish
            if (this.fish && this.fish.x < this.player.x - this.scale.width * 1.5) {
                this.flagConsumed = false
                this.fish.destroy()
                delete this.fish
                if (this.flag) {
                    this.flag.destroy()
                    delete this.flag
                }
            }
        }

        if (this.enemy && this.enemyType === 'follow') {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.enemy.x, this.player.y);
    
            if (distance > (this.enemyDistance || 30)) {
                this.enemy.x += this.enemySpeed * (dt / 1000)
            } else {
                this.wolfSound.play()
                this.dead()
            }
        }

        if (this.enemy && this.enemyType === 'under') {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.enemy.x, this.enemy.y);
    
            if (distance > (this.enemyDistance || 30)) {
                this.enemy.x += this.enemySpeed * (dt / 1000)

                if (this.enemy.x >= this.player.x+this.scale.width/2) {
                    this.enemy.x = this.player.x - this.scale.width * (Math.random()*3+1)
                }
            } else {
                this.dead()
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

        if (this.bonusTimer && this.bonusTimer.getProgress() < 1) {
            let progress = this.bonusTimer.getProgress()
            this.bonusLoadingBar.clear();
            this.bonusLoadingBar.fillStyle(0xffffff, 1);
            this.bonusLoadingBar.fillRect(
                0,
                this.scale.height-5,
                this.scale.width * progress,
                5
            );
        }
    }

    showFag(imageName, sound) {
        if (this.fag) this.fag.destroy()
        this.fag = this.add.sprite(0, this.scale.height / 2, imageName).setOrigin(1, 0.5)
        this.fag.setScrollFactor(0)

        this.tweens.add({
            targets: [this.fag],
            x: { from: 0, to: this.fag.width },
            ease: 'Cubic.easeInOut',
            duration: 300,
        });
        sound.play()
    }

    hideFag() {
        this.tweens.add({
            targets: [this.fag],
            x: { from: this.fag.width, to: 0 },
            ease: 'Cubic.easeInOut',
            duration: 300,
            onComplete: () => {
                this.fag.destroy()
            }
        });
    }

    stageSwitcher() {
        this.createPeace()
        this.stageText.setText('')
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
        const randomIndex = (this.stage-1) % this.stageTypes.length //Math.floor(Math.random() * this.stageTypes.length)
        this[this.stageTypes[randomIndex]]() // create the stage
        this.stageTimer = this.time.addEvent({
            delay: 20000,
            callback: this.stageSwitcher,
            callbackScope: this,
            loop: false
        })
    }

    randomShitpost() {
        if (!this.started) return

        const randomIndex = Math.floor(Math.random() * this.shitpost.length)
        this.say(this.shitpost[randomIndex])
    }

    randomEnemySay(sayList) {
        if (!this.started) return

        const randomIndex = Math.floor(Math.random() * sayList.length)
        this.say(sayList[randomIndex])
    }

    createPeace() {
        this.randomShitpost()
        this.musicManager.pauseEnemyMusic()
        this.musicManager.resumeBackgroundMusic()

        if (this.enemy) {
            this.enemy.destroy()
            delete this.enemy
        }

        this.setBackground(0x999999)
    }

    createLMC() {
        if (this.stage === 1) this.say(this.firstEnemySay)
        else this.randomEnemySay(this.enemySays.concat([
            'FRANCK JE TE CHIE DANS TON FROC',
            'FRANCK QUE LE DIABLE TE SOUFFLE AU CUL',
            'J\'AURAIS JAMAIS DU ACCEPTER CE DILEMME A LA CON',
            'BORDEL ÇA PUE LE PET VASEUX',
            'JE VEUX GARDER MES COUILLES PUTAIN',
        ]))

        this.musicManager.playEnemyMusic()
        this.wolfSound.play()
        this.enemyOffsetY = 50
        this.enemy = this.add.sprite(0, 0, 'lmc', 0)
        this.enemy.x = this.player.x - this.scale.width * 0.75
        this.enemy.y = this.playerBaseY + this.enemyOffsetY
        this.enemy.setOrigin(0.5, 0.5)
        this.enemy.play('lmc_running')
        this.enemyDistance = 220
        this.enemyType = 'follow'
        this.enemySpeed = 500+80*this.stage

        this.setBackground(0xff2222)
    }

    createMickey() {
        if (this.stage === 1) this.say('MICKEY ?')
        else this.randomEnemySay(this.enemySays.concat([
            'IL CHERCHE MAGALIE',
            'RETOURNE FAIRE TES COURSES À LIDL LA SOURIS',
            'IL EST OÙ BABY PROUT ?',
            'IL FAUT FUIR LE FRENCH DREAM',
        ]))

        this.musicManager.playEnemyMusic()
        this.mickeySound.play()
        this.enemy = this.add.sprite(0, 0, 'mickey', 0)
        this.enemy.x = this.player.x - this.scale.width * 1.2
        this.enemy.y = this.cameras.main.height - (this.enemy.height / 2) - this.groundHeight + 80
        this.enemy.setOrigin(0.5, 0.5)
        this.enemy.playReverse('mickey_running')
        this.enemy.scale = 0.6
        this.enemyDistance = 160
        this.enemyType = 'under'
        this.enemySpeed = 1000+80*this.stage

        this.setBackground(0xbbbb22)
    }

    dead() {
        this.enemy.destroy()
        delete this.enemy
        this.musicManager.pauseEnemyMusic()
        this.musicManager.resumeBackgroundMusic()
        const highscore = localStorage.getItem('highscore')
        if (highscore && this.score > highscore || !highscore) {
            localStorage.setItem('highscore', this.score)
        }
        if (this.bonus) {
            this.bonuses[this.bonusIndex].remove()
        }
        this.scene.start('GameOver', { score: this.score })
    }

    setBackground(color) {
        this.cameras.main.setBackgroundColor(color)
        this.backgroundLayer1.setTint(this.blendColor(0x000000, color, 0.5))
        this.backgroundLayer2.setTint(this.blendColor(0x000000, color, 0.3))
        this.backgroundLayer3.setTint(this.blendColor(0x000000, color, 0.15))
    }

    say(message, duration=2000) {
        const margin = 50
        const padding = 15
        const paddingY = 10
        const playerOffset = 250
        const y = 355

        // Create the text for the notification
        this.sayText = this.add.text(
            this.scale.width - playerOffset,
            y,
            message, {
            fontSize: '26px',
            fontFamily: 'Vollkorn',
            fill: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(1, 0.5);
        if (this.sayText.x - this.sayText.width < margin/2) {
            this.sayText.x = this.sayText.width + margin / 2
        }
        this.sayText.setDepth(1001)
        this.sayText.setScrollFactor(0)

        // Create background for the notification
        this.sayBg = this.add.graphics()
        this.sayBg.fillStyle(0x000000);
        this.sayBg.fillRoundedRect(
            this.sayText.x - this.sayText.width - padding,
            y-this.sayText.height/2-paddingY,
            this.sayText.width+padding*2,
            this.sayText.height+paddingY*2,
            6
        );
        this.sayBg.setDepth(1000)
        this.sayBg.setScrollFactor(0)

        this.sayTriangle = this.add.graphics()
        this.sayTriangle.fillStyle(0x000000, 1)
        this.sayTriangle.beginPath()
        this.sayTriangle.moveTo(this.scale.width - playerOffset - 20, y + this.sayText.height/2 + paddingY)
        this.sayTriangle.lineTo(this.scale.width - playerOffset - 20, y + this.sayText.height/2 + paddingY + 20)
        this.sayTriangle.lineTo(this.scale.width - playerOffset - 40, y + this.sayText.height/2 + paddingY)
        this.sayTriangle.closePath()
        this.sayTriangle.fillPath()
        this.sayTriangle.setDepth(1000)
        this.sayTriangle.setScrollFactor(0)

        this.sayContainer = this.add.container()
        this.sayContainer.add([this.sayBg, this.sayText, this.sayTriangle])

        this.sayContainer.postFX.addBloom(0xffffff, 1, 1, 1, 1, 2)

        // Add animation for the notification (e.g., fade in)
        this.tweens.add({
            targets: [this.sayBg, this.sayText, this.sayTriangle],
            alpha: { from: 0, to: 1 },
            ease: 'Cubic.easeInOut',
            duration: 500,
            onComplete: () => {
                // Hide after duration
                this.time.delayedCall(duration, () => {
                    this.tweens.add({
                        targets: [this.sayBg, this.sayText, this.sayTriangle],
                        alpha: { from: 1, to: 0 },
                        ease: 'Cubic.easeInOut',
                        duration: 500,
                        onComplete: () => {
                            this.sayBg.destroy();
                            this.sayText.destroy();
                            this.sayTriangle.destroy();
                            this.sayContainer.destroy();
                        }
                    });
                });
            }
        });
    }

    showNotification(scene, message, duration=2500) {
        const notificationHeight = 40;
        const margin = 20;
        const padding = 20;

        // Create the text for the notification
        const text = scene.add.text(
            0,
            margin + notificationHeight / 2,
            message, {
            fontSize: '26px',
            fill: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: 1000 }
        }).setOrigin(0.5).setAlpha(0);
        text.x = scene.scale.width - text.width / 2 - margin - padding
        text.setScrollFactor(0)
        text.setDepth(1001)

        // Create background for the notification
        const bg = scene.add.graphics();
        bg.setAlpha(0)
        bg.fillStyle(0x000000);
        bg.fillRoundedRect(
            scene.scale.width - text.width - margin - padding*2,
            margin,
            text.width + padding*2,
            notificationHeight,
            6
        );
        bg.setScrollFactor(0)
        bg.setDepth(1000)

        const notifContainer = scene.add.container()
        notifContainer.add([bg, text])

        notifContainer.postFX.addBloom(0xffffff, 1, 1, 1, 1, 2)


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
                            notifContainer.destroy();
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
