import { Scene } from 'phaser';

export class MusicManager extends Scene {
    constructor() {
        super('MusicManager');
        this.backgroundMusic = null;
        this.isPlaying = false;
    }

    preload() {
    }

    create() {
        // Add and play background music if not already playing
        if (!this.backgroundMusic) {
            this.backgroundMusic = this.sound.add('main_music', { loop: true, volume: 0.7 });
            this.backgroundMusic.play();
            this.isPlaying = true;
        }
    }

    playEnemyMusic() {
        if (this.isPlaying) {
            this.backgroundMusic.pause();
            this.otherMusic = this.sound.add('enemy_music', { loop: false, volume: 0.7 });
            this.otherMusic.play();
            this.otherMusic.once('complete', () => {
                this.backgroundMusic.resume();
            });
        }
    }

    pauseEnemyMusic() {
        if (this.isPlaying && this.otherMusic) {
            this.otherMusic.pause();
            this.isPlaying = false;
        }
    }

    pauseBackgroundMusic() {
        if (this.isPlaying) {
            this.backgroundMusic.pause();
            this.isPlaying = false;
        }
    }

    resumeBackgroundMusic() {
        if (!this.isPlaying && this.backgroundMusic) {
            this.backgroundMusic.resume();
            this.isPlaying = true;
        }
    }
}

