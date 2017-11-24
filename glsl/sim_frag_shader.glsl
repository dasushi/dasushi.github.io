uniform sampler2D positions;
uniform float time;
uniform float rM;
uniform float thetaM;
uniform float phiM;
uniform float xM;
uniform float yM;
uniform float zM;
varying vec2 vUv;
void main(){
  vec3 pos = texture2D(positions, vUv).rgb;
  //move particle here
  if(dot(pos, pos) > 0.01){
    float r = rM*sqrt(dot(pos,pos));
    float theta = thetaM*acos(pos.z * 1.5 / r);
    float phi = phiM*atan(pos.y, pos.x);
    pos.x = pos.x + xM*cos(phi)*sin(theta)*sin(r-time)/r;
    pos.y = pos.y + yM*sin(phi)*sin(theta)*sin(r-time)/r;
    pos.z = pos.z + zM*cos(theta)*sin(r-time)/r;
  }
  gl_FragColor = vec4(pos, 1.0);
}
