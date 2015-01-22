  mat4.toInverseMat3 = function (a, b) {
    var c = a[0], d = a[1], e = a[2], g = a[4], f = a[5], h = a[6], i = a[8], j = a[9], k = a[10], l = k * f - h * j, o = -k * g + h * i, m = j * g - f * i, n = c * l + d * o + e * m;
    if (!n)return null;
    n = 1 / n;
    b || (b = mat3.create());
    b[0] = l * n;
    b[1] = (-k * d + e * j) * n;
    b[2] = (h * d - e * f) * n;
    b[3] = o * n;
    b[4] = (k * c - e * i) * n;
    b[5] = (-h * c + e * g) * n;
    b[6] = m * n;
    b[7] = (-j * c + d * i) * n;
    b[8] = (f * c - d * g) * n;
    return b
  };

  root.LiThree = {
    Renderer: Renderer,
    WebGLRenderer: WebGLRenderer,
    World: World,
    Object3D: Object3D,
    Camera: Camera,
    Color: Color,
    Vector3: Vector3,
    DirectionalLight: DirectionalLight,
    ObjectFactory: {
      Cube: CubeFactory,
      Sphere: SphereFactory
    }
  };
})
(this);