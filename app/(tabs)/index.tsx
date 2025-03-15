import { useEffect, useState } from 'react';
import { Image, StyleSheet, Platform, View, Text, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AnswerState = {
  optA: number,
  optB: number,
  optC: number,
  optD: number
}

export default function HomeScreen() {

  const [answers, setAnswers] = useState<AnswerState>({
    optA: 0,
    optB: 0,
    optC: 0,
    optD: 0,
  });

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
      storeData(updatedAnswers);  // Store updated data
      return updatedAnswers;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>
          primeira pergunta
        </Text>
        <Text>
          resposta {JSON.stringify(answers)}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handlePress('optA')} style={styles.button}>
          <Text>OpçãoA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('optB')} style={styles.button}>
          <Text>OpçãoB</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('optC')} style={styles.button}>
          <Text>OpçãoC</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('optD')} style={styles.button}>
          <Text>OpçãoD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "pink",
    height: "100%",
  },
  header: {
    backgroundColor: "orange",
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  actions: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    gap: 50,
    paddingTop: 10,
  },
  button: {
    width: '25%', // 4 columns
    aspectRatio: 1, // Makes it a square
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
  }
});