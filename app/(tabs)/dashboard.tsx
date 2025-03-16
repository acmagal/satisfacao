import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import PieChart from 'react-native-pie-chart';

const ChartComponent = () => {
	const widthAndHeight = 250;

	// Valores padrão
	const defaultSeries = [
		{ value: 400, color: '#03fb07' },
		{ value: 321, color: '#ffb300' },
		{ value: 300, color: '#ff9100' },
		{ value: 400, color: '#ff2600' },
	];

	const getData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem('my-key');
			return jsonValue ? JSON.parse(jsonValue) : null;
		} catch (e) {
			console.error('Erro ao ler os dados:', e);
			return null;
		}
	};

	const [answers, setAnswers] = useState(defaultSeries);

	useEffect(() => {
		const loadData = async () => {
			const results = await getData();

			if (results && Array.isArray(results)) {
				console.log(results);
				const validatedResults = results.every(
					(item) => item.value && item.color
				)
					? results
					: defaultSeries;

				setAnswers(validatedResults);
			}

			console.log('Dados carregados:', results);
		};

		loadData();
	}, []);

	return (
		<ScrollView style={{ flex: 1 }}>
			<View style={styles.container}>
				<Text style={styles.title}>Resultados:</Text>
				{/* <PieChart
					widthAndHeight={widthAndHeight}
					series={answers}
					cover={0.45}
				/> */}
			</View>
			<View>
				<Text>aaaaaa</Text>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'green',
	},
	title: {
		fontSize: 24,
		margin: 10,
	},
});

export default ChartComponent;
