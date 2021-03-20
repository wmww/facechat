import React from 'react';
import { triangulation } from './triangulation';

export class CanvasViewer extends React.Component<{}> {
  readonly canvasRef = React.createRef<HTMLCanvasElement>();
  private faces: any[] = [];
  private width = 0;
  private height = 0;

  draw() {
    if (this.canvasRef.current === null) {
      return;
    }
    const ctx = this.canvasRef.current.getContext("2d");
    if (ctx === null) {
      console.error('Failed to get 2D drawing context')
      return;
    }

    for (const face of this.faces) {
      for (let i = 0; i < triangulation.length; i += 3) {
        ctx.fillStyle = 'black';
        const ax = face.scaledMesh[triangulation[i    ]][0];
        const ay = face.scaledMesh[triangulation[i    ]][1];
        const bx = face.scaledMesh[triangulation[i + 1]][0];
        const by = face.scaledMesh[triangulation[i + 1]][1];
        const cx = face.scaledMesh[triangulation[i + 2]][0];
        const cy = face.scaledMesh[triangulation[i + 2]][1];
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.lineTo(cx, cy);
        ctx.fill();
      }
    }

    for (const face of this.faces) {
      for (let i = 0; i < triangulation.length; i += 3) {
        for (let j = 0; j < 3; j += 1) {
          ctx.strokeStyle = 'green';
          const a = i + j;
          const b = i + (j + 1) % 3;
          const ax = face.scaledMesh[triangulation[a]][0];
          const ay = face.scaledMesh[triangulation[a]][1];
          const bx = face.scaledMesh[triangulation[b]][0];
          const by = face.scaledMesh[triangulation[b]][1];
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }
      for (const point of face.scaledMesh) {
        const x = point[0];
        const y = point[1];
        ctx.fillStyle = 'blue';
        ctx.fillRect(x, y, 2, 2);
      }
    }
    window.requestAnimationFrame(() => {
      this.draw();
    });
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.applySize();
  }

  private applySize() {
    if (this.canvasRef.current !== null) {
      this.canvasRef.current.width = this.width;
      this.canvasRef.current.height = this.height;
    }
  }

  setFaces(faces: any[]) {
    this.faces = faces;
  }

  componentDidMount() {
    this.applySize();
    this.draw();
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        style={{
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }}
      />
    );
  }
}
