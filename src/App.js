import React from 'react';
import YouTube from 'react-youtube';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function getVideoIdFromUrl(url) {
  // Kiểm tra xem url có phải là một chuỗi không
  if (typeof url !== 'string') {
    console.error('URL must be a string');
    return null;
  }

  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[7].length === 11) {
    return match[7];
  } else {
    console.error('Invalid YouTube URL');
    return null;
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoIndex: 0,
      videoUrls: [],
      player: null
    };
  }

  handleInputChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  logInputValue() {
    const apiUrl = 'http://127.0.0.1:5000/api/insert_music';
    const data = { url: this.state.inputValue };

    axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:localStorage.getItem('token')
      }
    }
    ).then(response => {
      console.log(response.data.Message)
      toast(response.data.Message)
    })
    .catch(error => {
      toast(error)
    });
  }


  playVideoByUrl(url) {
    const videoId = getVideoIdFromUrl(url);
    if (this.state.player) {
      this.state.player.loadVideoById(videoId);
    }
  }


  componentDidMount() {
    this.socket = new WebSocket('ws://127.0.0.1:8765');

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      const newVideoId = event.data;
      this.setState((prevState) => ({
        videoUrls: [...prevState.videoUrls, newVideoId],
      }), () => {
        if (this.state.videoUrls.length === 1 && this.state.player) {
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
    const ws = new WebSocket('ws://127.0.0.1:8765');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      const newVideoId = event.data;
      if (this.state.isMounted) {
        this.setState((prevState) => ({
          videoUrls: [...prevState.videoUrls, newVideoId],
        }), () => {
          if (this.state.videoUrls.length === 1 && this.state.player) {
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
      videoIndex: (prevState.videoIndex + 1) % prevState.videoUrls.length,
    }), () => {
      if (this.state.player) {
        this.state.player.loadVideoById(getVideoIdFromUrl(this.state.videoUrls[this.state.videoIndex]));
      }
    });
  }

  render() {
    const { videoUrls, videoIndex } = this.state;
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1,
      },
    };

    return (
      <div>
        <input type="text" value={this.state.inputValue} onChange={this.handleInputChange.bind(this)} />
        <button onClick={this.logInputValue.bind(this)}>Log Input Value</button>
        <ToastContainer />
        <GoogleLogin
          onSuccess={credentialResponse => {
            localStorage.setItem('token', credentialResponse.credential);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
        <YouTube
          videoId={getVideoIdFromUrl(videoUrls[videoIndex])}
          opts={opts}
          onReady={this._onReady.bind(this)}
          onEnd={this._onEnd.bind(this)}
        />
        <div>
          <h2>List of Video IDs:</h2>
          <ul>
            {videoUrls.map((videoUrl, index) => (
              <li key={index} onClick={() => this.playVideoByUrl(videoUrl)}>{videoUrl}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
