import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import service from '../../services/api';

import logoImg from '../../assets/logo.png';
import styles from './styles';

export default function Incidents() {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [incidents, setIncidents] = useState([]);
  
  const navigation = useNavigation();

  function navigateToDatail(incident) {
    navigation.navigate('Detail', { incident });
  }

  async function loadIncidents() {
    if (loading) {
      return;
    }

    if (total > 0 && incidents.length === total) {

    }

    setLoading(true);

    const res = await service.get(`incidents?page=${page}`)

    setTotal(res.headers['x-total-count']);
    setIncidents([... incidents, ... res.data]);
    setPage(page + 1);
    setLoading(false);
  }

  useEffect(() => {
    loadIncidents();
  }, [])

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
        </Text>
      </View>

      <Text style={styles.title}>Bem vindo!</Text>
      <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

      <FlatList style={styles.incidentList}
        data={incidents}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
        keyExtractor={incident => String(incident.id)}
        renderItem={({item: incident}) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</Text>

            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => navigateToDatail(incident)}
            >
              <Text style={styles.detailButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#E02041" />
            </TouchableOpacity>
          </View>
        )}
      />

    </View>
  );
}