export var Common = {};

if (!WebGLRenderingContext) {
  Common.support = false;
} else {
  var GL = WebGLRenderingContext;

  Common = {
    support: true,
    drawingMode: {
      POINTS: GL.POINTS,
      LINES: GL.LINES,
      LINE_LOOP: GL.LINE_LOOP,
      LINE_STRIP: GL.LINE_STRIP,
      TRIANGLES: GL.TRIANGLES,
      TRIANGLE_FAN: GL.TRIANGLE_FAN,
      TRIANGLE_STRIP: GL.TRIANGLE_STRIP
    },
    drawingFunctions: {
      ARRAYS: 1,
      ELEMENTS: 0
    }
  };

}
