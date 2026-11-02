import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExpenseScreen() {
	const { id } = useLocalSearchParams<{ id: string | string[] }>();
	const router = useRouter();
	const expenseId = Array.isArray(id) ? id[0] : id;

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen options={{ title: 'Expense details' }} />
			<Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
				<Text style={styles.backText}>‹  Back</Text>
			</Pressable>

			<View style={styles.content}>
				<Text style={styles.eyebrow}>EXPENSE</Text>
				<Text style={styles.title}>Expense details</Text>
				<View style={styles.card}>
					<Text style={styles.label}>Expense ID</Text>
					<Text selectable style={styles.id}>{expenseId || 'Not provided'}</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	backButton: {
		alignSelf: 'flex-start',
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	backText: {
		color: '#475569',
		fontSize: 16,
		fontWeight: '600',
	},
	content: {
		padding: 24,
	},
	eyebrow: {
		color: '#64748b',
		fontSize: 12,
		fontWeight: '700',
		letterSpacing: 1.2,
	},
	title: {
		color: '#0f172a',
		fontSize: 28,
		fontWeight: '700',
		marginTop: 8,
		marginBottom: 24,
	},
	card: {
		backgroundColor: '#ffffff',
		borderColor: '#e2e8f0',
		borderRadius: 16,
		borderWidth: 1,
		padding: 20,
	},
	label: {
		color: '#64748b',
		fontSize: 14,
	},
	id: {
		color: '#0f172a',
		fontSize: 18,
		fontWeight: '600',
		marginTop: 8,
	},
});
