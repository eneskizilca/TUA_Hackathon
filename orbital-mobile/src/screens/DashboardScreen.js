import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import client from '../api/client';
import colors from '../theme/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function DashboardScreen({ navigation }) {
  const [cmeData, setCmeData] = useState([]);
  const [flareData, setFlareData] = useState([]);
  const [activeThreats, setActiveThreats] = useState([]);
  const [kpIndex, setKpIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertDispatched, setAlertDispatched] = useState(false);
  const [hasTriggeredKpAlert, setHasTriggeredKpAlert] = useState(false);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await client.get('/api/v1/space-weather/dashboard', config);
      const data = response.data;

      const kpVal = data?.current_conditions?.kp_index?.kp_value ?? null;
      setKpIndex(kpVal);

      const cmes = data?.forecasts?.cme_forecasts || [];
      setCmeData(cmes.slice(0, 5));

      const flares = data?.forecasts?.solar_flares || [];
      setFlareData(flares.slice(0, 3)); 

      const threats = data?.threats?.active_threats || [];
      setActiveThreats(threats);

    } catch (error) {
      console.error('API Fetch Error:', error.response?.data || error.message);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getKpColor = (kp) => {
    if (kp === null) return colors.secondaryText;
    if (kp < 5) return colors.primary; // neon cyan
    if (kp < 7) return colors.secondary; // neon yellow-green
    return colors.danger; // red
  };

  useEffect(() => {
    if (kpIndex !== null && kpIndex > 5 && !hasTriggeredKpAlert) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "🚨 HIGH SOLAR ACTIVITY DETECTED",
          body: `Kp-Index reached ${kpIndex}! High risk of geomagnetic storm.`,
          sound: true,
        },
        trigger: null,
      });
      setHasTriggeredKpAlert(true);
    }
  }, [kpIndex, hasTriggeredKpAlert]);

  const handleTestAlert = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ ORBITAL SENSE SOLAR ALERT",
        body: "INCOMING CME — Kp: 3.67 | Threat: 20% | Satellites at risk. Take immediate action.",
        sound: true,
      },
      trigger: null,
    });
  };

  const renderCmeItem = ({ item }) => (
    <View style={styles.cmeCard}>
      <Text style={styles.cmeDate}>{item.start_time || 'UNKNOWN DATE'}</Text>
      <View style={styles.badgeContainer}>
        <Text style={styles.cmeTypeBadge}>{item.speed_kmps ? `${item.speed_kmps} km/s` : 'Unknown Speed'}</Text>
      </View>
      <Text style={styles.cmeDesc}>ID: {item.activity_id}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>SYNCING SENSORS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER ROW */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>ORBITAL SENSE</Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>LIVE FEED</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* KP INDEX - Top Left Styling Layout Option */}
        <View style={[styles.kpContainer, { borderLeftColor: getKpColor(kpIndex) }]}>
          <Text style={styles.kpLabel}>CURRENT KP-INDEX</Text>
          <Text style={[styles.kpValue, { color: getKpColor(kpIndex) }]}>
            {kpIndex !== null ? kpIndex : '--'}
          </Text>
          <Text style={styles.kpStatus}>
            {kpIndex === null ? 'UNKNOWN' : kpIndex < 5 ? 'NORMAL' : kpIndex < 7 ? 'ELEVATED' : 'STORM CONDITION'}
          </Text>

          {activeThreats.length > 0 && (
            <View style={styles.threatContainer}>
              {activeThreats.map((threat, idx) => (
                <Text key={idx} style={styles.threatText}>⚠️ THREAT: {threat}</Text>
              ))}
            </View>
          )}

          {flareData.length > 0 && (
            <View style={styles.flareContainer}>
              <Text style={styles.flareTitle}>RECENT FLARES:</Text>
              {flareData.map((flare, idx) => (
                <Text key={idx} style={styles.flareText}>• {flare.class_type} at {flare.source_location}</Text>
              ))}
            </View>
          )}
        </View>
        
        <Text style={styles.sectionTitle}>RECENT CME EVENTS</Text>
        <FlatList
          data={cmeData}
          keyExtractor={(item, index) => item.activity_id || index.toString()}
          renderItem={renderCmeItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>NO RECENT CME EVENTS DETECTED</Text>
          }
        />
      </View>

      <TouchableOpacity 
        style={styles.invisibleTrigger}
        onPress={handleTestAlert}
        activeOpacity={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 50,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  loadingText: {
    color: colors.primary,
    fontFamily: colors.fontFamily,
    marginTop: 20,
    letterSpacing: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 212, 230, 0.3)',
    paddingBottom: 15,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontFamily: colors.fontFamily,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  liveBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: '#000000',
    fontFamily: colors.fontFamily,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  kpContainer: {
    alignItems: 'flex-start',
    marginHorizontal: 20,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: 'rgba(75, 212, 230, 0.05)',
    marginBottom: 20,
  },
  kpLabel: {
    color: colors.secondaryText,
    fontFamily: colors.fontFamily,
    fontSize: 12,
    marginBottom: 5,
    letterSpacing: 2,
  },
  kpValue: {
    fontSize: 80,
    fontFamily: colors.fontFamily,
    fontWeight: 'bold',
    includeFontPadding: false,
    lineHeight: 85,
  },
  kpStatus: {
    color: colors.secondaryText,
    fontFamily: colors.fontFamily,
    fontSize: 12,
    marginTop: 5,
    letterSpacing: 2,
  },
  threatContainer: {
    marginTop: 15,
  },
  threatText: {
    color: colors.danger,
    fontFamily: colors.fontFamily,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  flareContainer: {
    marginTop: 10,
  },
  flareTitle: {
    color: colors.secondary,
    fontFamily: colors.fontFamily,
    fontSize: 12,
    marginBottom: 4,
    letterSpacing: 1,
  },
  flareText: {
    color: colors.text,
    fontFamily: colors.fontFamily,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 2,
  },
  sectionTitle: {
    color: colors.primary,
    fontFamily: colors.fontFamily,
    fontSize: 14,
    marginLeft: 20,
    marginBottom: 10,
    letterSpacing: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cmeCard: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 16,
    marginBottom: 15,
  },
  cmeDate: {
    color: colors.secondaryText,
    fontFamily: colors.fontFamily,
    fontSize: 12,
    marginBottom: 8,
    letterSpacing: 1,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 10,
  },
  cmeTypeBadge: {
    color: '#000000',
    fontFamily: colors.fontFamily,
    fontWeight: 'bold',
    fontSize: 12,
  },
  cmeDesc: {
    color: colors.text,
    fontFamily: colors.fontFamily,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    color: colors.secondaryText,
    fontFamily: colors.fontFamily,
    textAlign: 'center',
    marginTop: 30,
    letterSpacing: 1,
  },
  invisibleTrigger: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'transparent',
    zIndex: 999,
  },
});
