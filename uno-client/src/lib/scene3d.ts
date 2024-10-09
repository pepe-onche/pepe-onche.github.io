import * as BABYLON from 'babylonjs';

const cardWidth = 2;
const cardHeight = 3;

let scene: BABYLON.Scene;
let cardMaterial: BABYLON.StandardMaterial;
let cardBackMaterial: BABYLON.StandardMaterial;

let selfId: string;
let playCard: CallableFunction;

const hands: Map<string, BABYLON.Nullable<BABYLON.Mesh>> = {};

const colors: Map<string, BABYLON.StandardMaterial> = {};

export const createScene = (canvas:HTMLCanvasElement, _selfId: string, _playCard: CallableFunction) => {
  selfId = _selfId;
  playCard = _playCard;
  const engine = new BABYLON.Engine(canvas, true);
  scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, -20), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  // camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, -15), scene);
  light.intensity = 0.7;

  // const material = new BABYLON.StandardMaterial("material", scene);
  // material.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);

  // const cube = BABYLON.MeshBuilder.CreateBox("cube", { height: 5, width: 5, depth: 5 }, scene);
  // cube.material = material;

  // Create materials for the cards (front and back textures)
  cardMaterial = new BABYLON.StandardMaterial("cardMaterial", scene);
  // cardMaterial.diffuseTexture = new BABYLON.Texture("https://example.com/card-face.png", scene);  // Card face texture
  cardMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.6, 0.8);  // Light blue color for front

  cardBackMaterial = new BABYLON.StandardMaterial("cardBackMaterial", scene);
  // cardBackMaterial.diffuseTexture = new BABYLON.Texture("https://example.com/card-back.png", scene);  // Card back texture
  cardBackMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);  // Dark grey color for back

  colors["red"] = new BABYLON.StandardMaterial("colorRed", scene);
  colors["red"].diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
  colors["green"] = new BABYLON.StandardMaterial("colorGreen", scene);
  colors["green"].diffuseColor = new BABYLON.Color3(0.2, 1, 0.2);
  colors["blue"] = new BABYLON.StandardMaterial("colorBlue", scene);
  colors["blue"].diffuseColor = new BABYLON.Color3(0.2, 0.2, 1);
  colors["yellow"] = new BABYLON.StandardMaterial("colorYellow", scene);
  colors["yellow"].diffuseColor = new BABYLON.Color3(1, 1, 0);
  colors["wild"] = new BABYLON.StandardMaterial("colorWild", scene);
  colors["wild"].diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });

  return scene;
}

export const createCard = (cardData) => {
  const material = colors[cardData.color];
  const card = BABYLON.MeshBuilder.CreatePlane("card", {width: cardWidth, height: cardHeight}, scene);
  card.material = material;

  const cardBack = BABYLON.MeshBuilder.CreatePlane("cardBack", {width: cardWidth, height: cardHeight}, scene);
  cardBack.material = cardBackMaterial;

  cardBack.position = new BABYLON.Vector3(0, 0, -0.01);
  cardBack.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);

  const cardGroup = BABYLON.Mesh.MergeMeshes([card, cardBack], true, false, undefined, false, true);
  cardGroup?.setPivotPoint(new BABYLON.Vector3(cardWidth/2, cardHeight/2, 0));
  return cardGroup;
}

export const dealCards = (players, cardsData) => {
  hands[selfId] = [];
  const center = new BABYLON.Vector3(0, 0, 3);
  const n = cardsData.length;
  const offset = 1;
  for (let i = 0; i < n; i++) {
    const card = createCard(cardsData[i]);
    card.position.x = center.x - (n*cardWidth+(n-1)*offset)/2+i*cardWidth+i*offset;
    hands[selfId].push(card);
    card.actionManager = new BABYLON.ActionManager(scene);
    card.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPickTrigger, 
      function(evt) {
        const cardIndex = hands[selfId].findIndex(c => c === card);

        if (cardIndex >= 0) {
          playCard(cardIndex);
        }
      }
    ));
  }
}

export const onPlayCard = (playerId, cardIndex, cardData) => {
  if (!hands[playerId]) return;

  const card = hands[playerId][cardIndex];
  card.position.y = 4;

  const animation = new BABYLON.Animation(
    "spherePositionAnimation",   // Name of the animation
    "position",                  // Target property to animate (the position Vector3)
    30,                          // Frame rate (frames per second)
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3, // Type of animation (Vector3 for position)
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE // Loop mode
  );

  // Define keyframes for the animation
  const keyFrames = [];

  // At frame 0, the sphere is at (0, 1, 0)
  keyFrames.push({
    frame: 0,
    value: card.position
  });

  // At frame 50, the sphere moves to (3, 5, 3)
  keyFrames.push({
    frame: 50,
    value: new BABYLON.Vector3(3, 5, 3)
  });

  // At frame 100, the sphere moves back to (0, 1, 0)
  keyFrames.push({
    frame: 100,
    value: new BABYLON.Vector3(0, 0, 0)
  });

  // Set the keyframes to the animation
  animation.setKeys(keyFrames);

  // Attach the animation to the sphere
  card.animations.push(animation);

  // Start the animation
  scene.beginAnimation(card, 0, 100, false);

  hands[playerId].splice(cardIndex, 1);
}
