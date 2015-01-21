export var Common = {};

if (!WebGLRenderingContext) {
  Common.support = false;
} else {
  var GL = WebGLRenderingContext;

  Common = {
    support: true,
    drawingMode: {
      TRIANGLES: GL.TRIANGLES,
      LINE_LOOP: GL.LINE_LOOP,
      LINE_STRIP: GL.LINE_STRIP,
      TRIANGLE_FAN: GL.TRIANGLE_FAN
    },
    drawingFunctions: {
      ARRAYS: 1,
      ELEMENTS: 0
    }
  };

}
