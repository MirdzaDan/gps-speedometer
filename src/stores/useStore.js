import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (value) => {
    const serializedData = JSON.stringify(value);
    await AsyncStorage.setItem('@store', serializedData);
}

const useStore = create((set) => ({
    store: [],
    setStore: (store) => {
        set({store});
        storeData(store).catch(e => console.log(e));
    }
}))

export default useStore;