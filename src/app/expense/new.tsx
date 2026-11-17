import { expenseFormSchema, type ExpenseFormValues } from '@/features/expenses/expenseSchema';
import { useAddExpense } from '@/features/expenses/useExpenses';
import { isReceiptOcrAvailable, recognizeText } from '@/features/receipts/ocr';
import { parseTotal } from '@/features/receipts/parseTotal';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Control, Controller, FieldPath, useForm } from 'react-hook-form';
import { Platform, Pressable, Text, TextInput, type TextInputProps, View } from 'react-native';

export default function NewExpenseScreen() {
  const router = useRouter();
  const addExpense = useAddExpense();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: { title: '', amount: '', currency: 'USD', spent_at: '2026-11-10' },
  });

  function onSubmit(values: ExpenseFormValues) {
    const amount_minor = Math.round(Number(values.amount.replace(',', '.')) * 100);
    addExpense.mutate(
      {
        title: values.title.trim(),
        amount_minor,
        currency: values.currency.trim().toUpperCase(),
        spent_at: values.spent_at,
        created_at: new Date().toISOString(),
      },
      { onSuccess: () => router.back() },
    );
  }

  // One-shot image pick → native Vision OCR → parseTotal → prefill the amount.
  // The image is NOT stored (out of scope) — we only extract a number from it.
  async function onScan() {
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    if (picked.canceled) return;
    const lines = await recognizeText(picked.assets[0].uri);
    const parsed = parseTotal(lines);
    if (parsed) {
      setValue('amount', (parsed.amountMinor / 100).toFixed(2), { shouldValidate: true });
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 14 }}>
      <Field label="Title" name="title" control={control} error={errors.title?.message} placeholder="Groceries" />
      <Field label="Amount" name="amount" control={control} error={errors.amount?.message} placeholder="12.99" keyboardType="decimal-pad" />
      <Field label="Currency" name="currency" control={control} error={errors.currency?.message} placeholder="USD" autoCapitalize="characters" />
      <Field label="Date" name="spent_at" control={control} error={errors.spent_at?.message} placeholder="2026-11-10" />

      {isReceiptOcrAvailable && Platform.OS === 'ios' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Scan amount from receipt"
          onPress={() => void onScan()}
          style={{ padding: 13, borderRadius: 10, borderWidth: 1, borderColor: '#208AEF', alignItems: 'center' }}
        >
          <Text style={{ color: '#208AEF', fontWeight: '600' }}>Scan amount</Text>
        </Pressable>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save expense"
        disabled={isSubmitting}
        onPress={() => void handleSubmit(onSubmit)()}
        style={{ backgroundColor: '#208AEF', padding: 14, borderRadius: 10, alignItems: 'center', opacity: isSubmitting ? 0.6 : 1 }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>Save</Text>
      </Pressable>
    </View>
  );
}

type FieldProps = {
  label: string;
  name: FieldPath<ExpenseFormValues>;
  control: Control<ExpenseFormValues>;
  error?: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
};

// Controller bridges uncontrolled RHF state to the controlled TextInput.
function Field({ label, name, control, error, placeholder, keyboardType, autoCapitalize }: FieldProps) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ fontWeight: '600' }}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            style={{
              borderWidth: 1,
              borderColor: error ? '#d9534f' : '#ccc',
              borderRadius: 8,
              padding: 10,
              fontSize: 16,
            }}
          />
        )}
      />
      {error ? <Text style={{ color: '#d9534f', fontSize: 12 }}>{error}</Text> : null}
    </View>
  );
}
