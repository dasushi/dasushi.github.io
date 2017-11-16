var container,
renderer,
scene,
camera,
mesh,
start = Date.now(),
fov = 32;

window.addEventListener('load', function() {
  container = document.getElementById("container");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 100;
  material = new THREE.ShaderMaterial({
    uniforms: {
      tSample: {
        type: "t",
        value: THREE.ImageUtils.loadTexture('explosion.png')
      },
      time: {
        type: "f",
        value: 0.0
      }
    },
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragShader').textContent
  });

  mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(23, 23, 10, 10),
    material
  );
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

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

function render() {
  //+++FIAT LVX+++
  material.uniforms['time'].value = .00025 * (Date.now() - start);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
