root.LiThree = {
  Renderer: Renderer,
  Common: Common,
  WebGLRenderer: WebGLRenderer,
  World: World,
  Object3D: Object3D,
  Interactive: Interactive,
  Camera: {
    Perspective: PerspectiveCamera
  },
  Color: Color,
  Math: {
    Vector3: Vector3,
    Matrix4: Matrix4
  },
  Light: {
    Directional: DirectionalLight,
    Point: PointLight
  },
  ObjectFactory: {
    Circle: CircleFactory,
    Cylinder: CylinderFactory,
    Cube: CubeFactory,
    Sphere: SphereFactory
  }
};
})
(this);