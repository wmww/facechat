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

type ViewerProps = {
  detector: faceLandmarksDetection.FaceLandmarksDetector,
}

class Viewer extends React.Component<ViewerProps> {
  readonly webcamRef = React.createRef<Webcam>();
  readonly canvasRef = React.createRef<HTMLCanvasElement>();
  private componentIsMounted = false;
  private faces: any[] = [];

  async detectFace() {
    const webcam = this.webcamRef.current;
    const canvas = this.canvasRef.current;
    if (
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
      this.faces = await this.props.detector.estimateFaces({input: video});
    }
    if (this.componentIsMounted) {
      setTimeout(() => {
        this.detectFace();
      }, 1);
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
      console.log('Drawing ' + face.scaledMesh.length + ' points');
      for (const point of face.scaledMesh) {
        const x = point[0];
        const y = point[1];
        ctx.fillStyle = 'blue';
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  draw() {
    if (this.componentIsMounted) {
      this.drawPoints(this.faces);
      window.requestAnimationFrame(() => {
        this.draw();
      });
    }
  }

  componentDidMount() {
    this.componentIsMounted = true;
    this.detectFace();
    this.draw();
  }

  componentWillUnmount() {
    this.componentIsMounted = false;
  }

  render() {
    return (
      <div>
        <Webcam
          ref={this.webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 1,
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
    );
  }
}

type DetectorState = {
  detector?: faceLandmarksDetection.FaceLandmarksDetector,
}

class Detector extends React.Component<{}, DetectorState> {
  constructor(props: {}) {
    super(props);
    this.state = {};
    faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh).then(detector => {
      this.setState({detector: detector});
    });
  }

  render() {
    if (this.state.detector === undefined) {
      return null;
    } else {
      return <Viewer detector={this.state.detector} />;
    }
  }
}

function App() {
  return (
    <div className="App">
      <Detector />
    </div>
  );
}

export default App;
