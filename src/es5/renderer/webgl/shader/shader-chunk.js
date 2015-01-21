"use strict";

var ShaderChunks = {
  vertex: {
    pars: {
      "default": "attribute vec3 aVertexNormal;\n      attribute vec3 aVertexPosition;\n      uniform mat4 uMVMatrix;\n      uniform mat4 uPMatrix; uniform mat3 uNMatrix;",
      directionalLight: function (index) {
        return "varying vec3 vLightWeighting;\n        uniform vec3 uLightingDirection" + index + ";\n        uniform vec3 uDirectionalColor" + index + ";";
      }

    },
    main: {
      "default": "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
      directionalLight: function (index) {
        return "vec3 transformedNormal = uNMatrix * aVertexNormal;\n      float directionalLightWeighting" + index + " = max(dot(transformedNormal, uLightingDirection" + index + "), 0.0);\n      vLightWeighting = uDirectionalColor" + index + " * directionalLightWeighting" + index + ";";
      }

    }
  },
  fragment: {
    pars: {
      "default": "precision mediump float;",
      color: "uniform vec3 uvColor;",
      directionalLight: "varying vec3 vLightWeighting;"
    },
    main: {
      color: "",
      directionalLight: "gl_FragColor = vec4(vLightWeighting + uvColor, 1.0);"
    }
  }
};