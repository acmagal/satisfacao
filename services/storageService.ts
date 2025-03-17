import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async <T>(value: T) => {
	try {
		const jsonValue = JSON.stringify(value);
		console.log(jsonValue);
		await AsyncStorage.setItem('my-key', jsonValue);
	} catch (e) {
		// saving error
		console.error('Error saving data: ', e);
	}
};

export const getData = async <T>() => {
	try {
		const jsonValue = await AsyncStorage.getItem('my-key');
		return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
	} catch (e) {
		// error reading value
		console.error('Error reading value: ', e);
	}
};
