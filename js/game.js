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

const lanes = [-3, 0, 3];
let playerSpeed = 0.1;
let playerLane = 0;
let player;
let playerMixer;
let trackFlat;
let brain;

function init(){
    createScene();
    animate();
};

function createScene(){
    setupLights();

    scene.background = new THREE.Color(0xcccccc);
    document.body.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);

    loader.load('models/Stickman_with_anims.glb', (gltf) => {
        player = gltf.scene;
        scene.add(player);
        console.log(player);

        playerMixer = new THREE.AnimationMixer(player);

        const animations = gltf.animations;
        const action = playerMixer.clipAction(animations[4]);
        action.play();
        console.log('Available animations:', animations);
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
      spawnBrain(1, 3, 0, GameColors.v);

    });

    camera.position.set(0, 8, -10);
    camera.lookAt(scene.position);
}

function spawnBrain(x,y,z,color)
{
    const clone = brain.clone();
    clone.position.set(x,y,z);

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
    light.position.set(-3, 10, -12); //default; light shining from top
    light.target.position.set(0, 0, 0);

    scene.add(light); 
    scene.add(light.target);

    const ambLight = new THREE.AmbientLight(0xbcc7d6)
    scene.add(ambLight);
  };

function animate() {
    requestAnimationFrame(animate);

    if (playerMixer) {
        playerMixer.update(0.01);
    }
    
   // player.position.z += playerSpeed;
   // player.position.x = THREE.MathUtils.lerp(player.position.x, lanes[playerLane + 1], 0.1);
  //  camera.position.z = player.position.z + 10;

    renderer.render(scene, camera);
};

init();
