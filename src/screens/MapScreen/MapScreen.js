import {StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {useEffect, useRef, useState} from "react";
import * as Location from "expo-location";
import RNSpeedometer from "react-native-speedometer";
import {LocationAccuracy} from "expo-location";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {nanoid} from "nanoid/non-secure";
import useStore from "../../stores/useStore";

const convertMpsToKmh = (speed) => {
    return speed * 3.6;
};

const saveTrackToStore = (track) => {
    const store = useStore.getState().store;
    const setStore = useStore.getState().setStore;
    setStore([...store, track]);
};

const MainScreen = ({navigation}) => {
    const travelTimestampList = useRef([]);
    const [startTime, setStartTime] = useState();
    const [locationObj, setLocationObj] = useState();

    useEffect(() => {
        const fetchSpeed = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                return;
            }

            await Location.watchPositionAsync({
                accuracy: LocationAccuracy.BestForNavigation, distanceInterval: 1
            }, (location) => {
                const {latitude, longitude, speed} = location.coords;
                const convertedSpeed = convertMpsToKmh(speed);
                if (startTime) {
                    travelTimestampList.current = [{
                        time: (new Date() - startTime), speed: convertedSpeed
                    }, ...travelTimestampList.current];
                }
                setLocationObj({latitude, longitude, speed: convertedSpeed});
            });

        };
        void fetchSpeed();
    }, [startTime]);

    const startTracking = () => {
        setStartTime(new Date());
    }

    const stopTracking = () => {
        const track = {
            id: nanoid(), elapsedTime: (new Date() - startTime), travelTimestampList: travelTimestampList.current
        }
        saveTrackToStore(track);
        setStartTime(null);
        navigation.navigate('Istoric');
    };

    return (<>
        {locationObj && (<View style={{flex: 1}}>
            <MapView
                zoomEnabled={true}
                style={styles.map}
                region={{
                    latitude: locationObj.latitude,
                    longitude: locationObj.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: locationObj.latitude, longitude: locationObj.longitude,
                    }}
                />
            </MapView>
            <TouchableOpacity
                style={styles.button}
                onPress={startTime ? stopTracking : startTracking}
            >
                <Text style={styles.buttonText}>
                    {startTime ? "STOP" : "START"}
                </Text>
            </TouchableOpacity>
            {startTime && (<View style={styles.container}>
                <RNSpeedometer
                    provider={PROVIDER_GOOGLE}
                    value={locationObj.speed}
                    size={100}
                    maxValue={200}
                    labelNoteStyle={{color: "transparent"}}
                />
            </View>)}
        </View>)}
    </>);
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    }, container: {
        position: "absolute", bottom: 50, right: 15,
    }, button: {
        backgroundColor: "red", padding: 10, color: "white", position: "absolute", top: 30, right: 15,
    }, buttonText: {
        color: "white",
    },
});

export default MainScreen;
