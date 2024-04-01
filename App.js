import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// console.log(SCREEN_WIDTH)
const API_KEY = "b255e4979ae3a3b2519aaf832b6b30ab";

const icons = {
  "Clear": "day-sunny",
  "Clouds": "cloudy",
  "Rain": "rain",
  "Atmosphere": "cloudy-gusts",
  "Snow": "snow",
  "Drizzle": "day-rain",
  "Thunderstorm": "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState("Loading...");
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    
    const filteredList = json.list.filter(({ dt_txt }) => dt_txt.endsWith("00:00:00"));

    setDays(filteredList);
  };

  // api.openweathermap.org/data/2.5/forecast?lat=35.80936033899841&lon=127.12350757868278&appid=b255e4979ae3a3b2519aaf832b6b30ab
  useEffect(() => {
    ask();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityname}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        // indicatorStyle='white'
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days === "Loading..." ? (
          <View style={{marginLeft: SCREEN_WIDTH/2-30}}>
            <ActivityIndicator color="white" size={60}/>
          </View>) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={{
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                justifyContent: "space-between",
                marginLeft: 30,
                flex:2.5
              }}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.description2}>{day.weather[0].description}
              </Text>
              </View>
              <Fontisto style={{flex:1, marginTop:50}} name={icons[day.weather[0].main]} size={70} color="white" />
            </View>
          ))
        )}
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'teal',
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityname: {
    color: "white",
    fontSize: 68,
    fontWeight: "200"
  },
  weather: {
    color: "white",
    backgroundColor: "teal",
  },
  day: {
    flexDirection: "row",
    color: "white",
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
  },
  temp: {
    color: "white",
    marginTop: 50,
    fontSize: 120,
    fontWeight: "200"
  },
  description: {
    color: "white",
    marginTop: -20,
    fontSize: 45,
    fontWeight: "300"
  },
  description2: {
    color: "white",
    fontSize: 18,
    fontWeight: "300"
  }
});



