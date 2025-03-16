import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

import Button from '../../components/Button';

type AnswerState = {
	optA: number;
	optB: number;
	optC: number;
	optD: number;
};

export default function HomeScreen() {
	const [answers, setAnswers] = useState<AnswerState>({
		optA: 0,
		optB: 0,
		optC: 0,
		optD: 0,
	});

	const images = [
		Image.resolveAssetSource(require('../../assets/images/original.png')).uri,
		Image.resolveAssetSource(require('../../assets/images/integral.png')).uri,
		Image.resolveAssetSource(
			require('../../assets/images/premium-original.png')
		).uri,
		Image.resolveAssetSource(
			require('../../assets/images/premium-integral.png')
		).uri,
		require('../../assets/images/bg.png'),
	];

	const storeData = async (value: AnswerState) => {
		try {
			const jsonValue = JSON.stringify(value);
			await AsyncStorage.setItem('my-key', jsonValue);
		} catch (e) {
			// saving error
			console.error('Error saving data: ', e);
		}
	};

	const getData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem('my-key');
			return jsonValue != null ? JSON.parse(jsonValue) : null;
		} catch (e) {
			// error reading value
			console.error('Error reading value: ', e);
		}
	};

	useEffect(() => {
		const loadData = async () => {
			const results = await getData();
			if (results) {
				setAnswers(results);
			}
			console.log(results); // Log retrieved data
		};
		loadData();
	}, []);

	const handlePress = (option: keyof AnswerState) => {
		setAnswers((previous) => {
			const updatedAnswers = { ...previous, [option]: previous[option] + 1 };
			storeData(updatedAnswers); // Store updated data
			return updatedAnswers;
		});
	};

	return (
		<ImageBackground
			source={require('../../assets/images/bg.png')}
			resizeMode='cover'
			style={styles.container}>
			<View style={styles.header} />
			<View style={styles.actions}>
				<Button
					style={styles.button}
					image={images[0]}
					onPress={() => handlePress('optA')}
				/>
				<Button
					style={styles.button}
					image={images[1]}
					onPress={() => handlePress('optB')}
				/>
				<Button
					style={styles.button}
					image={images[2]}
					onPress={() => handlePress('optC')}
				/>
				<Button
					style={styles.button}
					image={images[3]}
					onPress={() => handlePress('optD')}
				/>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'pink',
		height: '100%',
	},
	header: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	actions: {
		flex: 2,
		flexDirection: 'row',
		flexWrap: 'wrap', // Allows items to wrap into multiple rows
		justifyContent: 'space-between', // Ensures equal spacing
		alignItems: 'center',
		width: '100%',
		padding: 50,
		gap: 20, // Space between buttons
	},
	button: {
		width: '40%', // Adjust for 2 columns per row
		aspectRatio: 1, // Makes it square
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
	},
});
