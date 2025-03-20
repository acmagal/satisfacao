import { useEffect, useState } from 'react';
import {
	Alert,
	Image,
	ImageBackground,
	StyleSheet,
	View,
	TouchableOpacity,
} from 'react-native';

import { getData, storeData } from '@/services/storageService';
import { AnswerState } from '@/types';

export default function HomeScreen() {
	const [answers, setAnswers] = useState<AnswerState[]>([
		{
			title: 'Modelo 01',
			value: 0,
		},
		{
			title: 'Modelo 02',
			value: 0,
		},
		{
			title: 'Modelo 03',
			value: 0,
		},
	]);

	const images = [
		{
			title: 'Modelo 01',
			imageCenter: require('../../assets/images/CAMISA01.png'),
			imageLeft: require('../../assets/images/Modelo01.png'),
		},
		{
			title: 'Modelo 02',
			imageCenter: require('../../assets/images/CAMISA02.png'),
			imageLeft: require('../../assets/images/Modelo02.png'),
		},
		{
			title: 'Modelo 03',
			imageCenter: require('../../assets/images/CAMISA03.png'),
			imageLeft: require('../../assets/images/Modelo03.png'),
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
				{images.map((item, index) => (
					<TouchableOpacity
						key={index}
						style={styles.button}
						onPress={() => handlePress(answers[index].title)}>
						<Image source={item.imageLeft} style={styles.imageLeft} />
						<Image source={item.imageCenter} style={styles.imageCenter} />
					</TouchableOpacity>
				))}
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#0c1d9f',
		height: '100%',
		width: '100%',

	},
	header: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',

	},
	actions: {

		justifyContent: 'center',
		alignItems: 'center',
		height: '90%',
		paddingBottom: 90,

	},
	button: {
		width: '100%',
		height: '25%',
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
		borderWidth: 15,
		backgroundColor: 'white',
		borderColor: 'white',
		gap: '10%',

	},
	imageLeft: {
		width: '25%',
		height: '11%',
		resizeMode: 'contain',

	},
	imageCenter: {
		width: '30%',
		height: '100%',
		resizeMode: 'contain',

	},
});



