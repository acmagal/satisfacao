import { getData } from '@/services/storageService';
import { AnswerState } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	ScrollView,
	Text,
	View,
	Button,
	Share,
} from 'react-native';
import PieChart from 'react-native-pie-chart';

const ChartComponent = () => {
	const widthAndHeight = 250;

	// Valores padrão
	const defaultSeries = [
		{ value: 10, color: 'blue' },
		{ value: 10, color: 'orange' },
		{ value: 10, color: 'red' },
		{ value: 10, color: 'white' },
	];

	const [answers, setAnswers] = useState(defaultSeries);

	const loadData = async () => {
		const results = await getData<AnswerState[]>();

		if (results) {
			const series = results.map((item: AnswerState, index: number) => {
				return {
					value: item.value,
					color: defaultSeries[index].color,
					label: { text: `${item.title} - ${item.value}` },
				};
			});

			setAnswers(series);
		}
	};
	useEffect(() => {
		AsyncStorage.clear();
		loadData();
	}, []);

	useEffect(() => {
		loadData();
	}, [answers]);

	const convertJsonToCsv = (json: AnswerState[]) => {
		// Map JSON fields to the new CSV headers (title -> nome, value -> quantidade)
		const headers = ['Nome', 'Quantidade']; // Custom headers
		const rows = json.map(
			(item) => [item.title, item.value].join(',') // Map fields accordingly
		);

		// Join headers with rows and separate by new lines
		return [headers.join(','), ...rows].join('\n');
	};
	const handleShare = async () => {
		try {
			const data = await getData<AnswerState[]>();
			const result = await Share.share({
				message: convertJsonToCsv(data!), // Convert the JSON data to string
			});

			if (result.action === Share.sharedAction) {
				console.log('Shared successfully');
			} else if (result.action === Share.dismissedAction) {
				console.log('Share dismissed');
			}
		} catch (error) {
			console.error('Error sharing the data:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Resultados:</Text>
			<PieChart
				style={styles.pie}
				widthAndHeight={widthAndHeight}
				series={answers}
				cover={0.15}
			/>
			<Button color={'#50C878'} title='Atualizar dados' onPress={loadData} />
			<Button color={'#50C878'} title='Salvar dados' onPress={handleShare} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'green',
	},
	title: {
		fontSize: 48,
		margin: 10,
		flex: 0.4,
		fontWeight: 'bold',
		color: 'white',
		marginTop: '20%',
	},
	pie: {
		marginVertical: 10,
		marginBottom: '20%',
		flex: 1,
	},
});

export default ChartComponent;
