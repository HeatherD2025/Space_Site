import * as THREE from 'three';
import { Text } from 'troika-three-text';
import earth2 from './src/assets/earth2.jpg';
import space from './src/assets/space.jpg';
import moon from './src/assets/moon.jpg';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;


const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// to load an image as a texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(earth2, (texture) => {
});
const texture2 = textureLoader.load(moon, (texture) => {
});

const loader = new THREE.TextureLoader();
loader.load(space, function (texture) {
  texture.colorSpace = THREE.SRGBColorSpace; // ← This is the modern method
  scene.background = texture;
});

texture.encoding = THREE.sRGBEncoding; // (legacy)
renderer.outputEncoding = THREE.sRGBEncoding;

// Add a rotating sphere
const geometry = new THREE.SphereGeometry(1.5, 32, 32);
const material = new THREE.MeshStandardMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// second sphere
const geometry2 = new THREE.SphereGeometry(0.5, 30, 30); // smaller sphere
const material2 = new THREE.MeshStandardMaterial({ map: texture2 });
const secondSphere = new THREE.Mesh(geometry2, material2);

// positioned it to the right of the first sphere
secondSphere.position.x = 2.5;
secondSphere.position.y = .5;

scene.add(secondSphere);

// Parent object to act as the orbital pivot
const orbitPivot = new THREE.Object3D();
scene.add(orbitPivot);
orbitPivot.add(secondSphere);

const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(5, 5, 5);
scene.add(light);

// Add Troika Text
const myText = new Text();
myText.text = 'Hello World!';
myText.fontSize = 0.5;
myText.color = 0xff66cc;
myText.position.set(0, -1.5, 0);

scene.add(myText);
myText.sync(); // Required after setting properties

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  secondSphere.rotation.y += 0.001;

  orbitPivot.rotation.y += 0.01;

  orbitPivot.rotation.z = THREE.MathUtils.degToRad(5);

  renderer.render(scene, camera);
}
animate();
