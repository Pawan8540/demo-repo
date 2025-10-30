import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useFinance } from "../../contexts/FinanceContext";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react-native";

export default function HomeScreen() {
  const {
    expenses,
    debts,
    credits,
    getTotalExpenses,
    getTotalDebts,
    getTotalCredits,
    getMonthlyExpenses,
    getMonthlyStats,
    getFinancialInsights,
  } = useFinance();

  const totalExpenses = getTotalExpenses();
  const totalDebts = getTotalDebts();
  const totalCredits = getTotalCredits();
  const monthlyExpenses = getMonthlyExpenses();
  const monthlyStats = getMonthlyStats();
  const insights = getFinancialInsights();

  const balance = totalCredits - totalExpenses - totalDebts;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finance Dashboard</Text>
          <Text style={styles.headerSubtitle}>Track your financial health</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Wallet color="#FFFFFF" size={24} />
            <Text style={styles.balanceLabel}>Current Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>
            ${balance.toFixed(2)}
          </Text>
          <View style={styles.balanceFooter}>
            <View style={styles.balanceItem}>
              <TrendingUp color="#10B981" size={16} />
              <Text style={styles.balanceItemText}>
                Credits: ${totalCredits.toFixed(2)}
              </Text>
            </View>
            <View style={styles.balanceItem}>
              <TrendingDown color="#EF4444" size={16} />
              <Text style={styles.balanceItemText}>
                Expenses: ${totalExpenses.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Monthly Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: "#DBEAFE" }]}>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={[styles.statValue, { color: "#1E40AF" }]}>
                ${monthlyStats.expenses.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#FEE2E2" }]}>
              <Text style={styles.statLabel}>Debts</Text>
              <Text style={[styles.statValue, { color: "#991B1B" }]}>
                ${monthlyStats.debts.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#D1FAE5" }]}>
              <Text style={styles.statLabel}>Credits</Text>
              <Text style={[styles.statValue, { color: "#065F46" }]}>
                ${monthlyStats.credits.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <DollarSign color="#10B981" size={24} />
              <Text style={styles.actionText}>Add Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <TrendingDown color="#EF4444" size={24} />
              <Text style={styles.actionText}>Add Debt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <TrendingUp color="#3B82F6" size={24} />
              <Text style={styles.actionText}>Add Credit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Financial Insights */}
        {insights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Insights</Text>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {expenses.length === 0 ? (
            <Text style={styles.emptyText}>No transactions yet</Text>
          ) : (
            expenses.slice(0, 5).map((expense) => (
              <View key={expense.id} style={styles.transactionItem}>
                <View>
                  <Text style={styles.transactionTitle}>{expense.title}</Text>
                  <Text style={styles.transactionDate}>
                    {new Date(expense.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.transactionAmount}>
                  -${expense.amount.toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  balanceCard: {
    margin: 16,
    padding: 20,
    backgroundColor: "#10B981",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  balanceFooter: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
  balanceItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  balanceItemText: {
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 4,
    opacity: 0.9,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#111827",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center" as const,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold" as const,
  },
  actionGrid: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: "#374151",
    marginTop: 8,
    textAlign: "center" as const,
  },
  insightCard: {
    padding: 12,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: "#92400E",
  },
  transactionItem: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: "#111827",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#EF4444",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center" as const,
    paddingVertical: 32,
  },
});
