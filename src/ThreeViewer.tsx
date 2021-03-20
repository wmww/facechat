import { AnnotatedPrediction } from '@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh';
import React from 'react';
import { ThreeRenderer } from './ThreeRenderer';

export class ThreeViewer extends React.Component<{}> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private renderer: ThreeRenderer | null = null;

  setFaces(faces: AnnotatedPrediction[]) {
    if (this.renderer !== null) {
      this.renderer.setFaces(faces);
    }
  }

  componentDidMount() {
    this.renderer = new ThreeRenderer(this.canvasRef.current!);
  }

  componentWillUnmount() {
    this.renderer!.dispose();
  }

  render() {
    return (
      <canvas
        style={{
          width: '100%',
          height: '100%',
        }}
        ref={this.canvasRef}
      />
    );
  }
}
