import * as THREE from 'three'

// Ініціалізація сцени
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Створення персонажа
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
let player = new THREE.Mesh(geometry, material);
scene.add(player);

// Створення треку
let trackGeometry = new THREE.PlaneGeometry(10, 1000);
let trackMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
let track = new THREE.Mesh(trackGeometry, trackMaterial);
track.rotation.x = Math.PI / 2;
track.position.z = -500;
scene.add(track);

camera.position.set(0, 5, 10);
camera.lookAt(player.position);

let playerSpeed = 0.1;
let playerLane = 0;
const lanes = [-2, 0, 2]; // Три смуги для руху

// Управління клавіатурою
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        playerLane = Math.max(playerLane - 1, -1);
    }
    if (event.key === 'ArrowRight') {
        playerLane = Math.min(playerLane + 1, 1);
    }
});

// Анімація
function animate() {
    requestAnimationFrame(animate);

    // Переміщення гравця вперед
    player.position.z -= playerSpeed;

    // Рух вліво/вправо між смугами
    player.position.x = THREE.MathUtils.lerp(player.position.x, lanes[playerLane + 1], 0.1);

    // Оновлення камери
    camera.position.z = player.position.z + 10;

    renderer.render(scene, camera);
}

animate();
