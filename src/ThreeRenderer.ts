import * as THREE from 'three';
import { AnnotatedPrediction } from '@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh';
import { TRIANGULATION, vertexCount } from './triangulation'

export class ThreeRenderer {
  readonly scene = new THREE.Scene();
  readonly renderer: THREE.WebGLRenderer;
  readonly camera: THREE.OrthographicCamera;
  readonly geometry = new THREE.BufferGeometry();
  readonly material = new THREE.LineBasicMaterial({color: 0x80FF00});
  readonly positions = new Float32Array(vertexCount * 3); // 3 coordinates per point
  readonly line: THREE.Line;
  private dead = false;

  constructor(
    readonly canvas: HTMLCanvasElement
  ) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false,
    });
    this.renderer.setClearColor(0x000000, 1.0);

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1000);
    this.scene.add(this.camera);

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setDrawRange(0, vertexCount);
    this.line = new THREE.Line(this.geometry, this.material);
    this.scene.add(this.line);
    // positions = line.geometry.attributes.position.array;

    this.draw();
  }

  setFaces(faces: AnnotatedPrediction[]) {
    if (faces.length === 0) {
      return;
    }
    const mesh = faces[0].mesh as [number, number, number][];
    if (mesh.length !== vertexCount) {
      console.error('Incorrect vertex count: expected ' + vertexCount + ', got ' + mesh.length);
    }
    for (let i = 0; i < mesh.length && i < vertexCount; i++) {
      this.positions[i * 3    ] = mesh[i][0] * 0.01 - 1;
      this.positions[i * 3 + 1] = mesh[i][1] * 0.01 - 1;
      this.positions[i * 3 + 2] = mesh[i][2] - 100;
    }
    this.positions[0] = 0;
    this.positions[1] = 0;
    this.positions[2] = 0;
    this.geometry.attributes.position.needsUpdate = true
    // shouldn't need these?
    // this.geometry.computeBoundingBox();
    // this.geometry.computeBoundingSphere();
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
