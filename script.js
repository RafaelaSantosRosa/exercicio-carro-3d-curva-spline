var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
camera.position.set(200, 500, 300);
camera.lookAt(0, 10, 0);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight);

var renderer = new THREE.WebGLRenderer({
  antialias: true
});
var canvas = renderer.domElement;
document.body.appendChild(canvas);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

const car = createCar();
scene.add(car);

car.rotateX(1.5);
car.rotateY(1);

var curve = new THREE.SplineCurve([
  new THREE.Vector3(-200, 0, 200),
  new THREE.Vector3(-100, 100, 100),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(100, -100, 100),
  new THREE.Vector3(200, 0, 200),
  new THREE.Vector3(-200, -0, 200)
]);

var points = curve.getPoints(199);

var geometry = new THREE.BufferGeometry().setFromPoints(points);

var material = new THREE.LineBasicMaterial({
  color: 0xffffff
});

var curveObject = new THREE.Line(geometry, material);

scene.add(curveObject);

var clock = new THREE.Clock();
var time = 0;



function resize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

var pos = 0;
var ang = 0;

function render() {
  car.position.x = points[Math.round(pos)].x;
  car.position.y = points[Math.round(pos)].y;
  if (resize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  
  renderer.render(scene, camera);

  curveObject.geometry.dispose();
  curveObject.geometry = geometry;

  pos += 0.4;
  
  if (Math.round(pos) >= points.length) {
    pos = 0;
  }
  if((points[Math.round(pos)].y != points[Math.round(pos-0.3)].y) && (points[Math.round(pos)].x != points[Math.round(pos-0.3)].x)){

    ang = Math.atan2(points[Math.round(pos)].y - car.position.y, points[Math.round(pos)].x - car.position.x);
    car.rotation.y = ang;
  }
  requestAnimationFrame(render);
}


render();

// #region Desenhar Carro 

function createWheels() {
  const geometry = new THREE.BoxBufferGeometry(12, 12, 33);
  const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const wheel = new THREE.Mesh(geometry, material);
  return wheel;
}


function createCar() {
  const car = new THREE.Group();

  const backWheel = createWheels();
  backWheel.position.y = 6;
  backWheel.position.x = -18;
  car.add(backWheel);

  const frontWheel = createWheels();
  frontWheel.position.y = 6;
  frontWheel.position.x = 18;
  car.add(frontWheel);

  const main = new THREE.Mesh(
      new THREE.BoxBufferGeometry(60, 15, 30),
      new THREE.MeshLambertMaterial({ color: 0xFF69b4})
  );
  main.position.y = 12;
  car.add(main);

  const carFrontTexture = getCarFrontTexture();

  const carBackTexture = getCarFrontTexture();

  const carRightSideTexture = getCarSideTexture();

  const carLeftSideTexture = getCarSideTexture();
  carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
  carLeftSideTexture.rotation = Math.PI;
  carLeftSideTexture.flipY = false;

  const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 12, 24), [
      new THREE.MeshLambertMaterial({ map: carFrontTexture }),
      new THREE.MeshLambertMaterial({ map: carBackTexture }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
      new THREE.MeshLambertMaterial({ color: 0xffffff }), // bottom
      new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
      new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
  ]);
  cabin.position.x = -6;
  cabin.position.y = 25.5;
  car.add(cabin);

  return car;
}


function getCarFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);

  return new THREE.CanvasTexture(canvas);
}

// #endregion