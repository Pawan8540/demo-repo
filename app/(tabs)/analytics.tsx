import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useFinance } from '@/contexts/FinanceContext';
import { getCategoryInfo } from '@/constants/categories';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { monthlyStats, expenses } = useFinance();

  const categoryData = Object.entries(monthlyStats.categoryBreakdown)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a);

  const total = categoryData.reduce((sum, [, amount]) => sum + amount, 0);

  const chartSize = width - 64;
  const radius = chartSize / 2 - 40;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;

  let currentAngle = -90;

  const pieSlices = categoryData.map(([category, amount]) => {
    const percentage = (amount / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = [
      `M ${centerX} ${centerY}`,
      `L ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      'Z',
    ].join(' ');

    const midAngle = startAngle + angle / 2;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos((midAngle * Math.PI) / 180);
    const labelY = centerY + labelRadius * Math.sin((midAngle * Math.PI) / 180);

    currentAngle = endAngle;

    return {
      category,
      amount,
      percentage,
      path,
      labelX,
      labelY,
    };
  });

  const recentExpenses = expenses.slice(0, 5);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Monthly Spending</Text>
            <Text style={styles.summaryAmount}>₹{monthlyStats.totalExpenses.toLocaleString()}</Text>
            <Text style={styles.summaryDate}>
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Text>
          </View>

          {categoryData.length > 0 ? (
            <>
              <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Spending by Category</Text>
                <View style={styles.chartContainer}>
                  <Svg width={chartSize} height={chartSize}>
                    {pieSlices.map((slice, index) => {
                      const categoryInfo = getCategoryInfo(slice.category as any);
                      return (
                        <React.Fragment key={slice.category}>
                          <SvgText
                            x={slice.labelX}
                            y={slice.labelY}
                            fill="#111827"
                            fontSize="24"
                            fontWeight="bold"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                          >
                            {categoryInfo.label.charAt(0)}
                          </SvgText>
                        </React.Fragment>
                      );
                    })}
                    <Circle
                      cx={centerX}
                      cy={centerY}
                      r={radius * 0.5}
                      fill="#FFFFFF"
                    />
                    <SvgText
                      x={centerX}
                      y={centerY - 10}
                      fill="#6B7280"
                      fontSize="14"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      Total
                    </SvgText>
                    <SvgText
                      x={centerX}
                      y={centerY + 12}
                      fill="#111827"
                      fontSize="20"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ₹{total.toLocaleString()}
                    </SvgText>
                  </Svg>
                </View>
              </View>

              <View style={styles.legendSection}>
                <Text style={styles.sectionTitle}>Breakdown</Text>
                {categoryData.map(([category, amount]) => {
                  const categoryInfo = getCategoryInfo(category as any);
                  const percentage = ((amount / total) * 100).toFixed(1);
                  return (
                    <View key={category} style={styles.legendItem}>
                      <View style={styles.legendLeft}>
                        <View
                          style={[
                            styles.legendDot,
                            { backgroundColor: categoryInfo.color },
                          ]}
                        />
                        <Text style={styles.legendLabel}>{categoryInfo.label}</Text>
                      </View>
                      <View style={styles.legendRight}>
                        <Text style={styles.legendPercentage}>{percentage}%</Text>
                        <Text style={styles.legendAmount}>₹{amount.toLocaleString()}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {recentExpenses.length > 0 && (
                <View style={styles.recentSection}>
                  <Text style={styles.sectionTitle}>Recent Expenses</Text>
                  {recentExpenses.map((expense) => {
                    const categoryInfo = getCategoryInfo(expense.category);
                    return (
                      <View key={expense.id} style={styles.recentItem}>
                        <View
                          style={[
                            styles.recentIcon,
                            { backgroundColor: categoryInfo.color + '20' },
                          ]}
                        >
                          <Text style={styles.recentEmoji}>{categoryInfo.label.charAt(0)}</Text>
                        </View>
                        <View style={styles.recentInfo}>
                          <Text style={styles.recentDescription}>{expense.description}</Text>
                          <Text style={styles.recentCategory}>{categoryInfo.label}</Text>
                        </View>
                        <Text style={styles.recentAmount}>₹{expense.amount.toLocaleString()}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No data yet</Text>
              <Text style={styles.emptyStateText}>
                Start adding expenses to see your analytics
              </Text>
            </View>
          )}
        </View>
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
  content: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold' as const,
    color: '#DC2626',
    marginBottom: 4,
  },
  summaryDate: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginBottom: 16,
  },
  chartContainer: {
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
  legendSection: {
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#111827',
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  legendPercentage: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
    marginBottom: 2,
  },
  legendAmount: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#111827',
  },
  recentSection: {
    marginBottom: 24,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentEmoji: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  recentInfo: {
    flex: 1,
  },
  recentDescription: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 2,
  },
  recentCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  recentAmount: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#DC2626',
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
});

