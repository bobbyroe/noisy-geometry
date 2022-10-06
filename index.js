import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js";
import { ImprovedNoise } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/math/ImprovedNoise.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.18);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 4;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

function getBall() {
  const radius = 2;
  const geometry = new THREE.IcosahedronGeometry(radius, 24);
  const material = new THREE.MeshNormalMaterial({
    // wireframe: true,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  const noise = new ImprovedNoise();

  let v3 = new THREE.Vector3();
  let p = new THREE.Vector3();
  let pos = geometry.attributes.position;
  pos.usage = THREE.DynamicDrawUsage;
  const len = pos.count;

  function update(t) {
    for (let i = 0; i < len; i += 1) {
      p.fromBufferAttribute(pos, i).normalize();
      v3.copy(p).multiplyScalar(2.9);
      let ns = noise.noise(v3.x + Math.cos(t), v3.y + Math.sin(t), v3.z + t);
      v3.copy(p)
        .setLength(radius)
        .addScaledVector(p, ns * 0.4);
      pos.setXYZ(i, v3.x, v3.y, v3.z);
    }
    pos.needsUpdate = true;
  }
  return {
    mesh,
    update,
  };
}

const ball = getBall();
scene.add(ball.mesh);

const timeMult = 0.001;
function animate(t) {
  requestAnimationFrame(animate);

  ball.update(t * timeMult);

  renderer.render(scene, camera);
}

animate(0);
