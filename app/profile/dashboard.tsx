import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform, Dimensions, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProtectedRoute } from "../AuthProvider";
import { useNavigation } from "@react-navigation/native";
import MainLayout from "../components/MainLayout";
import { Ionicons } from '@expo/vector-icons';
import { LineChart, ProgressChart, BarChart } from 'react-native-chart-kit';
import tw from 'twrnc';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const cardWidth = width > 768 ? width * 0.3 : width * 0.44;

  // Datos para los gráficos (sin cambios)
  const progressData = {
    data: [0.85]
  };
  const progressPercentage = Math.round(progressData.data[0] * 100);
  const lineData1 = {
    labels: ['', '', '', '', '', ''],
    datasets: [
      {
        data: [10, 15, 50, 30, 20, 15],
        color: () => '#22c55e',
        strokeWidth: 2
      },
      {
        data: [5, 10, 15, 8, 12, 10],
        color: () => '#3b82f6',
        strokeWidth: 2
      }
    ],
  };
  
  const lineData2 = {
    labels: ['', '', '', '', '', ''],
    datasets: [
      {
        data: [15, 20, 35, 45, 25, 30],
        color: () => '#22c55e',
        strokeWidth: 2
      },
      {
        data: [8, 12, 18, 10, 15, 12],
        color: () => '#3b82f6',
        strokeWidth: 2
      }
    ],
  };
  
  const areaData = {
    labels: ['', '', '', '', '', ''],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: () => 'rgba(34, 197, 94, 0.2)',
        strokeWidth: 2,
      },
    ],
  };
  
  const transactions = [
    { id: '1', date: '12 Mar 2023', description: 'Transferencia WAN', amount: '$1,240.50', status: 'Completado' },
    { id: '2', date: '10 Mar 2023', description: 'Optimización LAN', amount: '$890.00', status: 'Pendiente' },
    { id: '3', date: '08 Mar 2023', description: 'Configuración SSL', amount: '$450.75', status: 'Completado' },
    { id: '4', date: '05 Mar 2023', description: 'Actualización Ratio', amount: '$320.25', status: 'Completado' },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <SafeAreaView style={[styles.container, tw`py-16`]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {/* Report Card */}
              <View style={styles.reportCard}>
                <Text style={styles.cardTitle}>Report</Text>
                
                <View style={styles.reportContent}>
                  <View style={styles.sslItems}>
                    <View style={styles.sslItem}>
                      <View style={[styles.dot, { backgroundColor: '#22c55e' }]} />
                      <Text style={styles.sslText}>Ssl-01</Text>
                    </View>
                    <View style={styles.sslItem}>
                      <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
                      <Text style={styles.sslText}>Ssl-03</Text>
                    </View>
                    <View style={styles.sslItem}>
                      <View style={[styles.dot, { backgroundColor: '#6366f1' }]} />
                      <Text style={styles.sslText}>Ssl-02</Text>
                    </View>
                    <View style={styles.sslItem}>
                      <View style={[styles.dot, { backgroundColor: '#e2e8f0' }]} />
                      <Text style={styles.sslText}>Ssl-04</Text>
                    </View>
                  </View>
                  
                  <View style={styles.progressContainer}>
                    <ProgressChart
                      data={progressData}
                      width={120}
                      height={120}
                      strokeWidth={12}
                      radius={50}
                      chartConfig={{
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                        style: {
                          borderRadius: 16,
                        },
                      }}
                      hideLegend={true}
                      style={{
                        marginRight: -10,
                      }}
                    />
                    <View style={styles.progressTextContainer}>
                      <Text style={styles.progressText}>{progressPercentage}%</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Optimized Cards Row */}
              <View style={styles.row}>
                {/* Optimized Mbps: Wan Tx */}
                <View style={[styles.card, { width: cardWidth }]}>
                  <Text style={styles.cardTitle}>Invertion</Text>
                  <View style={styles.mbpsContainer}>
                    <Text style={styles.mbpsText}>Mbps : </Text>
                    <Text style={styles.wanText}>Wan Tx</Text>
                  </View>
                  
                  <LineChart
                    data={lineData1}
                    width={cardWidth - 20}
                    height={100}
                    chartConfig={{
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '0',
                      },
                    }}
                    bezier
                    style={styles.chart}
                    withHorizontalLines={false}
                    withVerticalLines={false}
                    withShadow={false}
                    withInnerLines={false}
                    withOuterLines={false}
                    withHorizontalLabels={false}
                  />
                  
                  <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
                      <Text style={styles.legendText}>From LAN</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                      <Text style={styles.legendText}>To WAN</Text>
                    </View>
                  </View>
                </View>
                
                {/* Optimized Mbps: Wan Rx */}
                <View style={[styles.card, { width: cardWidth }]}>
                  <Text style={styles.cardTitle}>Gains</Text>
                  <View style={styles.mbpsContainer}>
                    <Text style={styles.mbpsText}>Mbps : </Text>
                    <Text style={styles.wanText}>Wan Rx</Text>
                  </View>
                  
                  <LineChart
                    data={lineData2}
                    width={cardWidth - 20}
                    height={100}
                    chartConfig={{
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '0',
                      },
                    }}
                    bezier
                    style={styles.chart}
                    withHorizontalLines={false}
                    withVerticalLines={false}
                    withDots={false}
                    withShadow={false}
                    withInnerLines={false}
                    withOuterLines={false}
                    withHorizontalLabels={false}
                  />
                  
                  <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
                      <Text style={styles.legendText}>From LAN</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                      <Text style={styles.legendText}>To WAN</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Ratio and Create Cards Row */}
              <View style={tw`w-full flex justify-center items-center`}>
                {/* Ratio Card */}
                <View style={[styles.card, tw`w-full`]}>
                  <Text style={styles.cardTitle}>Exponentials</Text>
                  
                  <View style={styles.areaChartContainer}>
                    <BarChart
                      data={areaData}
                      width={270}
                      height={120}
                      chartConfig={{
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                          borderRadius: 16,
                        },
                        fillShadowGradient: 'rgba(34, 197, 94, 0.2)',
                        fillShadowGradientOpacity: 0.2,
                      }}
                      style={styles.chart}
                      withHorizontalLabels={false}
                      withVerticalLabels={false}
                      withShadow={false}
                      withInnerLines={false}
                      withOuterLines={false}
                    />
                    
                    <View style={styles.ratioValueContainer}>
                      <View style={styles.ratioValue}>
                        <Text style={styles.ratioValueText}>1.4</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.progressBar}>
                    <View style={styles.progressBarFill} />
                  </View>
                </View>
              </View>
              
              {/* Transactions Table */}
              <View style={styles.tableCard}>
                <Text style={styles.cardTitle}>Last Transactions</Text>
                
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, { flex: 1 }]}>Date</Text>
                  <Text style={[styles.tableHeaderText, { flex: 2 }]}>Description</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1 }]}>Amount</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1 }]}>State</Text>
                </View>
                
                {transactions.map((transaction) => (
                  <View key={transaction.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{transaction.date}</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{transaction.description}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{transaction.amount}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: transaction.status === 'Completado' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)' }]}>
                      <Text style={[styles.statusText, { color: transaction.status === 'Completado' ? '#22c55e' : '#eab308' }]}>{transaction.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </MainLayout>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    color: '#22c55e',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#22c55e',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  reportCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1e293b',
  },
  reportContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sslItems: {
    flexWrap: 'wrap',
    width: '50%',
  },
  sslItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  sslText: {
    fontSize: 14,
    color: '#1e293b',
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  percentSign: {
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  card: {
    borderRadius: 16,
    padding: 15,
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  mbpsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mbpsText: {
    fontSize: 14,
    color: '#1e293b',
  },
  wanText: {
    fontSize: 14,
    color: '#22c55e',
  },
  chart: {
    marginLeft: -10,
  },
  legendContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#1e293b',
  },
  areaChartContainer: {
    position: 'relative',
  },
  ratioValueContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  ratioValue: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratioValueText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderRadius: 3,
    marginTop: 10,
  },
  progressBarFill: {
    width: '70%',
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 3,
  },
  createContent: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridIllustration: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 80,
    justifyContent: 'space-between',
  },
  gridDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    margin: 5,
  },
  personIllustration: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  createButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  tableCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 80,
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1e293b',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#ffffff',
  },
  navButton: {
    padding: 10,
  },
  navButtonCenter: {
    backgroundColor: '#22c55e',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
});

export default DashboardScreen;