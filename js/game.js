import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const loader = new GLTFLoader();

const camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const GameColors = {
    orange: 0xff8c00,
    blue: 0x1685f8,
    violet: 0x9d46dd,
};

let playerModel;
let playerMixer;
let trackFlat;
let brain;

let playerPositionIndex = 1; 
const lanePositions = [-3, 0, 3]; 
let speed = 0.1;

let isPlayerRun = false; 
let isGameStart = false;

function init(){
    createScene();
    animate();
    subciribeEvents();
}

function createScene(){
    setupLights();

    scene.background = new THREE.Color(0xcccccc);
    document.body.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);

    loader.load('models/Stickman_with_anims.glb', (gltf) => {
        playerModel = gltf.scene;
        playerModel.position.x = lanePositions[playerPositionIndex];
        scene.add(playerModel);
        console.log(playerModel);
        playerMixer = new THREE.AnimationMixer(playerModel);
        const animations = gltf.animations;
        const action = playerMixer.clipAction(animations[4]);
        action.play();
        
        playerModel.traverse((child) => {
          if (child.name === 'Plane') {
          child.visible = false;
        }});
    });


    loader.load('/models/Track_parts.glb', (gltf) => {
        trackFlat = gltf.scene.children[1]; 
        for (let i = 0; i < 15; i++) {
            spawnTrack(0, 0, i * 25);
        }
    });

    loader.load('/models/Brain_model.glb', (gltf) => {
      brain = gltf.scene.children[0];

      spawnBrain(1, 1, 0, GameColors.blue);
      spawnBrain(1, 2, 0, GameColors.orange);
      spawnBrain(1, 3, 0, GameColors.violet);
    });

    camera.position.set(0, 8, -10);
    camera.lookAt(scene.position);
}

function subciribeEvents()
{
    document.addEventListener('click', handleGameStart);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            movePlayerLeft();
        } else if (event.key === 'ArrowRight') {
            movePlayerRight();
        }
    });
}

function handleGameStart(){
    isPlayerRun = true;
    isGameStart = true;
}

function movePlayerLeft() {
  if (playerPositionIndex < 2) {
      playerPositionIndex++;
      playerModel.position.x = lanePositions[playerPositionIndex];
  }
}

function movePlayerRight() {
  if (playerPositionIndex > 0) {
      playerPositionIndex--;
      playerModel.position.x = lanePositions[playerPositionIndex];
  }
}

function spawnBrain(x, y, z, color) {
    const clone = brain.clone();
    clone.position.set(x, y, z);

    clone.traverse((child) => {
        if (child.isMesh) {
            child.material = child.material.clone();
            child.material.color.set(color);
        }
    });

    scene.add(clone);
}

function spawnTrack(x, y, z) {
    const clone = trackFlat.clone();
    clone.position.set(x, y, z);
    scene.add(clone);
}

function setupLights() {
    let light = new THREE.DirectionalLight(0xb7b7b7, 0.9);
    light.position.set(-3, 10, -12);
    light.target.position.set(0, 0, 0);

    scene.add(light);
    scene.add(light.target);

    const ambLight = new THREE.AmbientLight(0xbcc7d6);
    scene.add(ambLight);
}

function animate() {
    requestAnimationFrame(animate);

    if (playerModel) {
      if (isPlayerRun) {
          playerModel.position.z += speed;
      }

      camera.position.z = playerModel.position.z - 10; 
      camera.position.x = playerModel.position.x; 
      camera.lookAt(playerModel.position);

      if (playerMixer) {
          playerMixer.update(0.01);
      }
  }

    renderer.render(scene, camera);
}

init();
