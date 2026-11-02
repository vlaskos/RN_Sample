import { StyleSheet, Text, View } from 'react-native';

type ExpenseRowProps = {
	title: string;
	amount: string | number;
};

export default function ExpenseRow({ title, amount }: ExpenseRowProps) {
	return (
		<View style={styles.row}>
			<Text style={styles.title} numberOfLines={1}>
				{title}
			</Text>
			<Text style={styles.amount}>{amount}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
	},
	title: {
		flex: 1,
		marginRight: 16,
		color: '#222',
		fontSize: 16,
	},
	amount: {
		color: '#222',
		fontSize: 16,
		fontWeight: '600',
	},
});
