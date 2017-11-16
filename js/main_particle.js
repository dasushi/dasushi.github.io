var container,
renderer,
scene,
camera,
mesh,
start = Date.now(),
fov = 60;

window.addEventListener('load', function() {
  container = document.getElementById("container");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 500;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  var height = 256;
  var width = 256;
  var randomVals = generateRandom(width, height, 256);
  var randomTexture = new THREE.DataTexture(
    randomVals,
    width,
    height,
    THREE.RGBFormat,
    THREE.FloatType
  );
  randomTexture.needsUpdate = true;
  simulationMaterial = new THREE.ShaderMaterial({
    uniforms: {
      positions: {
        type: "t",
        value: randomTexture
      }
    },
    vertexShader: document.getElementById('simVertexShader').textContent,
    fragmentShader: document.getElementById('simFragShader').textContent
  });
  renderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      positions: {
        type: "t",
        value: null
      },
      pointSize: {
        type: "f",
        value: 2
      }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    vertexShader: document.getElementById('renderVertexShader').textContent,
    fragmentShader: document.getElementById('renderFragShader').textContent
  });

  mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(23, 23, 10, 10),
    material
  );
  //initialize FBO
  framebufferobject.init(width, height, renderer, simulationMaterial, renderMaterial);
  scene.add(mesh);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  onWindowResize();
  window.addEventListener('resize', onWindowResize);
  render();
})

function onWindowResize(){
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function generateRandom(x, y, scale) {
  var length = x * y * 3;
  var output = new Float32Array(length);
  for(var i = 0; i < length; i++){
    output[i] = (Math.random() - .5) * scale;
  }
  return output;
}

function render() {
  //+++FIAT LVX+++
  requestAnimationFrame(render);
  framebufferobject.update();
  framebufferobject.particles.rotation.x += Math.PI / 180 * .5;
  framebufferobject.particles.rotation.y -= Math.PI / 180 * .5;
  renderer.render(scene, camera);
}
