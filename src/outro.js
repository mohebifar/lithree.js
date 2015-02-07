root.LiThree = {
  Renderer: Renderer,
  Common: Common,
  WebGLRenderer: WebGLRenderer,
  World: World,
  Object3D: Object3D,
  Interactive: Interactive,
  RayCaster: RayCaster,
    Color: Color,
  Camera: {
    Perspective: PerspectiveCamera
  },
  Math: {
    Quaternion: Quaternion,
    Vector3: Vector3,
    Ray: Ray,
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