
import ExpenseRow from '@/components/ui/ExpenseRow';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type Expense = {
  id: string;
  title: string;
  amount: string;
};

export default function HomeScreen() {
  const router = useRouter();
  
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', title: 'Groceries', amount: '$50.00' },
    { id: '2', title: 'Taxi', amount: '$20.00' },
    { id: '3', title: 'Coffee', amount: '$30.00' },
  ]);

  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      {expenses.map((expense) => (
        <ExpenseRow key={expense.id} title={expense.title} amount={expense.amount} onPress={() => 
          router.push(`/expense/${expense.id}`)  
        } />
      ))}
      <Pressable
        onPress={() =>
          setExpenses((prevExpenses) => [
            ...prevExpenses,
            { id: (prevExpenses.length + 1).toString(), title: 'New Expense', amount: '$10.00' },
          ])
        }
      >
        <Text>+ Add Expense</Text>
      </Pressable>
    </View>
  );
}
