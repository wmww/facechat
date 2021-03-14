import React from 'react';
import Webcam from "react-webcam";
import './App.css';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

require('@tensorflow/tfjs-backend-webgl');

/// See https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
enum MediaReadyState {
  Nothing = 0,
  Metadata = 1,
  CurrentData = 2,
  FutureData = 3,
  EnoughData = 4,
}

class Viewer extends React.Component<{}> {
  readonly webcamRef = React.createRef<Webcam>();
  readonly canvasRef = React.createRef<HTMLCanvasElement>();
  private detector: faceLandmarksDetection.FaceLandmarksDetector | null = null;

  constructor(props: {}) {
    super(props);
    faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh).then(detector => {
      this.detector = detector;
    });
    setInterval(() => {
      this.detectFace();
    }, 100);
  }

  async detectFace() {
    const webcam = this.webcamRef.current;
    const canvas = this.canvasRef.current;
    if (
      this.detector !== null &&
      canvas !== null &&
      webcam !== null &&
      webcam.video !== null &&
      webcam.video.readyState === MediaReadyState.EnoughData
    ) {
      const video = webcam.video;
      video.width = video.videoWidth;
      video.height = video.videoHeight;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const faces = await this.detector.estimateFaces({input: video});
      this.drawPoints(faces);
    }
  }

  drawPoints(faces: any[]) {
    if (this.canvasRef.current === null) {
      return;
    }
    const ctx = this.canvasRef.current.getContext("2d");
    if (ctx === null) {
      console.error('Failed to get 2D drawing context')
      return;
    }
    for (const face of faces) {
      for (const point of face.scaledMesh) {
        const x = point[0];
        const y = point[1];
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, 3 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
      }
    }
  }

  render() {
    return <div>
        <Webcam
          ref={this.webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 720,
            height: 500,
          }}
        />
        <canvas
          ref={this.canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 720,
            height: 500,
          }}
        />
    </div>
  }
}

function App() {
  return (
    <div className="App">
      <Viewer />
    </div>
  );
}

export default App;
