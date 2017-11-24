uniform sampler2D positions;
uniform float pointSize;
void main(){
  vec3 pos = texture2D(positions, position.xy).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = pointSize;
}
