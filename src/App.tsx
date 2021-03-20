import React from 'react';
import Webcam from "react-webcam";
import './App.css';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { CanvasViewer } from './CanvasViewer';

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
  readonly viewerRef = React.createRef<CanvasViewer>();

  async detectFace() {
    const webcam = this.webcamRef.current;
    const viewer = this.viewerRef.current;
    if (
      viewer !== null &&
      webcam !== null &&
      webcam.video !== null &&
      webcam.video.readyState === MediaReadyState.EnoughData
    ) {
      const video = webcam.video;
      video.width = video.videoWidth;
      video.height = video.videoHeight;
      viewer.setSize(video.videoWidth, video.videoHeight);
      const faces = await this.props.detector.estimateFaces({input: video});
      viewer.setFaces(faces);
    }
    if (this.webcamRef !== null) {
      setTimeout(() => {
        this.detectFace();
      }, 1);
    }
  }

  componentDidMount() {
    this.detectFace();
  }

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: 'auto',
          left: 0,
          right: 0,
          textAlign: "center",
          width: 720,
          height: 500,
        }}
      >
        <Webcam
          ref={this.webcamRef}
          style={{
            position: 'absolute',
            left: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
          }}
        >
          <CanvasViewer
            ref={this.viewerRef}
          />
        </div>
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
