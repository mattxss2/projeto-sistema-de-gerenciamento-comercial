import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'; // Adaptado para mobile
import { AlertTriangle, Lightbulb } from 'lucide-react-native'; 
import api from '../../lib/api'; // Sua configuração base do Axios/Fetch

export default function DashboardInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarInsights() {
      try {
        const response = await api.get('/analytics/insights-ia');
        setInsights(response.data);
      } catch (error) {
        console.error("Erro ao buscar análises da IA:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarInsights();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007ACC" />
        <Text style={styles.loadingText}>IA processando histórico de estoque e vendas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Assistente de Insights IA</Text>

      {/* Seção 1: Previsão de Demanda */}
      <View style={styles.block}>
        <Text style={styles.subTitle}>📉 Previsão de Demanda (Estoque)</Text>
        {insights?.previsaoDemanda?.map((item, index) => (
          <View key={index} style={[styles.cardAlert, styles.borderAlerta]}>
            <AlertTriangle color="#D97706" size={20} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.productName}>{item.produto}</Text>
              <Text style={styles.description}>{item.alerta}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Seção 2: Análise de Comportamento de Clientes */}
      <View style={styles.block}>
        <Text style={styles.subTitle}>💡 Sugestões e Comportamento de Clientes</Text>
        {insights?.comportamentoClientes?.map((item, index) => (
          <View key={index} style={[styles.cardAlert, styles.borderSugestao]}>
            <Lightbulb color="#2563EB" size={20} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.patternText}>Padrão: {item.padrao}</Text>
              <Text style={styles.description}>💡 {item.sugestao}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadingText: { marginTop: 12, color: '#666', textAlign: 'center' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#111' },
  subTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#444' },
  block: { marginBottom: 24 },
  cardAlert: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginBottom: 10,
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  borderAlerta: { borderLeftWidth: 4, borderLeftColor: '#D97706' },
  borderSugestao: { borderLeftWidth: 4, borderLeftColor: '#2563EB' },
  icon: { marginRight: 12, marginTop: 2 },
  textContainer: { flex: 1 },
  productName: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  patternText: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  description: { fontSize: 14, color: '#4b5563', marginTop: 4, lineHeight: 20 },
});