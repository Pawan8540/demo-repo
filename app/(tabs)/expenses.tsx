import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { useFinance } from '@/contexts/FinanceContext';
import { Plus, X, Calendar } from 'lucide-react-native';
import { EXPENSE_CATEGORIES, getCategoryInfo } from '@/constants/categories';
import { ExpenseCategory } from '@/types/finance';

export default function ExpensesScreen() {
  const { expenses, addExpense, deleteExpense } = useFinance();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddExpense = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    addExpense({
      amount: parseFloat(amount),
      category: selectedCategory,
      description: description || 'Expense',
      date: date,
    });

    setAmount('');
    setDescription('');
    setSelectedCategory('food');
    setDate(new Date().toISOString().split('T')[0]);
    setModalVisible(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {expenses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No expenses yet</Text>
              <Text style={styles.emptyStateText}>
                Tap the + button to add your first expense
              </Text>
            </View>
          ) : (
            expenses.map((expense) => {
              const categoryInfo = getCategoryInfo(expense.category);
              return (
                <TouchableOpacity
                  key={expense.id}
                  style={styles.expenseCard}
                  onLongPress={() => deleteExpense(expense.id)}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: categoryInfo.color + '20' },
                    ]}
                  >
                    <Text style={styles.categoryEmoji}>
                      {categoryInfo.label.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <Text style={styles.expenseCategory}>{categoryInfo.label}</Text>
                    <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
                  </View>
                  <Text style={styles.expenseAmount}>₹{expense.amount.toLocaleString()}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
        <Plus color="#FFFFFF" size={28} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Expense</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (₹)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="What did you spend on?"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <View style={styles.dateInput}>
                <Calendar color="#6B7280" size={20} />
                <TextInput
                  style={styles.dateText}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <FlatList
                data={EXPENSE_CATEGORIES}
                keyExtractor={(item) => item.id}
                numColumns={4}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <Pressable
                    style={[
                      styles.categoryButton,
                      selectedCategory === item.id && styles.categoryButtonSelected,
                      { borderColor: item.color },
                    ]}
                    onPress={() => setSelectedCategory(item.id)}
                  >
                    <View
                      style={[
                        styles.categoryButtonIcon,
                        { backgroundColor: item.color + '20' },
                      ]}
                    >
                      <Text style={styles.categoryButtonText}>{item.label.charAt(0)}</Text>
                    </View>
                    <Text
                      style={[
                        styles.categoryButtonLabel,
                        selectedCategory === item.id && styles.categoryButtonLabelSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {item.label.split(' ')[0]}
                    </Text>
                  </Pressable>
                )}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddExpense}
              activeOpacity={0.9}
            >
              <Text style={styles.submitButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#DC2626',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#111827',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  categoryButton: {
    flex: 1,
    margin: 4,
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 70,
  },
  categoryButtonSelected: {
    borderWidth: 2,
  },
  categoryButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  categoryButtonLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  categoryButtonLabelSelected: {
    color: '#111827',
    fontWeight: '600' as const,
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
});
