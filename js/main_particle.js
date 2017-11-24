var container,
renderer,
scene,
camera,
start = Date.now(),
fov = 32,
counter = 0;

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

  var height = 512;
  var width = 512;
  var depth = 64;
  var scale = 128.0;
  var randomVals = generateRandomCube(width, height, depth, scale);
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
      },
      time:{
        type: "f",
        value: 0.0
      },
      rM:{
        type: "f",
        value: 1.0
      },
      phiM:{
        type: "f",
        value: 1.0
      },
      thetaM:{
        type: "f",
        value: 1.0
      },
      xM:{
        type: "f",
        value: 1.0
      },
      yM:{
        type: "f",
        value: 1.0
      },
      zM:{
        type: "f",
        value: 1.0
      },
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
        value: 0.5
      }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    vertexShader: document.getElementById('renderVertexShader').textContent,
    fragmentShader: document.getElementById('renderFragShader').textContent
  });

  //initialize FBO
  fbo.init(width, height, renderer, simulationMaterial, renderMaterial);
  scene.add(fbo.particles);
  //scene.add(mesh);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  var gui = new dat.GUI();
  var rParam = {
    rParam: 1.0
  };
  gui.add(rParam, 'radiusScale').onFinishChange(function(value){
    simulationMaterial.uniforms['rM'].value = value;
  });
  var phiParam = {
    phiParam: 1.0
  };
  gui.add(phiParam, 'phiScale').onFinishChange(function(value){
    simulationMaterial.uniforms['phiM'].value = value;
  });
  var thetaParam = {
    thetaParam: 1.0
  };
  gui.add(thetaParam, 'thetaScale').onFinishChange(function(value){
    simulationMaterial.uniforms['thetaM'].value = value;
  });
  var xParam = {
    xParam: 1.0
  };
  gui.add(xParam, 'xScale').onFinishChange(function(value){
    simulationMaterial.uniforms['xM'].value = value;
  });
  var yParam = {
    yParam: 1.0
  };
  gui.add(yParam, 'yScale').onFinishChange(function(value){
    simulationMaterial.uniforms['yM'].value = value;
  });
  var zParam = {
    zParam: 1.0
  };
  gui.add(zParam, 'zScale').onFinishChange(function(value){
    simulationMaterial.uniforms['zM'].value = value;
  });
  onWindowResize();
  window.addEventListener('resize', onWindowResize);
  render();
})

function onWindowResize(){
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function generateRandomCube(x, y, z, scale) {
  var length = x * y * 3;
  var output = new Float32Array(length);
  for(var i = 0; i < x; i++){
    for(var j = 0; j < y; j++){
      /*for(var k = 0; k < z; k++){
        output[(i*x*y*z+j*x*y+k*x)*3] = (i-(x/2))/(x/scale);
        output[((i*x*y*z+j*x*y+k*x)*3)+1] = (j-(y/2))/(y/scale);
        output[((i*x*y*z+j*x*y+k*x)*3)+2] = (k-(z/2))/(z/scale);
      }*/
      output[(i*x+j)*3] = (i-(x/2))/(x/scale);
      output[((i*x+j)*3)+1] = (j-(y/2))/(y/scale);
      output[((i*x+j)*3)+2] = (Math.random()-.5)/(z/scale);
    }
  }
  return output;
}

function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function render() {
  //+++FIAT LVX+++\\
  //counter = counter + 1;
  //if(counter%500==0){
  //  var n = getRandomInt(1,10);
  //  var m = getRandomInt(1,10);
  //  simulationMaterial.uniforms['nval'].value = n;
  //  simulationMaterial.uniforms['mval'].value = m;
  //}

  simulationMaterial.uniforms['time'].value = .005 * (Date.now() - start);
  requestAnimationFrame(render);
  fbo.update();
  //fbo.particles.rotation.x += Math.PI / 180 * .25;
  //fbo.particles.rotation.y -= Math.PI / 180 * .5;
  renderer.render(scene, camera);
}
