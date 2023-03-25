import {FlatList, StyleSheet, Text, View} from "react-native";
import useStore from "../../stores/useStore";

function msToHMS(duration) {
    let seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60), hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

const Item = ({item}) => {
    return (<View style={styles.item}>
        <View>
            <Text>{`ID: ${item.id}`}</Text>
            <Text>{`Durata: ${item.elapsedTime / 1000} secunde`}</Text>
            <Text>Lista:</Text>
            {item.travelTimestampList.map(time => {
                console.log(time)
                return (<Text>{`${msToHMS(time.time)}: ${time.speed.toFixed(2)} km/h`}</Text>)
            })}
        </View>
    </View>)
}
const HistoryScreen = () => {
    const store = useStore(state => state.store);

    return (<View style={styles.container}>
        <FlatList data={store} renderItem={({item}) => <Item item={item}/>} style={{padding: 30}}/>
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }, item: {
        backgroundColor: 'white', borderRadius: 5, marginTop: 20, paddingHorizontal: 20, paddingVertical: 30
    }
});

export default HistoryScreen;
