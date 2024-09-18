import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const lanes = [-3, 0, 3];
const blueColor = new THREE.Color(0x0dabf0);
const purpleColor = new THREE.Color(0x8d1bac);
const orangeColor = new THREE.Color(0xe6a118);

let playerSpeed = 0.1;
let playerLane = 0;
let player;
let trackFlat;
let brain;

function init(){
    createScene();
    animate();
};

function createScene(){
    scene.background = new THREE.Color(0xcccccc);
    document.body.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);

    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    player = new THREE.Mesh(geometry, material);
    player.position.y = 1;
    scene.add(player);

    camera.position.set(0, 5, 10);
    camera.lookAt(scene.position);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            playerLane = Math.max(playerLane - 1, -1);
        }
        if (event.key === 'ArrowRight') {
            playerLane = Math.min(playerLane + 1, 1);
        }
    });

    loader.load('/models/Track_parts.glb', (gltf) => {
        trackFlat = gltf.scene.children[1]; 
        for (let i = 0; i < 15; i++) {
            spawnTrack(0, 0, -i * 25);
        }
    });

    loader.load('/models/Brain_model.glb', (gltf) => {
      brain = gltf.scene.children[0];

      spawnBrain(1, 1, 0, blueColor);
      spawnBrain(1, 2, 0, purpleColor);
      spawnBrain(1, 3, 0, orangeColor);

    });
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

function animate() {
    requestAnimationFrame(animate);

    // player.position.z -= playerSpeed;
    // player.position.x = THREE.MathUtils.lerp(player.position.x, lanes[playerLane + 1], 0.1);
    // camera.position.z = player.position.z + 10;

    renderer.render(scene, camera);
};

init();
