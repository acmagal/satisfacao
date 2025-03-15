import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#026632',
				headerShown: false,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: 'absolute',
					},
					default: {},
				}),
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => (
						<MaterialIcons size={28} name='home' color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='dashboard'
				options={{
					title: 'Explore',
					tabBarIcon: ({ color }) => (
						<MaterialIcons size={28} name='login' color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
