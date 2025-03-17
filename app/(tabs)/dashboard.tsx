import { getData } from '@/services/storageService';
import { AnswerState } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Button,
	Alert,
} from 'react-native';
import PieChart from 'react-native-pie-chart';

const ChartComponent = () => {
	const widthAndHeight = 250;
	const fileUri = FileSystem.documentDirectory + 'dados.txt';

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
		loadData();
	}, []);

	const convertJsonToTxt = (json: AnswerState[]) => {
		if (!json || json.length === 0) return 'Nenhum dado disponível';
		return json.map((item) => `${item.title}: ${item.value}`).join('\n');
	};

	const saveDataToFile = async () => {
		try {
			const data = await getData<AnswerState[]>();
			const content = convertJsonToTxt(data);
			await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });
			console.log(`Arquivo salvo em: ${fileUri}`);
			Alert.alert('Sucesso', `Dados salvos em: ${fileUri}`);
		} catch (error) {
			console.error('Erro ao salvar o arquivo:', error);
			Alert.alert('Erro', 'Não foi possível salvar os dados.');
		}
	};

	const readDataFromFile = async () => {
		try {
			const fileInfo = await FileSystem.getInfoAsync(fileUri);
			if (!fileInfo.exists) {
				Alert.alert('Erro', 'Arquivo não encontrado!');
				return;
			}

			const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
			console.log('Conteúdo do arquivo:', content);
			Alert.alert('Conteúdo do Arquivo', content);
		} catch (error) {
			console.error('Erro ao ler o arquivo:', error);
			Alert.alert('Erro', 'Não foi possível ler os dados.');
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
			<Button color={'#50C878'} title='Salvar como TXT' onPress={saveDataToFile} />
			<Button color={'#50C878'} title='Ler arquivo TXT' onPress={readDataFromFile} />
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
		fontWeight: 'bold',
		color: 'white',
		marginTop: '20%',
	},
	pie: {
		marginVertical: 10,
		marginBottom: '20%',
	},
});

export default ChartComponent;