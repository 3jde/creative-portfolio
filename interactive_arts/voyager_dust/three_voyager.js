// 基础场景设置
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 灯光
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// 创建旅行者一号模型 (组合几何体)
const voyager = new THREE.Group();

// 1. 主天线 (抛物面)
const antennaGeom = new THREE.SphereGeometry(10, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
const antennaMat = new THREE.MeshPhongMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
const antenna = new THREE.Mesh(antennaGeom, antennaMat);
antenna.scale.set(1, 0.2, 1); // 压扁成碟形
antenna.position.y = 15;
voyager.add(antenna);

// 2. 机身主体 (多面体)
const bodyGeom = new THREE.BoxGeometry(8, 15, 8);
const bodyMat = new THREE.MeshPhongMaterial({ color: 0xffd700 }); // 金色
const body = new THREE.Mesh(bodyGeom, bodyMat);
voyager.add(body);

// 3. 吊杆与通讯杆
const boomGeom = new THREE.CylinderGeometry(0.5, 0.5, 20);
const boomMat = new THREE.MeshPhongMaterial({ color: 0x888888 });
const boom = new THREE.Mesh(boomGeom, boomMat);
boom.rotation.z = Math.PI / 4;
boom.position.set(-10, 10, 0);
voyager.add(boom);

scene.add(voyager);
camera.position.z = 50;

// 星尘粒子 (使用 Three.js Points)
const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 1000;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  
  // 缓慢旋转
  voyager.rotation.y += 0.005;
  voyager.rotation.x += 0.002;
  
  // 星尘流动
  starField.rotation.z += 0.0005;
  
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});