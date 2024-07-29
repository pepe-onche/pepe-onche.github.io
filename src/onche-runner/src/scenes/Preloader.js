import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });

        this.cameras.main.postFX.addBloom(0xffffff, 1, 1, 1, 1, 2)
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('background', 'bg.png');
        this.load.image('logo', 'logo.png');
        this.load.audio('main_music', 'horror-background-atmosphere-with-creepy-clown-laughter.ogg')
        this.load.audio('enemy_music', 'to-the-death.ogg')

        this.load.image('guide', 'guide.png')
        this.load.image('ground', 'ground.png')
        this.load.image('bg1', 'bg1.png')
        this.load.image('bg2', 'bg2.png')
        this.load.image('bg3', 'bg3.png')
        this.load.image('flag', 'flag.png')
        this.load.spritesheet('fish', 'fish.png', {
            frameWidth: 128,
            frameHeight: 72
        })
        this.load.spritesheet('lmc', 'lmc.png', {
            frameWidth: 670,
            frameHeight: 298
        })
        this.load.spritesheet('mickey', 'mickey.png', {
            frameWidth: 370,
            frameHeight: 300
        })
        this.load.spritesheet('player_running', 'player_running.png', {
            frameWidth: 222,
            frameHeight: 321
        })

        this.load.audio('audio_wolf', 'wolf.ogg')
        this.load.audio('audio_mickey', 'mickey.ogg')

        this.load.image('cortex', 'cortex.png')
        this.load.audio('audio_cortex', 'cortex.ogg')
        this.load.image('morsay', 'morsay.png')
        this.load.audio('audio_morsay', 'morsay.ogg')
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
