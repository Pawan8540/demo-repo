// template
import { StyleSheet, Text, View } from "react-native";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Rork app will be here</Text>
      <Text style={styles.text}>Please wait until we finish building it</Text>
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useFinance } from '@/contexts/FinanceContext';
import { Plus, TrendingDown, TrendingUp, AlertCircle, Lightbulb, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';



export default function HomeScreen() {
  const { monthlyStats, insights, expenses, debts, credits } = useFinance();
  const router = useRouter();
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const unpaidDebts = debts.filter(d => !d.isPaid);
  const unreturnedCredits = credits.filter(c => !c.isReturned);
  const totalUnpaidDebts = unpaidDebts.reduce((sum, d) => sum + d.amount, 0);
  const totalUnreturnedCredits = unreturnedCredits.reduce((sum, c) => sum + c.amount, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerTitle}>Your Balance</Text>
          <Text style={styles.balanceText}>
            ₹{(totalUnreturnedCredits - totalUnpaidDebts - monthlyStats.totalExpenses).toLocaleString()}
          </Text>
          <Text style={styles.headerSubtitle}>This month</Text>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FEE2E2' }]}>
              <TrendingDown color="#DC2626" size={24} />
            </View>
            <Text style={styles.statValue}>₹{monthlyStats.totalExpenses.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
              <TrendingUp color="#2563EB" size={24} />
            </View>
            <Text style={styles.statValue}>₹{totalUnreturnedCredits.toLocaleString()}</Text>
            <Text style={styles.statLabel}>To Collect</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <TrendingDown color="#D97706" size={24} />
            </View>
            <Text style={styles.statValue}>₹{totalUnpaidDebts.toLocaleString()}</Text>
            <Text style={styles.statLabel}>To Pay</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: '#10B981' }]}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => router.push('/(tabs)/expenses')}
                activeOpacity={0.9}
              >
                <Plus color="#FFFFFF" size={28} />
                <Text style={styles.actionText}>Add Expense</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#3B82F6' }]}
              onPress={() => router.push('/(tabs)/debts')}
              activeOpacity={0.9}
            >
              <TrendingUp color="#FFFFFF" size={28} />
              <Text style={styles.actionText}>Track Money</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#8B5CF6' }]}
              onPress={() => router.push('/(tabs)/analytics')}
              activeOpacity={0.9}
            >
              <AlertCircle color="#FFFFFF" size={28} />
              <Text style={styles.actionText}>View Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {insights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insights</Text>
            {insights.map((insight, index) => (
              <View
                key={index}
                style={[
                  styles.insightCard,
                  {
                    backgroundColor:
                      insight.type === 'warning'
                        ? '#FEF3C7'
                        : insight.type === 'success'
                        ? '#D1FAE5'
                        : '#DBEAFE',
                  },
                ]}
              >
                <View style={styles.insightHeader}>
                  {insight.type === 'warning' && <AlertCircle color="#D97706" size={20} />}
                  {insight.type === 'success' && <CheckCircle color="#059669" size={20} />}
                  {insight.type === 'tip' && <Lightbulb color="#2563EB" size={20} />}
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                </View>
                <Text style={styles.insightMessage}>{insight.message}</Text>
              </View>
            ))}
          </View>
        )}

        {expenses.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Welcome to Finance Tracker!</Text>
            <Text style={styles.emptyStateText}>
              Start tracking your expenses, debts, and credits to get personalized financial insights.
            </Text>
          </View>
        )}
      </ScrollView>
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
  headerGradient: {
    padding: 32,
    paddingTop: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '500' as const,
  },
  balanceText: {
    fontSize: 48,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500' as const,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600' as const,
    marginTop: 8,
    textAlign: 'center',
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#111827',
  },
  insightMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});
