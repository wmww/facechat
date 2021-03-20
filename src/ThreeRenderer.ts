import * as THREE from 'three';
import type { AnnotatedPrediction } from '@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh';
import { triangulation, vertexCount } from './triangulation'

export class ThreeRenderer {
  readonly scene = new THREE.Scene();
  readonly renderer: THREE.WebGLRenderer;
  readonly camera: THREE.OrthographicCamera;
  readonly geometry = new THREE.BufferGeometry();
  readonly material = new THREE.MeshBasicMaterial({
    color: 0x80FF00,
    side: THREE.DoubleSide,
    wireframe: true,
  });
  readonly positions = new Float32Array(vertexCount * 3); // 3 coordinates per point
  readonly mesh: THREE.Mesh;
  private dead = false;

  // private points: THREE.Points[] = [];

  constructor(
    readonly canvas: HTMLCanvasElement
  ) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false,
    });
    this.renderer.setClearColor(0x000000, 1.0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);


    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1000);
    this.scene.add(this.camera);

    this.geometry.setIndex(triangulation);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    /*
    const pointGeom = new THREE.BufferGeometry();
    const positionAttrib = new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3);
    positionAttrib.setUsage(THREE.StreamDrawUsage)
    pointGeom.setAttribute('position', positionAttrib);
    const pointMat = new THREE.PointsMaterial({ color: 0xffffff });
    for (let i = 0; i < vertexCount; i++) {
      const point = new THREE.Points(pointGeom, pointMat);
      this.scene.add(point);
      this.points.push(point);
    }
    */

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
      this.positions[i * 3 + 1] = mesh[i][1] * -0.01 + 1;
      this.positions[i * 3 + 2] = mesh[i][2] * 0.01 - 1;
    }

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
