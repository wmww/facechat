import * as THREE from 'three';

export class ThreeRenderer {
  readonly scene = new THREE.Scene();
  readonly renderer: THREE.WebGLRenderer;
  readonly camera: THREE.OrthographicCamera;
  private dead = false;

  constructor(
    readonly canvas: HTMLCanvasElement
  ) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false,
    });
    this.renderer.setClearColor('#ff0080', 1.0);

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
    this.scene.add(this.camera);

    this.draw();
  }

  private draw() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => {
      if (!this.dead) {
        this.draw()
      }
    });
  }

  dispose() {
    this.dead = true;
  }
}
