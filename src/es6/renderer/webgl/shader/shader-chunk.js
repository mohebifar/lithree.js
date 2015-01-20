export var ShaderChunks =
{
  vertex: {
    position: `gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);`
  },
  fragment: {
    color: ``
  }
};