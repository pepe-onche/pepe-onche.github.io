import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor () {
        super('MainMenu');
    }

    preload() {
    }

    create () {
        if (!this.scene.isActive('MusicManager')) {
            this.scene.launch('MusicManager');
        }

        this.add.image(512, 350, 'logo');

        this.add.text(512, 480, 'CLIQUE POUR JOUER', {
            fontFamily: 'Vollkorn', fontSize: 38, color: '#bbbbbb',
            align: 'center'
        }).setOrigin(0.5);

        this.cameras.main.postFX.addBloom(0xffffff, 1, 1, 1, 1, 2)

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
