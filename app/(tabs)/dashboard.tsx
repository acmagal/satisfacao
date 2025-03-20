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
	TextInput,
	ImageBackground,
} from 'react-native';

const ChartComponent = () => {
	const widthAndHeight = 250;
	const fileUri = FileSystem.documentDirectory + 'dados.txt';

	const defaultSeries = [
		{ value: 10, color: 'blue' },
		{ value: 10, color: 'orange' },
		{ value: 10, color: 'red' },
	];

	const [answers, setAnswers] = useState(defaultSeries);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = () => {
		if (username === 'Admin' && password === 'Admin1234') {
			setIsLoggedIn(true);
		} else {
			Alert.alert('Erro', 'Usuário ou senha incorretos.');
		}
	};

	const loadData = async () => {
		const results = await getData<AnswerState[]>();

		if (results) {
			const series = results.slice(0, 3).map((item: AnswerState, index: number) => {
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
			const content = convertJsonToTxt(data?.slice(0, 3) ?? []);
			await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });
			console.log(`Arquivo salvo em: ${fileUri}`);
			Alert.alert('Sucesso', `Dados atualizados. Clique em "Visualizar dados" para verificar os Resultados da pesquisa.`);
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
			Alert.alert('Resultado da pesquisa de Satisfação:', content);
		} catch (error) {
			console.error('Erro ao ler o arquivo:', error);
			Alert.alert('Erro', 'Não foi possível ler os dados.');
		}
	};

	const backgroundImage = require('../../assets/images/bgDash.png');

	if (!isLoggedIn) {
		return (
			<ImageBackground source={backgroundImage} style={styles.container}>
				<Text style={styles.title}>Login</Text>
				<TextInput
					style={styles.input}
					placeholder="Usuário"
					placeholderTextColor="#ccc"
					onChangeText={setUsername}
					autoCapitalize="none"
				/>
				<TextInput
					style={styles.input}
					placeholder="Senha"
					placeholderTextColor="#ccc"
					secureTextEntry
					onChangeText={setPassword}
				/>
				<Button title="Entrar" onPress={handleLogin} />
			</ImageBackground>
		);
	}

	return (
		<ImageBackground source={backgroundImage} style={styles.container}>
			<Text style={styles.title}>Resultados:</Text>
			<Button color={'#0c1d9f'} title='Atualizar  dados' onPress={saveDataToFile} />
			<Button color={'#0c1d9f'} title='Visualizar dados' onPress={readDataFromFile} />

		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		gap: 10,
	},
	title: {
		fontSize: 32,
		marginBottom: 20,
		fontWeight: 'bold',
		color: 'white',
	},
	input: {
		width: '80%',
		height: 40,
		backgroundColor: 'white',
		marginBottom: 10,
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	pie: {
		marginVertical: 10,
		marginBottom: '20%',
	},
});

export default ChartComponent;
