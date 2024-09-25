import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Brain {
    constructor(mesh, color) {
        this.mesh = mesh;              
        this.color = color;           
        this.collider = new THREE.Box3().setFromObject(mesh); 
        this.isCollected = false;
    }

    updateCollider() {
        this.collider.setFromObject(this.mesh);
    }
};


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

const lanePositions = [-3, 0, 3]; 
let playerPositionIndex = 1; 
let speed = 0.1;
let playerModel;
let playerMixer;
let playerCollider = new THREE.Box3();
let playerColor = GameColors.orange;
let score = 0;

let trackParts = {};
let brains = [];

let brainModel;
let wallModel;
let gateModel;

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
        console.log(playerModel);
        playerModel.position.x = lanePositions[playerPositionIndex];
        scene.add(playerModel);
        playerMixer = new THREE.AnimationMixer(playerModel);
        const animations = gltf.animations;
        const action = playerMixer.clipAction(animations[4]);
        action.play();
        
        playerModel.traverse((child) => {
          if (child.name === 'Plane') {
          child.visible = false;
        }});

        setPlayerColor(GameColors.orange);
    });


    loader.load('/models/Track_parts.glb', (gltf) => {
        gltf.scene.traverse((child) => {
             trackParts[child.name] = child;
        });
    
        spawnTrack('Plane_flat', 0, 0, 0); 
        spawnTrack('Plane_flat', 0, 0, 25); 
        spawnTrack('Plane_flat', 0, 0, 50); 
        spawnTrack('Plane_flat', 0, 0, 75); 
        spawnTrack('Plane_flat', 0, 0, 100); 
        spawnTrack('Plane_flat', 0, 0, 125); 
        spawnTrack('Plane_flat', 0, 0, 150); 
        spawnTrack('Plane_flat', 0, 0, 175); 

        spawnTrack('Plane_Rotator', 0, 0, 200);

        spawnTrack('Plane_flat', 0, 0, 225); 
        spawnTrack('Plane_flat', 0, 0, 250); 
        spawnTrack('Plane_flat', 0, 0, 275); 

    });

    loader.load('/models/Destructible_wall_with_anim.glb', (gltf) =>{
        wallModel = gltf.scene;
        spawnWall(48);
        spawnWall(250);

    });

    loader.load('/models/Finish_line.glb', (gltf) =>{
        let finish = gltf.scene;
        finish.position.set(0,-2,250);
        scene.add(finish);
    });

    loader.load('/models/Gate_model.glb', (gltf) =>{
        gateModel = gltf.scene;
        spawnGate(2.85, 70, GameColors.orange);
        spawnGate(-2.85, 70, GameColors.violet);
    });

    loader.load('/models/Brain_model.glb', (gltf) => {
      brainModel = gltf.scene.children[0];

      spawnBrain(0, 14, GameColors.violet);
      spawnBrain(0, 18, GameColors.violet);
      spawnBrain(0, 22, GameColors.violet);
      spawnBrain(0, 26, GameColors.violet);

      spawnBrain(-3, 14, GameColors.orange);
      spawnBrain(-3, 18, GameColors.orange);
      spawnBrain(-3, 22, GameColors.orange);
      spawnBrain(-3, 26, GameColors.orange);


      spawnBrain(3, 100, GameColors.blue);
      spawnBrain(3, 104, GameColors.blue);
      spawnBrain(3, 108, GameColors.blue);
      spawnBrain(3, 112, GameColors.blue);

      spawnBrain(0, 100, GameColors.orange);
      spawnBrain(0, 104, GameColors.orange);
      spawnBrain(0, 108, GameColors.orange);
      spawnBrain(0, 112, GameColors.orange);

      spawnBrain(-3, 100, GameColors.violet);
      spawnBrain(-3, 104, GameColors.violet);
      spawnBrain(-3, 108, GameColors.violet);
      spawnBrain(-3, 112, GameColors.violet);

      spawnBrain(0, 126, GameColors.violet);
      spawnBrain(3, 130, GameColors.violet);

      spawnBrain(3, 144, GameColors.violet);
      spawnBrain(3, 148, GameColors.violet);
      spawnBrain(3, 152, GameColors.violet);
      spawnBrain(3, 156, GameColors.violet);

      spawnBrain(0, 144, GameColors.blue);
      spawnBrain(0, 148, GameColors.blue);
      spawnBrain(0, 152, GameColors.blue);
      spawnBrain(0, 156, GameColors.blue);

      spawnBrain(-3, 144, GameColors.orange);
      spawnBrain(-3, 148, GameColors.orange);
      spawnBrain(-3, 152, GameColors.orange);
      spawnBrain(-3, 156, GameColors.orange);

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

function spawnWall(z){
    let clone = wallModel.clone();
    clone.position.set(0, 0, z);
    clone.scale.set(1.2, 1.2, 1.2); 
    scene.add(clone);
}

function spawnBrain(x, z, color) {
    let clone = brainModel.clone();
    clone.position.set(x, 1.5, z);
    clone.scale.set(1.8, 1.8, 1.8); 
    clone.traverse((child) => {
        if (child.isMesh) {
            child.material = child.material.clone();
            child.material.color.set(color);
        }
    });

    let newBrain = new Brain(clone, color);
    brains.push(newBrain);            
    scene.add(clone);
}

function spawnGate(x, z, color){
    let clone = gateModel.clone();
    clone.position.set(x, 0, z);
    clone.scale.set(1.15, 1.15, 1.15); 

    clone.traverse((child) => {
        if (child.isMesh) {
            child.material = child.material.clone();
            child.material.color.set(color);
        }
    });

    scene.add(clone);
}

function spawnTrack(partName, x, y, z) {
    let part = trackParts[partName];
    if (part) {
        let clone = part.clone();
        clone.position.set(x, y, z);
        scene.add(clone); 
    } else {
        console.error(`Track part ${partName} not found`);
    }
}

function setupLights() {
    let light = new THREE.DirectionalLight(0xb7b7b7, 0.9);
    light.position.set(-3, 10, -12);
    light.target.position.set(0, 0, 0);

    scene.add(light);
    scene.add(light.target);

    let ambLight = new THREE.AmbientLight(0xbcc7d6);
    scene.add(ambLight);
}

function checkCollisions() {
    playerCollider.setFromObject(playerModel); 

    for (let i = brains.length - 1; i >= 0; i--) {
        const brain = brains[i];
        brain.updateCollider();
        
        if (playerCollider.intersectsBox(brain.collider)) {
            if (brain.color === playerColor) {
             
                score++;
                console.log(`Brain collected!`);
            } else {
                score--;
                console.log(`Wrong color!`);
            }

            scene.remove(brain.mesh); 
            brains.splice(i, 1); 
            console.log(`Score: ${score}`);
        }
    }
}

function setPlayerColor(color) {
    playerColor = color;
    playerModel.traverse((child) => {
        if (child.isMesh) {
            child.material = child.material.clone();
            child.material.color.set(color);
        }
    });

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

      checkCollisions();        
  }

    renderer.render(scene, camera);
}

init();
