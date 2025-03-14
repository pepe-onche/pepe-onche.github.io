const sb = supabase.createClient('https://toflnsmrnnpfkzjpfuuu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZmxuc21ybm5wZmt6anBmdXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDUzNzQsImV4cCI6MjA1NzMyMTM3NH0.xaJngrx5KnnhuuhtMC6adJUFrkTFRvxy5srwlK0FbVs')

const ACTIONS_COUNT = 10;
const EAT_TIME = 6; // seconds
const FOOD_POS_Y = -25;
const PET_POS_Y = 120;
const PET_SPEED = 50;

let pets = {};
let petContainers = {};
let petSprites = {};
let foodSprites = {};
let foodLevelSprites = [];
let game;

const config = {
    type: Phaser.CANVAS,
    width: 320,
    height: 210,
    pixelArt: true,
    physics: { default: 'arcade' },
    canvas: document.getElementById("canvas"),
    scene: { preload, create, update },
    transparent: true,
    audio: {
        noAudio: true,
    },
};


function preload() {
    this.load.spritesheet('puchitomatchi', 'puchitomatchi.png', { frameWidth: 66, frameHeight: 68 });
    this.load.spritesheet('food', 'food.png', { frameWidth: 26, frameHeight: 28 });
    this.load.image('heart_red', 'heartred.png');
    this.load.image('heart_grey', 'heartgrey.png');
}
async function loadData() {
    const { data } = await sb
        .from('pets')
        .select();
    pets = data.reduce((acc, pet) => ({...acc, [pet.id.toString()]: pet }), {});

    const { data: actions } = await sb
        .from('actions')
        .select()
        .order('id', { ascending: false })
        .limit(ACTIONS_COUNT);

    for (let action of actions.reverse()) {
        addAction(action);
    }
}

async function startGame() {
    await loadData();
    game = new Phaser.Game(config);
}

function statusToAnim(pet, status) {
    return pet.sprite_type+'_'+(status || pet.status);
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
        key: 'puchitomatchi_eat',
        frames: this.anims.generateFrameNumbers('puchitomatchi', { start: 1, end: 1 }),
        frameRate: 2,
        repeat: 0
    });
    this.anims.create({
        key: 'puchitomatchi_walk',
        frames: this.anims.generateFrameNumbers('puchitomatchi', { start: 4, end: 5 }),
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'consume_burger',
        frames: this.anims.generateFrameNumbers('food', { start: 147, end: 149 }),
        frameRate: 4/EAT_TIME,
        repeat: 0
    });


    for (const pet of Object.values(pets)) {
        petContainers[pet.id.toString()] = this.add.container(0, PET_POS_Y);
        petSprites[pet.id.toString()] = this.add.sprite(0, 0, pet.sprite_type).setScale(2);
        petContainers[pet.id.toString()].add(petSprites[pet.id.toString()]);
        petContainers[pet.id.toString()].setPosition(getPetX(pet), PET_POS_Y);
        petSprites[pet.id.toString()].play(statusToAnim(pet));

        foodSprites[pet.id.toString()] = this.add.sprite(0, FOOD_POS_Y, 'food').setScale(2);
        petContainers[pet.id.toString()].add(foodSprites[pet.id.toString()]);
        foodSprites[pet.id.toString()].setVisible(false);
        foodSprites[pet.id.toString()].on('animationcomplete', () => {
            foodSprites[pet.id.toString()].setVisible(false);
        });

        petSprites[pet.id.toString()].setFlipX(pet.flip_x);
        foodSprites[pet.id.toString()].setFlipX(pet.flip_x);

        updateHearts(pet);
    }
}

function updateHearts(pet) {
    for (let sprite of foodLevelSprites) {
        sprite.destroy();
    }
    foodLevelSprites = []
    for (let i = 0; i < pet.max_food; i++) {
        foodLevelSprites.push(game.scene.scenes[0].add.sprite(config.width/2-40*(pet.max_food-1)/2+40*i, 40, pet.food >= i+1 ? 'heart_red' : 'heart_grey').setScale(2));
    }
}

function getPetX(pet) {
    let petWidth = petSprites[pet.id].displayWidth+12*petSprites[pet.id].scale;
    return (config.width-petWidth/2)*pet.pos_x+petWidth/4;
}

function walk(pet, oldPet) {
    const newX = getPetX(pet);
    if (document.hidden) { // Don't animate if the tab is not active
        petContainers[pet.id].setPosition(newX, PET_POS_Y);
    } else {
        const duration = Math.abs(getPetX(oldPet)-newX)/PET_SPEED*1000;
        game.scene.scenes[0].tweens.add({
            targets: petContainers[pet.id.toString()],
            x: newX,
            duration,
            repeat: 0,
            onStart: () => petSprites[pet.id].play(statusToAnim(pet, 'walk')),
            onComplete: () => petSprites[pet.id].play(statusToAnim(pet)),
        });
    }
}

function update() {
}

function addAction(action) {
    const div = document.createElement('div');
    div.className = 'action';
    const time = document.createElement('div');
    time.className = 'time';
    const createdAt = new Date(action.created_at);
    time.textContent = createdAt.toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        hour12: false
    });
    div.appendChild(time);
    const content = document.createElement('div');
    if (action.type === 'feed') {
        content.innerHTML = `<span class="pseudo">${action.username}</span> lui donne à manger`;
    } else {
        return;
    }
    div.appendChild(content);
    document.getElementById('actions').prepend(div);

    const children = Array.from(document.getElementById('actions').children);
    children.slice(ACTIONS_COUNT).forEach(child => child.remove());
}

const channel = sb
  .channel('prod')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'pets' },
    (p) => {
        const newStatus = pets[p.new.id.toString()].status !== p.new.status || pets[p.new.id.toString()].sprite !== p.new.sprite;
        const newFoodLevel = pets[p.new.id.toString()].food !== p.new.food;
        const newPosX = pets[p.new.id.toString()].pos_x !== p.new.pos_x;
        const newFlipX = pets[p.new.id.toString()].flip_x !== p.new.flip_x;

        const oldPet = {...pets[p.new.id.toString()]};

        pets[p.new.id.toString()] = p.new;

        if (newStatus) {
            petSprites[p.new.id.toString()].play(statusToAnim(p.new));
        }
        if (newFoodLevel) {
            updateHearts(p.new);
        }
        if (newFlipX) {
            petSprites[p.new.id].setFlipX(p.new.flip_x);
            foodSprites[p.new.id].setFlipX(p.new.flip_x);
        }
        if (newPosX) {
            walk(p.new, oldPet);
        }
    }
  )
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'actions' },
    (a) => {
        addAction(a.new);

        if (a.new.type === 'feed') {
            const pet = pets[a.new.pet_id];
            const eat_anim = statusToAnim(pet, 'eat');
            if (!document.hidden) { // Don't animate if the tab is not active
                foodSprites[pet.id.toString()].setVisible(true);
                foodSprites[pet.id.toString()].play('consume_burger');
                const anim = petSprites[pet.id.toString()].anims.currentAnim;
                if (anim && anim.key != statusToAnim(pet, 'walk')) {
                    petSprites[pet.id.toString()].play(eat_anim);
                }
            }
            setTimeout(() => {
                const anim = petSprites[pet.id.toString()].anims.currentAnim;
                if (anim && anim.key == eat_anim) {
                    petSprites[pet.id.toString()].play(statusToAnim(pet));
                }
            }, EAT_TIME*1000);
        }
    }
  )
  .subscribe();

startGame()
