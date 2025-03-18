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
			title: 'Empada de Frango',
			value: 0,
		},
		{
			title: 'Pão de Alho',
			value: 0,
		},
		{
			title: 'Torresmo',
			value: 0,
		},
	]);

	const images = [
		{
			title: 'Empada de Frango',
			image: Image.resolveAssetSource(
				require('../../assets/images/BT01.png')
			).uri,
		},
		{
			title: 'Pão de Alho',
			image: Image.resolveAssetSource(
				require('../../assets/images/BT02.png')
			).uri,
		},
		{
			title: 'Torresmo',
			image: Image.resolveAssetSource(
				require('../../assets/images/BT03.png')
			).uri,
		},
	];

	useEffect(() => {
		const loadData = async () => {
			const results = await getData<AnswerState[]>();
			if (results) {
				setAnswers(results);
			}
			console.log(results);
		};
		loadData();
	}, []);

	const handlePress = (item: string) => {
		setAnswers((previous) => {
			const values = [...previous];
			values.find((element) => element.title === item)!.value += 1;
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
				{images.slice(0, 3).map((item, index) => (
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
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	actions: {
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		paddingTop: 50,
	},
	button: {
		width: '90%',
		height: 80,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 12,
		marginBottom: 30,
		backgroundColor: 'rgba(9, 140, 48, 0.6)',
		borderWidth: 4,
		borderColor: 'rgba(136, 186, 101, 0.6)',
	},
});



