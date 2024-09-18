import * as THREE from 'three';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const lanes = [-3, 0, 3];

let playerSpeed = 0.1;
let playerLane = 0;

let player;
let track;

function init(){
    createScene();
    animate();
}

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

    let trackGeometry = new THREE.PlaneGeometry(10, 1000);
    let trackMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    track = new THREE.Mesh(trackGeometry, trackMaterial);
    scene.add(track);
    track.rotation.x = Math.PI / 2;
    track.position.z = -500;

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
}

function animate() {
    requestAnimationFrame(animate);

    player.position.z -= playerSpeed;
    player.position.x = THREE.MathUtils.lerp(player.position.x, lanes[playerLane + 1], 0.1);
    camera.position.z = player.position.z + 10;

    renderer.render(scene, camera);
}

init();