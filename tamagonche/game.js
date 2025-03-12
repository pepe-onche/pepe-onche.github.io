const sb = supabase.createClient('https://toflnsmrnnpfkzjpfuuu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZmxuc21ybm5wZmt6anBmdXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDUzNzQsImV4cCI6MjA1NzMyMTM3NH0.xaJngrx5KnnhuuhtMC6adJUFrkTFRvxy5srwlK0FbVs')

let pets = {};
let petSprites = {};
let foodSprite;
let foodLevelSprites = [];
let game;

const config = {
    type: Phaser.CANVAS,
    width: 320,
    height: 240,
    pixelArt: true,
    physics: { default: 'arcade' },
    scene: { preload, create, update },
    transparent: true,
};


function preload() {
    this.load.spritesheet('puchitomatchi', 'puchitomatchi.png', { frameWidth: 66, frameHeight: 68 });
    this.load.spritesheet('food', 'food.png', { frameWidth: 26, frameHeight: 28 });
    this.load.image('heart_red', 'heartred.png');
    this.load.image('heart_grey', 'heartgrey.png');
}
async function loadData() {
    const { data, error } = await sb
        .from('pets')
        .select();
    pets = data.reduce((acc, pet) => ({...acc, [pet.id.toString()]: pet }), {});
}

async function startGame() {
    await loadData();
    game = new Phaser.Game(config);
}

function statusToAnim(pet) {
    return pet.sprite_type+'_'+pet.status;
}

function create() {
    this.anims.create({
        key: 'puchitomatchi_idle',
        frames: this.anims.generateFrameNumbers('puchitomatchi', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
    });
    this.anims.create({
        key: 'puchitomatchi_hungry',
        frames: this.anims.generateFrameNumbers('puchitomatchi', { start: 2, end: 2 }),
        frameRate: 2,
        repeat: 0
    });
    this.anims.create({
        key: 'puchitomatchi_dead',
        frames: this.anims.generateFrameNumbers('puchitomatchi', { start: 12, end: 12 }),
        frameRate: 2,
        repeat: 0
    });
    this.anims.create({
        key: 'consume_burger',
        frames: this.anims.generateFrameNumbers('food', { start: 147, end: 149 }),
        frameRate: 2,
        repeat: 0
    });

    foodSprite = this.add.sprite(160, 120, 'food').setScale(2).setPosition(90, 155);
    foodSprite.setVisible(false);
    foodSprite.on('animationcomplete', () => {
        foodSprite.setVisible(false);
    });

    for (const pet of Object.values(pets)) {
        petSprites[pet.id.toString()] = this.add.sprite(160, 120, pet.sprite_type).setScale(2);
        petSprites[pet.id.toString()].play(statusToAnim(pet));
        updateHearts(pet);
    }
}

function updateHearts(pet) {
    for (let sprite of foodLevelSprites) {
        sprite.destroy();
    }
    foodLevelSprites = []
    for (let i = 0; i < pet.max_food; i++) {
        foodLevelSprites.push(game.scene.scenes[0].add.sprite(config.width/2-40*(pet.max_food-1)/2+40*i, 60, pet.food >= i+1 ? 'heart_red' : 'heart_grey').setScale(2));
    }
}

function update() {
}

const channel = sb
  .channel('prod')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'pets' },
    (p) => {
        const newStatus = pets[p.new.id.toString()].status !== p.new.status || pets[p.new.id.toString()].sprite !== p.new.sprite;
        const newFoodLevel = pets[p.new.id.toString()].food !== p.new.food;

        pets[p.new.id.toString()] = p.new;

        if (newStatus) {
            petSprites[p.new.id.toString()].play(statusToAnim(p.new));
        }
        if (newFoodLevel) {
            updateHearts(p.new);
        }
    }
  )
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'actions' },
    (a) => {
        if (a.new.type === 'feed') {
            foodSprite.setVisible(true);
            foodSprite.play('consume_burger');
            const div = document.createElement('div');
            div.textContent = a.new.username + ' lui donne à manger';
            document.getElementById('events').appendChild(div);
            setTimeout(() => {
                div.remove();
            }, 30000);
        }
    }
  )
  .subscribe();

startGame()
