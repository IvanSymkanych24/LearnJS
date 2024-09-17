import * as THREE from 'three';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


let scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const loader = new GLTFLoader();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let player = new THREE.Mesh(geometry, material);
player.position.y = 1;
scene.add(player);

let trackGeometry = new THREE.PlaneGeometry(10, 1000);
let trackMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
let track = new THREE.Mesh(trackGeometry, trackMaterial);
track.rotation.x = Math.PI / 2;
track.position.z = -500;
scene.add(track);

camera.position.set(0, 5, 10);
camera.lookAt(player.position);

let playerSpeed = 0.1;
let playerLane = 0;
const lanes = [-3, 0, 3];

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        playerLane = Math.max(playerLane - 1, -1);
    }
    if (event.key === 'ArrowRight') {
        playerLane = Math.min(playerLane + 1, 1);
    }
});

function animate() {
    requestAnimationFrame(animate);

    player.position.z -= playerSpeed;
    player.position.x = THREE.MathUtils.lerp(player.position.x, lanes[playerLane + 1], 0.1);
    camera.position.z = player.position.z + 10;

    renderer.render(scene, camera);
}

animate();