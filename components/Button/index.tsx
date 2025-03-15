import { Image, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = {
	image: string;
	onPress: () => void;
} & TouchableOpacityProps;

const Button = ({ image, onPress, ...rest }: ButtonProps) => {
	return (
		<TouchableOpacity onPress={() => onPress()} {...rest}>
			<Image
				style={{ height: '100%', width: '100%' }}
				source={{ uri: image }}
			/>
		</TouchableOpacity>
	);
};

export default Button;
