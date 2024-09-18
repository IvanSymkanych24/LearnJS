import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const lanes = [-3, 0, 3];

let playerSpeed = 0.1;
let playerLane = 0;
let player;
let trackFlat;

function init(){
    createScene();
    animate();
};

function createScene(){
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
    camera.lookAt(player.position);

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
            addTrackPart(0, 0, -i * 25);
        }
    });
}

function addTrackPart(x, y, z) {
    const trackClone = trackFlat.clone();  
    trackClone.position.set(x, y, z);    
    scene.add(trackClone);               
}

function animate() {
    requestAnimationFrame(animate);

    player.position.z -= playerSpeed;
    player.position.x = THREE.MathUtils.lerp(player.position.x, lanes[playerLane + 1], 0.1);
    camera.position.z = player.position.z + 10;

    renderer.render(scene, camera);
};

init();
