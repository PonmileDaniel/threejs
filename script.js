// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('lab-container').appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(10, 10, 10);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Camera Position
camera.position.set(0, 5, 7);
camera.lookAt(0, 0, 0);

// Lab Environment
const tableGeo = new THREE.PlaneGeometry(10, 10);
const tableMat = new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 10 });
const table = new THREE.Mesh(tableGeo, tableMat);
table.rotation.x = -Math.PI / 2;
scene.add(table);

// Beaker
const beakerGeo = new THREE.CylinderGeometry(1, 1, 3, 32, 1, true); // Open top
const beakerMat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.7, shininess: 50 });
const beaker = new THREE.Mesh(beakerGeo, beakerMat);
beaker.position.set(0, 1.5, 0);
scene.add(beaker);

// Bottles
const bottleGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const hclBottle = new THREE.Mesh(bottleGeo, new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 30 }));
hclBottle.position.set(-2, 1, 2);
hclBottle.name = 'HCl';
scene.add(hclBottle);

const naohBottle = new THREE.Mesh(bottleGeo, new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 30 }));
naohBottle.position.set(2, 1, 2);
naohBottle.name = 'NaOH';
scene.add(naohBottle);

// Labels (using Canvas and Sprite)
function createLabel(text, position) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 128;
  canvas.height = 64;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(text, 64, 40);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(1.5, 0.75, 1);
  sprite.position.set(position.x, position.y + 1.5, position.z);
  scene.add(sprite);
}

createLabel('HCl', hclBottle.position);
createLabel('NaOH', naohBottle.position);
createLabel('Beaker', beaker.position);

// State
let beakerContents = [];
let liquidMesh = null;

// Raycaster for Interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Click Handler
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([hclBottle, naohBottle]);

  if (intersects.length > 0) {
    const bottle = intersects[0].object;
    pourLiquid(bottle);
  }
});

// Pour Liquid Function
function pourLiquid(bottle) {
  if (!liquidMesh) {
    const liquidGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
    const liquidMat = new THREE.MeshPhongMaterial({ 
      color: bottle.name === 'HCl' ? 0x0000ff : 0xff0000, 
      shininess: 50 
    });
    liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.set(0, 0.1, 0);
    liquidMesh.name = 'liquid';
    scene.add(liquidMesh);

    let height = 0.1;
    const interval = setInterval(() => {
      height += 0.1;
      liquidMesh.scale.y = height;
      liquidMesh.position.y = height / 2;
      if (height >= 1) clearInterval(interval);
    }, 100);
  }
  
  addToBeaker(bottle.name);
}

// Reaction Logic
function addToBeaker(chemical) {
  beakerContents.push(chemical);
  checkReaction();
}

function checkReaction() {
  if (beakerContents.includes('HCl') && beakerContents.includes('NaOH') && liquidMesh) {
    liquidMesh.material.color.set(0xff00ff); // Pink for phenolphthalein
    document.getElementById('instruction-text').innerText = 
      'Reaction complete! HCl + NaOH neutralized, turning pink with phenolphthalein.';
  }
}

// Experiment Setup
function startExperiment(type) {
  if (type === 'acid-base') {
    resetLab();
    document.getElementById('instruction-text').innerText = 
      '1. Click the HCl bottle to pour acid into the beaker.\n2. Click the NaOH bottle to add base.\n3. Watch for a color change!';
  }
}

// Reset Lab
function resetLab() {
  beakerContents = [];
  if (liquidMesh) {
    scene.remove(liquidMesh);
    liquidMesh = null;
  }
  document.getElementById('instruction-text').innerText = 
    'Select an experiment to begin.';
}

// Window Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});