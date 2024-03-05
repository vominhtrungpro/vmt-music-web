import React from 'react';
import YouTube from 'react-youtube';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoIndex: 0,
      videoIds: [],
      player: null
    };
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:8765');

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      const newVideoId = event.data;
      this.setState((prevState) => ({
        videoIds: [...prevState.videoIds, newVideoId],
      }), () => {
        if (this.state.videoIds.length === 1 && this.state.player) {
          this.state.player.playVideo();
        }
      });
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }

  componentWillUnmount() {
    this.socket.close();
  }

  connectWebSocket() {
    const ws = new WebSocket('ws://localhost:8765');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      const newVideoId = event.data;
      this.state.isMounted = true
      if (this.state.isMounted) {
        this.setState((prevState) => ({
          videoIds: [...prevState.videoIds, newVideoId],
        }), () => {
          if (this.state.videoIds.length === 1 && this.state.player) {
            this.state.player.playVideo();
          }
        });
      }
    };

    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setTimeout(() => {
        this.connectWebSocket();
      }, 2000);
    };
    
    ws.onclose = () => {
      console.log('WebSocket closed');
      setTimeout(() => {
        this.connectWebSocket();
      }, 2000);
    };
  }

  _onReady(event) {
    this.setState({
      player: event.target,
    });
    event.target.playVideo();
  }

  _onEnd(event) {
    this.setState((prevState) => ({
      videoIndex: (prevState.videoIndex + 1) % prevState.videoIds.length,
    }), () => {
      if (this.state.player) {
        this.state.player.loadVideoById(this.state.videoIds[this.state.videoIndex]);
      }
    });
  }

  render() {
    const { videoIds, videoIndex } = this.state;
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1,
      },
    };

    return (
      <div>
        <YouTube
          videoId={videoIds[videoIndex]}
          opts={opts}
          onReady={this._onReady.bind(this)}
          onEnd={this._onEnd.bind(this)}
        />
        <div>
          <h2>List of Video IDs:</h2>
          <ul>
            {videoIds.map((videoId, index) => (
              <li key={index}>{videoId}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
