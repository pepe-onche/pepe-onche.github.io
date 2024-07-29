import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    preload() {
        this.load.image('gameover', 'assets/gameover.png')
    }

    init(data) {
        this.score = data.score
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x000000);

        this.add.image(512, 250, 'gameover');

        this.add.text(512, 380, 'SCORE: ' + this.score, {
            fontFamily: 'Vollkorn', fontSize: 48, color: '#bbbbbb',
            align: 'center'
        }).setOrigin(0.5);

        const highscore = localStorage.getItem('highscore') || this.score
        this.add.text(512, 450, 'HIGHSCORE: ' + highscore, {
            fontFamily: 'Vollkorn', fontSize: 38, color: '#bbbbbb',
            align: 'center'
        }).setOrigin(0.5);

        this.cameras.main.postFX.addBloom(0xffffff, 1, 1, 1, 1, 2)

        const bg = this.add.graphics()
        bg.fillStyle(0xffffff);
        bg.fillRoundedRect(362, 510, 300, 100, 6);
        bg.setInteractive(new Phaser.Geom.Rectangle(362, 510, 300, 100), Phaser.Geom.Rectangle.Contains)

        this.add.text(512, 560, 'REJOUER', {
            fontFamily: 'Vollkorn', fontSize: 38, color: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        bg.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
