import * as three from 'three';
import { SimulaterBuilder, type Individual } from './simulater';
import { Vec2 } from './vec';
import { Boids } from './boids';

const BORDER = 10;
class Cube implements Individual {
  public id: string;
  public velocity: Vec2;
  public position: Vec2;

  private _mesh: three.Mesh;

  public get mesh(): three.Mesh {
    return this._mesh;
  }

  public constructor(id: string | number) {
    this.id = `${id}`;
    this.velocity = Vec2.init([1, 1, 1]);
    this.position = Vec2.init([
      Math.random() * BORDER * 2 - BORDER,
      Math.random() * BORDER * 2 - BORDER,
      Math.random() * BORDER * 2 - BORDER,
    ]);
    const geometry = new three.BoxGeometry(0.1, 0.1, 0.1);
    // not be affected by light
    // const material = new three.MeshBasicMaterial({ color: 0x00ff00 });

    // be affected by light
    const material = new three.MeshPhongMaterial({ color: 0x00ff00 });
    this._mesh = new three.Mesh(geometry, material);
  }

  public animate = () => {
    const pos = this.position;
    if (
      pos.x > BORDER || pos.x < -BORDER
      || pos.y > BORDER || pos.y < -BORDER
    ) {
      this.velocity = Vec2.inverse(this.velocity);
      this.position = Vec2.add(this.position, Vec2.mul(this.velocity, 2));
    }
    this._mesh.position.x = this.position.x;
    this._mesh.position.y = this.position.y;
  }
}

const boids = new Boids(10, 3);
const simulater = new SimulaterBuilder()
  .add(boids.cohesion)
  .add(boids.separation)
  .add(boids.align)
  .add(boids.moveForward)
  .build(0.1);

const renderer = new three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new three.Scene();

// camera
const camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;
camera.lookAt(new three.Vector3(0, 0, 0))

// light
const color = 0xFFFFFF;
const intensity = 3;
const light = new three.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

let result = new Array<Cube>();
for (var i = 0; i < 3000; i++) {
  const cube = new Cube(i);
  scene.add(cube.mesh);
  result.push(cube);
}

const animation = () => {
  result = simulater(result) as any;
  result.map(r => r.animate());
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animation)
document.getElementById("app")?.appendChild(renderer.domElement)

