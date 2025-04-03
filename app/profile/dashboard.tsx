import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, LogBox, TouchableOpacity } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from "react-native-safe-area-context";
import { ProtectedRoute } from "../AuthProvider";
import { useNavigation } from "@react-navigation/native";
import MainLayout from "../components/MainLayout";
import { LineChart, ProgressChart, BarChart } from 'react-native-chart-kit';
import { getStatics,getLinesData, getTransactinsPerMonth, getTransactionList } from "../../hooks/ts/dashboard/statics";
import tw from 'twrnc';
import { showMessage } from 'react-native-flash-message';
import { Feather } from "@expo/vector-icons";


LogBox.ignoreLogs([
  'Unknown event handler property', // Ignora advertencias específicas  
]);


const DashboardScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const cardWidth = width > 768 ? width * 0.3 : width * 0.44;
  const [chartData, setChartData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [transactionsData, setTransactionsData] = useState<{ year: string; month: string; total: string }[] | null>(null);
  const [transactionList, setTransactionList] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2025'); // Por defecto mostrar 2025
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Número de transacciones por página

  const handleGetInfo = async () => { 
    try {
      const data = await getStatics();
        if(data){
          setChartData(data);
        }
      const linesData = await getLinesData();
        if(linesData){
          setFinancialData(linesData);
        }
      const transactions = await getTransactinsPerMonth();
        if(transactions){
          console.log(transactions);
          setTransactionsData(transactions);
        }
      const transactionTable = await getTransactionList();
        if(transactionTable){
          console.log(transactionTable);
          setTransactionList(transactionTable);
        }
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'Failed to fetch data',
        type: 'danger',
      });
      console.error(error);
    }
  }

  function generateChartData(currentValue, targetValue, months = 6) {
    // Crear una progresión desde un valor inicial hasta el valor actual
    const initialValue = currentValue * 0.7; // Valor inicial (70% del actual para mostrar crecimiento)
    const step = (currentValue - initialValue) / (months - 1);
    
    const data = [];
    for (let i = 0; i < months; i++) {
      data.push(Math.round(initialValue + (step * i)));
    }
    
    // Proyección futura (valor objetivo)
    const futureData = [];
    for (let i = 0; i < months; i++) {
      // Si es el primer punto, usar el valor actual
      if (i === 0) {
        futureData.push(currentValue);
      } else {
        // Generar una progresión hacia el valor objetivo
        const progress = i / (months - 1);
        futureData.push(Math.round(currentValue + (targetValue - currentValue) * progress));
      }
    }
    
    return {
      current: data,
      future: futureData
    };
  }

  const generateEmergencyFundChart = () => {
    // regresar una alerta si no hay datos
    if (!financialData) {
      // showMessage({
      //   message: 'Error',
      //   description: 'No financial data available',
      //   type: 'danger',
      // });
      return { labels: [], datasets: [] }; // Valores predeterminados
    }
    // Calcular un valor objetivo (por ejemplo, 3 veces el fondo actual)
    const targetEmergencyFund = financialData.emergency_fund * 1.5;
    
    // Generar datos para la gráfica
    const chartData = generateChartData(financialData.emergency_fund, targetEmergencyFund);
    
    return {
      labels: ['', '', '', '', '', ''],
      datasets: [
        {
          data: chartData.current,
          color: () => '#22c55e',
          strokeWidth: 2
        },
        {
          data: chartData.future,
          color: () => '#3b82f6',
          strokeWidth: 2
        }
      ],
    };
  }
  const emergencyFundChart = generateEmergencyFundChart();
  
  const generateExpensesChart = () => {
    // regresar una alerta si no hay datos
    if (!financialData) {
      return { labels: [], datasets: [] }; // Valores predeterminados; // Usar datos de ejemplo si no hay datos reales
    }    
    // Para gastos, podríamos querer mostrar una reducción como objetivo
    const targetExpenses = financialData.total_expenses * 0.85; // Reducción del 15%
    
    // Generar datos para la gráfica
    const chartData = generateChartData(financialData.total_expenses, targetExpenses);
    
    return {
      labels: ['', '', '', '', '', ''],
      datasets: [
        {
          data: chartData.current,
          color: () => '#22c55e',
          strokeWidth: 2
        },
        {
          data: chartData.future,
          color: () => '#3b82f6',
          strokeWidth: 2
        }
      ],
    };
  }
  
  // Reemplazar lineData2 con esta función
  const expensesChart = generateExpensesChart();

  // Función para preparar los datos para la gráfica exponencial
  const generateExponentialChartData = () => {
    if (!transactionsData || !transactionsData.transactions) {
      return {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
        growthRates: []
      };
    }
    
    // Verificar que transactions sea un array
    const transactions = Array.isArray(transactionsData.transactions) 
      ? transactionsData.transactions
      : [];
    
    // Filtrar transacciones por el año seleccionado
    const yearTransactions = transactions.filter(
      t => t.year === selectedYear
    );
    
    // Crear un array de 12 meses con valores en 0
    const monthlyData = Array(12).fill(0);
    
    // Llenar con los datos disponibles
    yearTransactions.forEach(transaction => {
      const monthIndex = parseInt(transaction.month) - 1; // Convertir a índice base 0
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex] = parseFloat(transaction.total);
      }
    });
    
    // Calcular el crecimiento mes a mes (porcentaje)
    const growthRates = [];
    for (let i = 1; i < monthlyData.length; i++) {
      if (monthlyData[i-1] > 0 && monthlyData[i] > 0) {
        const growth = ((monthlyData[i] - monthlyData[i-1]) / monthlyData[i-1]) * 100;
        growthRates.push(growth.toFixed(1));
      } else {
        growthRates.push('0.0');
      }
    }
    
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          data: monthlyData,
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Verde
          strokeWidth: 2,
          // Para AreaChart
          fillShadowGradientFrom: "rgba(34, 197, 94, 0.7)",
          fillShadowGradientTo: "rgba(34, 197, 94, 0.1)",
        }
      ],
      growthRates: growthRates // Guardar las tasas de crecimiento para mostrarlas
    };
  };

  // Obtener los datos formateados para la gráfica
  const exponentialChartData = generateExponentialChartData();

  // Calcular el crecimiento promedio (para mostrar en el indicador)
  const calculateAverageGrowth = () => {
    if (!exponentialChartData.growthRates || exponentialChartData.growthRates.length === 0) {
      return "0.0";
    }
    
    const validRates = exponentialChartData.growthRates.filter(rate => parseFloat(rate) > 0);
    if (validRates.length === 0) return "0.0";
    
    const sum = validRates.reduce((acc, rate) => acc + parseFloat(rate), 0);
    return (sum / validRates.length).toFixed(1);
  };

  // [
  //   { id: '1', date: '12 Mar 2023', description: 'Transferencia WAN', amount: '$1,240.50', status: 'Completado' },
  //   { id: '2', date: '10 Mar 2023', description: 'Optimización LAN', amount: '$890.00', status: 'Pendiente' },
  //   { id: '3', date: '08 Mar 2023', description: 'Configuración SSL', amount: '$450.75', status: 'Completado' },
  //   { id: '4', date: '05 Mar 2023', description: 'Actualización Ratio', amount: '$320.25', status: 'Completado' },
  // ];

  // Carga los datos al iniciar el componente
  useEffect(() => {
    handleGetInfo();
  }, []);

    // no mostrar el header de la pantalla de login
    useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, [navigation]);
  return (
    <ProtectedRoute>
      <MainLayout>
        <SafeAreaView style={[styles.container, tw`py-12`]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {chartData?.chart_data && (
              <View style={styles.tabsContainer}>
                {chartData.chart_data.map((dept, index) => (
                  <TouchableOpacity 
                    key={dept.name}
                    style={[
                      styles.tab, 
                      selectedDepartment === index ? styles.selectedTab : null
                    ]}
                    onPress={() => setSelectedDepartment(index)}
                  >
                    <Text style={[
                      styles.tabText,
                      selectedDepartment === index ? styles.selectedTabText : null
                    ]}>
                      {dept.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.content}>
              {/* Report Card */}
              <View style={styles.reportCard}>
                <Text style={styles.cardTitle}>Reports</Text>

                {chartData?.chart_data && chartData.chart_data.length > 0 ? (
                  <View>
                    {/* Información total - siempre visible */}
                    <View style={tw `w-full flex `}>
                      <View style={styles.totalInfoGrid}>
                        <View style={styles.totalInfoItem}>
                          <View style={[styles.dot, { backgroundColor: '#6366f1' }]} />
                          <Text style={styles.sslText}>Total Amount: ${chartData.total_budget_amount?.toLocaleString() || '0.00'}</Text>
                        </View>
                      </View>
                    </View>
                    
                    {/* Separador */}
                    <View style={styles.separator} />
                    
                    {/* Información del departamento seleccionado */}
                    <View style={styles.reportContent}>
                      <View style={tw`flex`}>
                        <Text style={styles.departmentTitle}>
                          {chartData.chart_data[selectedDepartment].name}
                        </Text>
                        
                        {chartData.chart_data[selectedDepartment].total_budgets > 0 && (
                          <View style={styles.sslItem}>
                            <View style={[styles.dot, { backgroundColor: '#22c55e' }]} />
                            <Text style={styles.sslText}>
                              Total Budgets: {chartData.chart_data[selectedDepartment].total_budgets}
                            </Text>
                          </View>
                        )}
                        
                        {chartData.chart_data[selectedDepartment].total_inactive_budgets > 0 && (
                          <View style={styles.sslItem}>
                            <View style={[styles.dot, { backgroundColor: '#eab308' }]} />
                            <Text style={styles.sslText}>
                              Inactive Budgets: {chartData.chart_data[selectedDepartment].total_inactive_budgets}
                            </Text>
                          </View>
                        )}
                        
                        <View style={styles.sslItem}>
                          <View style={[styles.dot, { backgroundColor: '#ec4899' }]} />
                          <Text style={styles.sslText}>
                            Budget Amount: ${chartData.chart_data[selectedDepartment].total_budget_amount}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.progressContainer}>
                        {(() => {
                          try {
                            // Obtener valores de forma segura
                            const deptAmount = chartData.chart_data[selectedDepartment]?.total_budget_amount || "0";
                            const totalAmount = chartData.total_budget_amount || 1;
                            
                            // Convertir string a número
                            let amount = deptAmount;
                            if (typeof deptAmount === 'string') {
                              amount = parseFloat(deptAmount.replace(/,/g, ''));
                            }
                            
                            // Calcular porcentaje de forma segura
                            const percentage = isNaN(amount) || totalAmount === 0 ? 0 : (amount / totalAmount) * 100;
                            
                            // Asegurarse de que el valor para ProgressChart esté entre 0 y 1
                            const progressValue = Math.min(Math.max(percentage / 100, 0), 1);
                            
                            return (
                              <>
                                <ProgressChart
                                  data={{ data: [progressValue] }}
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
                                  <Text style={styles.progressText}>{percentage.toFixed(1)}%</Text>
                                  <Text style={styles.progressSubtext}>of total</Text>
                                </View>
                              </>
                            );
                          } catch (error) {
                            console.error("Error rendering chart:", error);
                            // Fallback en caso de error
                            return (
                              <>
                                <ProgressChart
                                  data={{ data: [0] }}
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
                                  <Text style={styles.progressText}>0.0%</Text>
                                  <Text style={styles.progressSubtext}>of total</Text>
                                </View>
                              </>
                            );
                          }
                        })()}
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.reportContent}>
                    <View style={styles.sslItems}>
                      <Text style={styles.loadingText}>Cargando datos...</Text>
                    </View>
                  </View>
                )}
              </View>
              {/* Optimized Cards Row */}
              <View style={styles.row}>
                {/* Optimized Mbps: Wan Tx */}
                <View style={[styles.card, { width: cardWidth }]}>
                  <Text style={styles.cardTitle}>Emergency Fund</Text>
                  <View style={styles.mbpsContainer}>
                    <Text style={styles.mbpsText}>Current: </Text>
                    <Text style={styles.wanText}>${financialData?.emergency_fund?.toLocaleString() || '0'}</Text>
                  </View>
                  
                  <LineChart
                    data={emergencyFundChart}
                    width={cardWidth - 20}
                    height={100}
                    chartConfig={{
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 1) =>`rgba(34, 197, 94, ${opacity})`,
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
                      <Text style={styles.legendText}>Historical</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                      <Text style={styles.legendText}>Projected</Text>
                    </View>
                  </View>
                </View>
                
                {/* Optimized Mbps: Wan Rx */}
                <View style={[styles.card, { width: cardWidth }]}>
                  <Text style={styles.cardTitle}>Expenses</Text>
                  <View style={styles.mbpsContainer}>
                    <Text style={styles.mbpsText}>Current: </Text>
                    <Text style={styles.wanText}>${financialData?.total_expenses?.toLocaleString() || '0'}</Text>
                  </View>
                  
                  <LineChart
                    data={expensesChart}
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
                      <Text style={styles.legendText}>Historical</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                      <Text style={styles.legendText}>Target</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Ratio and Create Cards Row */}
              <View style={[styles.card, tw`w-full`]}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Exponenciales</Text>
                    
                   {/* Selector de año */}
                   <View style={tw`mt-4`}>
                        {transactionsData && transactionsData.available_years && Array.isArray(transactionsData.available_years) && (
                          <RNPickerSelect
                            onValueChange={(value) => setSelectedYear(value)}
                            items={transactionsData.available_years.map((year) => ({
                              label: year.toString(),
                              value: year,
                            }))}
                            value={selectedYear}
                            style={tw`bg-gray-200 px-4 py-2 rounded-full text-gray-700 text-sm`}
                            placeholder={{
                              label: 'Select a year...',
                              value: null,
                              color: '#9CA3AF',
                            }}
                          />
                        )}
                      </View>
                  </View>
                  
                  <View style={styles.areaChartContainer}>
                  <LineChart
                        data={exponentialChartData}
                        width={width - 60}
                        height={220}
                        yAxisLabel="$"
                        yAxisSuffix=""
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
                            r: '4',
                            strokeWidth: '2',
                            stroke: '#22c55e'
                          }
                        }}
                        bezier
                        style={styles.chart}
                      />
                    
                    <View style={styles.ratioValueContainer}>
                      <View style={styles.ratioValue}>
                        <Text style={styles.ratioValueText}>{calculateAverageGrowth()}%</Text>
                      </View>
                    </View>
                  </View>
                  
                </View>
              
              {/* Transactions Table */}
              <View style={tw`bg-white rounded-lg p-4 mb-8`}>
                <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Last Transactions</Text>

                {/* Encabezado de la tabla */}
                <View style={tw`flex-row border-b border-gray-200 pb-2`}>
                  <Text style={tw`flex-1 font-bold text-gray-600`}>Type</Text>
                  <Text style={tw`flex-2 font-bold text-gray-600`}>Description</Text>
                  <Text style={tw`flex-1 font-bold text-gray-600 text-right`}>Amount</Text>
                </View>

                {/* Filas de la tabla con paginación */}
                {transactionList && transactionList.length > 0 ? (
                  transactionList
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((transaction) => (
                      <View key={transaction.id} style={tw`flex-row py-2 border-b border-gray-100`}>
                        <Text
                          style={tw.style(
                            `flex-1 text-sm font-medium`,
                            transaction.type === 'income' && `text-green-500`,
                            transaction.type === 'transfer' && `text-blue-500`,
                            transaction.type === 'expense' && `text-red-500`
                          )}
                        >
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </Text>
                        <Text style={tw`flex-2 text-sm text-gray-700`}>{transaction.description}</Text>
                        <Text style={tw`flex-1 text-sm text-gray-800 text-right`}>
                          ${parseFloat(transaction.amount).toLocaleString()}
                        </Text>
                      </View>
                    ))
                ) : (
                  <View style={tw`py-4`}>
                    <Text style={tw`text-center text-gray-500 italic`}>No transactions available</Text>
                  </View>
                )}

                {/* Paginación */}
                <View style={tw`flex-row justify-between items-center mt-4`}>
                  <TouchableOpacity
                    style={tw.style(
                      `px-4 py-2 rounded-lg`,
                      currentPage === 1 ? `bg-gray-200` : `bg-green-500`
                    )}
                    onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <Text style={tw`text-white font-bold`}>
                      <Feather name="arrow-left" size={16} color="white" />
                    </Text>
                  </TouchableOpacity>
                  <Text style={tw`text-sm text-gray-600`}>
                    Page {currentPage} of {Math.ceil(transactionList.length / itemsPerPage)}
                  </Text>
                  <TouchableOpacity
                    style={tw.style(
                      `px-4 py-2 rounded-lg`,
                      currentPage === Math.ceil(transactionList.length / itemsPerPage) ? `bg-gray-200` : `bg-green-500`
                    )}
                    onPress={() =>
                      currentPage < Math.ceil(transactionList.length / itemsPerPage) &&
                      setCurrentPage(currentPage + 1)
                    }
                    disabled={currentPage === Math.ceil(transactionList.length / itemsPerPage)}
                  >
                    <Text style={tw`text-white font-bold`}>
                      <Feather name="arrow-right" size={16} color="white" />
                    </Text>
                  </TouchableOpacity>
                </View>
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
  // Agrega estos estilos a tu StyleSheet
tabsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  paddingHorizontal: 15,
  backgroundColor: '#ffffff',
  borderRadius: 16,
  marginRight: 15,
  marginLeft: 15,
},
tab: {
  paddingVertical: 8,
  paddingHorizontal: 12,
  marginRight: 8,
  marginTop: 8,
  marginBottom: 8,
  borderRadius: 16,
  backgroundColor: '#f1f5f9',
},
selectedTab: {
  backgroundColor: '#22c55e',
},
tabText: {
  color: '#1e293b',
  fontWeight: '500',
},
selectedTabText: {
  color: '#ffffff',
},
departmentTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: 12,
},
progressSubtext: {
  fontSize: 12,
  color: '#64748b',
},
otalInfoContainer: {
  marginBottom: 15,
},
totalInfoTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: 10,
},
totalInfoGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
},
totalInfoItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
  width: '50%',
},
separator: {
  height: 1,
  backgroundColor: '#e2e8f0',
  marginVertical: 15,
},
loadingText: {
  fontSize: 14,
  color: '#64748b',
  fontStyle: 'italic',
},
});

export default DashboardScreen;