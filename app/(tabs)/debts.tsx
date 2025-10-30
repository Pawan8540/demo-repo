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
} from 'react-native';
import { useFinance } from '@/contexts/FinanceContext';
import { Plus, X, Calendar, UserMinus, UserPlus, CheckCircle } from 'lucide-react-native';

type TabType = 'debts' | 'credits';

export default function DebtsScreen() {
  const {
    debts,
    credits,
    addDebt,
    addCredit,
    markDebtAsPaid,
    markCreditAsReturned,
    deleteDebt,
    deleteCredit,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<TabType>('debts');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<TabType>('debts');
  const [amount, setAmount] = useState('');
  const [personName, setPersonName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAdd = () => {
    if (!amount || parseFloat(amount) <= 0 || !personName.trim()) {
      return;
    }

    const data = {
      amount: parseFloat(amount),
      personName: personName.trim(),
      description: description || '',
      date: date,
      isPaid: false,
      isReturned: false,
    };

    if (modalType === 'debts') {
      addDebt(data);
    } else {
      addCredit(data);
    }

    setAmount('');
    setPersonName('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setModalVisible(false);
  };

  const openModal = (type: TabType) => {
    setModalType(type);
    setModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const unpaidDebts = debts.filter(d => !d.isPaid);
  const paidDebts = debts.filter(d => d.isPaid);
  const unreturnedCredits = credits.filter(c => !c.isReturned);
  const returnedCredits = credits.filter(c => c.isReturned);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'debts' && styles.activeTab]}
          onPress={() => setActiveTab('debts')}
        >
          <Text style={[styles.tabText, activeTab === 'debts' && styles.activeTabText]}>
            Money I Owe
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'credits' && styles.activeTab]}
          onPress={() => setActiveTab('credits')}
        >
          <Text style={[styles.tabText, activeTab === 'credits' && styles.activeTabText]}>
            Money Owed to Me
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {activeTab === 'debts' ? (
            <>
              {unpaidDebts.length === 0 && paidDebts.length === 0 ? (
                <View style={styles.emptyState}>
                  <UserMinus color="#9CA3AF" size={64} />
                  <Text style={styles.emptyStateTitle}>No debts recorded</Text>
                  <Text style={styles.emptyStateText}>
                    Tap the + button to record money you borrowed
                  </Text>
                </View>
              ) : (
                <>
                  {unpaidDebts.length > 0 && (
                    <>
                      <Text style={styles.sectionLabel}>Unpaid</Text>
                      {unpaidDebts.map((debt) => (
                        <TouchableOpacity
                          key={debt.id}
                          style={styles.card}
                          onLongPress={() => deleteDebt(debt.id)}
                        >
                          <View style={styles.cardHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                              <UserMinus color="#DC2626" size={20} />
                            </View>
                            <View style={styles.cardInfo}>
                              <Text style={styles.cardName}>{debt.personName}</Text>
                              <Text style={styles.cardDescription}>{debt.description}</Text>
                              <Text style={styles.cardDate}>{formatDate(debt.date)}</Text>
                            </View>
                            <Text style={styles.cardAmount}>₹{debt.amount.toLocaleString()}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.markButton}
                            onPress={() => markDebtAsPaid(debt.id)}
                          >
                            <CheckCircle color="#10B981" size={16} />
                            <Text style={styles.markButtonText}>Mark as Paid</Text>
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}

                  {paidDebts.length > 0 && (
                    <>
                      <Text style={styles.sectionLabel}>Paid</Text>
                      {paidDebts.map((debt) => (
                        <TouchableOpacity
                          key={debt.id}
                          style={[styles.card, styles.cardCompleted]}
                          onLongPress={() => deleteDebt(debt.id)}
                        >
                          <View style={styles.cardHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
                              <CheckCircle color="#059669" size={20} />
                            </View>
                            <View style={styles.cardInfo}>
                              <Text style={[styles.cardName, styles.cardNameCompleted]}>
                                {debt.personName}
                              </Text>
                              <Text style={styles.cardDescription}>{debt.description}</Text>
                              <Text style={styles.cardDate}>{formatDate(debt.date)}</Text>
                            </View>
                            <Text style={[styles.cardAmount, styles.cardAmountCompleted]}>
                              ₹{debt.amount.toLocaleString()}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {unreturnedCredits.length === 0 && returnedCredits.length === 0 ? (
                <View style={styles.emptyState}>
                  <UserPlus color="#9CA3AF" size={64} />
                  <Text style={styles.emptyStateTitle}>No credits recorded</Text>
                  <Text style={styles.emptyStateText}>
                    Tap the + button to record money you lent
                  </Text>
                </View>
              ) : (
                <>
                  {unreturnedCredits.length > 0 && (
                    <>
                      <Text style={styles.sectionLabel}>To Collect</Text>
                      {unreturnedCredits.map((credit) => (
                        <TouchableOpacity
                          key={credit.id}
                          style={styles.card}
                          onLongPress={() => deleteCredit(credit.id)}
                        >
                          <View style={styles.cardHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                              <UserPlus color="#2563EB" size={20} />
                            </View>
                            <View style={styles.cardInfo}>
                              <Text style={styles.cardName}>{credit.personName}</Text>
                              <Text style={styles.cardDescription}>{credit.description}</Text>
                              <Text style={styles.cardDate}>{formatDate(credit.date)}</Text>
                            </View>
                            <Text style={[styles.cardAmount, { color: '#2563EB' }]}>
                              ₹{credit.amount.toLocaleString()}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.markButton}
                            onPress={() => markCreditAsReturned(credit.id)}
                          >
                            <CheckCircle color="#10B981" size={16} />
                            <Text style={styles.markButtonText}>Mark as Returned</Text>
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}

                  {returnedCredits.length > 0 && (
                    <>
                      <Text style={styles.sectionLabel}>Returned</Text>
                      {returnedCredits.map((credit) => (
                        <TouchableOpacity
                          key={credit.id}
                          style={[styles.card, styles.cardCompleted]}
                          onLongPress={() => deleteCredit(credit.id)}
                        >
                          <View style={styles.cardHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
                              <CheckCircle color="#059669" size={20} />
                            </View>
                            <View style={styles.cardInfo}>
                              <Text style={[styles.cardName, styles.cardNameCompleted]}>
                                {credit.personName}
                              </Text>
                              <Text style={styles.cardDescription}>{credit.description}</Text>
                              <Text style={styles.cardDate}>{formatDate(credit.date)}</Text>
                            </View>
                            <Text style={[styles.cardAmount, styles.cardAmountCompleted]}>
                              ₹{credit.amount.toLocaleString()}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => openModal(activeTab)}
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
              <Text style={styles.modalTitle}>
                {modalType === 'debts' ? 'Add Debt' : 'Add Credit'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Person Name</Text>
              <TextInput
                style={styles.input}
                value={personName}
                onChangeText={setPersonName}
                placeholder="Who did you borrow from / lend to?"
                placeholderTextColor="#9CA3AF"
              />
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
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="What was it for?"
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

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAdd}
              activeOpacity={0.9}
            >
              <Text style={styles.submitButtonText}>
                {modalType === 'debts' ? 'Add Debt' : 'Add Credit'}
              </Text>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#10B981',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#10B981',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompleted: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 4,
  },
  cardNameCompleted: {
    textDecorationLine: 'line-through',
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#DC2626',
  },
  cardAmountCompleted: {
    textDecorationLine: 'line-through',
  },
  markButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    gap: 6,
  },
  markButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#059669',
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
    maxHeight: '85%',
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

