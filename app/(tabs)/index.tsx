import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
	Alert,
	Image,
	ImageBackground,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import Button from '../../components/Button';
import { getData, storeData } from '@/services/storageService';
import { AnswerState } from '@/types';

export default function HomeScreen() {
	const [answers, setAnswers] = useState<AnswerState[]>([
		{
			title: 'Original',
			value: 0,
		},
		{
			title: 'Integral',
			value: 0,
		},
		{
			title: 'Premium Original',
			value: 0,
		},
		{
			title: 'Premium Integral',
			value: 0,
		},
	]);

	const images = [
		{
			title: 'Original',
			image: Image.resolveAssetSource(
				require('../../assets/images/original.png')
			).uri,
		},
		{
			title: 'Integral',
			image: Image.resolveAssetSource(
				require('../../assets/images/integral.png')
			).uri,
		},
		{
			title: 'Premium Original',
			image: Image.resolveAssetSource(
				require('../../assets/images/premium-original.png')
			).uri,
		},
		{
			title: 'Premium Integral',
			image: Image.resolveAssetSource(
				require('../../assets/images/premium-integral.png')
			).uri,
		},
	];

	useEffect(() => {
		const loadData = async () => {
			const results = await getData<AnswerState[]>();
			if (results) {
				setAnswers(results);
			}
			console.log(results); // Log retrieved data
		};
		loadData();
	}, []);

	const handlePress = (item: string) => {
		setAnswers((previous) => {
			const values = [...previous]; // Store updated data
			values.find((element) => element.title === item)!.value += 1; // Increment value
			return values;
		});
		storeData(answers);
		Alert.alert('Obrigado!', 'Voto computado com sucesso!');
	};

	return (
		<ImageBackground
			source={require('../../assets/images/bg.png')}
			resizeMode='cover'
			style={styles.container}>
			<View style={styles.header} />
			<View style={styles.actions}>
				{images.map((item, index) => (
					<Button
						key={index}
						image={item.image}
						onPress={() => handlePress(answers[index].title)}
						style={styles.button}
					/>
				))}
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
