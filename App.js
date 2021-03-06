import { StatusBar } from 'expo-status-bar';
import {Alert} from 'react-native';
import React from 'react';
import Loading from './Loading';
import * as Location from 'expo-location';
import axios from 'axios';
import Weather from './Weather';

// export default function App() {
  //   return (
    //     <Loading />
    //   );
    // }

const API_KEY = "62f79f0a0671cb884a6ace69dae4e69c";


export default class extends React.Component {
  state = {
    isLoading: true,
  }

  getWeather = async (latitude, longitude) => {
    const { data: {main: {temp}, weather} } = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    // console.log(data.main.temp);
    this.setState({isLoading: false, temp, condition: weather[0].main})
  };

  getLocation = async () => {
    
    try {
      await Location.requestPermissionsAsync();
      const {coords: { latitude, longitude }} = await Location.getCurrentPositionAsync();
      //send to API and get the weather.
      this.getWeather(latitude, longitude);
      this.setState({ isLoading: false });

    }catch (error) {
      Alert.alert('Cant find you', 'So sad');
    }
    
  }

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition} />;
  }
}
