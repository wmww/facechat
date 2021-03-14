import React from 'react';
import Webcam from "react-webcam";
import './App.css';

class Viewer extends React.Component {
  readonly webcamRef = React.createRef<Webcam>();
  readonly canvasRef = React.createRef<HTMLCanvasElement>();

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
