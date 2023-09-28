import { Component } from 'react';
import './App.css';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Rank from './component/Rank/Rank';
import ParticleSettings from './component/ParticleSettings';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import SignIn from './component/SignIn/SignIn';
import Register from './component/Resister/Resister';

const initialState = {
  input: '',
  imageUrl: '',
  boxs: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {
  
  constructor() {
    super();
    this.state = initialState;
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  // }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  caluculateFaceLocation = (data) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(data);
    const clarifaiFaces = data.outputs[0].data.regions.map((region) => {
      return{
        leftCol: region.region_info.bounding_box.left_col * width,
        topRow: region.region_info.bounding_box.top_row * height,
        rightCol: width - (region.region_info.bounding_box.right_col * width),
        bottomRow: height - (region.region_info.bounding_box.bottom_row * height)
       }
    });
    // region.region_info.bounding_box;

     return clarifaiFaces;
  };

  displayFaceBox = (boxs) => {
    console.log(boxs);
    this.setState({boxs: boxs});
    console.log('box',this.state.boxs);
    return this.state.boxs;
  };

  onInputChange = (event) => { //入力の変化がトリガー
    this.setState({input: event.target.value});
  };

  onPictureSubmit = () => { //ボタンがトリガー
    this.setState({imageUrl: this.state.input});
    // stateのimgUrlにinputが入るのを待ってから
    //console.log(this.state.imageUrl);
    fetch('http://localhost:3000/imageUrl', 
    {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
            imageUrl: this.state.input
            })
    })
    .then(response => response.json())
    .then((response) => { 
      console.log(response);
      const boxnum = response.outputs[0].data.regions.length;
      if (response) {
        fetch('http://localhost:3000/image', 
        {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
                id: this.state.user.id,
                boxnum: boxnum
                })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
        .catch(console.log);

      this.displayFaceBox(this.caluculateFaceLocation(response))
    }})
    .catch(error => console.log('error', error));
  };

  onRouteChange = (route) => {
    if(route === 'signin' || route === 'register') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    } else {
      this.setState(initialState);
    }
    this.setState({route: route});
  };

  render() {
    const { isSignedIn, imageUrl, route, boxs, user } = this.state;

    return (
      <div className="App">
        <ParticleSettings />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {route === 'home'
          ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onPictureSubmit} />
            <FaceRecognition boxs={boxs} imageUrl={imageUrl}/>
          </div>
          : (route === 'signin' 
             ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
             : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
             )
        }
      </div>
    );
  }
}

export default App;
