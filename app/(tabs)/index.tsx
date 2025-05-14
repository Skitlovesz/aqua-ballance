'use client';

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, db } from '../../firebaseConfig';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  updateDoc,
  arrayUnion,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import React from 'react';

type HistoryItem = {
  id: number;
  amount: number;
  date: string;
  time: string;
  hidden?: boolean;
};

type Achievement = {
  id: string;
  title: string;
  completed: boolean;
  icon: string;
  description: string;
};

export default function HomeScreen() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000); // Default 2L
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [userName, setUserName] = useState('Usuário');
  const [isLoading, setIsLoading] = useState(true);
  const [lastResetTimestamp, setLastResetTimestamp] = useState<number>(0);
  const [congratsModalVisible, setCongratsModalVisible] = useState(false);
  const [goalCelebrated, setGoalCelebrated] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  // Load last reset timestamp
  const loadLastResetTimestamp = async () => {
    try {
      const userId = auth.currentUser?.uid || 'guest';
      const timestamp = await AsyncStorage.getItem(
        `lastResetTimestamp_${userId}`
      );
      if (timestamp) {
        setLastResetTimestamp(Number(timestamp));
      }
    } catch (error) {
      console.error('Erro ao carregar timestamp do último reinício:', error);
    }
  };

  useEffect(() => {
    loadLastResetTimestamp();

    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('Usuário não autenticado');
          setIsLoading(false);
          return;
        }

        // Carregar dados do Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || user.email?.split('@')[0] || 'Usuário');
          setDailyGoal(userData.waterIntake || 2000);
          setWaterIntake(userData.currentIntake || 0);

          // Carregar histórico
          const historyCollectionRef = collection(
            db,
            'users',
            user.uid,
            'history'
          );
          const historyDoc = await getDoc(
            doc(historyCollectionRef, new Date().toISOString().split('T')[0])
          );

          if (historyDoc.exists()) {
            const historyData = historyDoc.data();
            setHistory(historyData.items || []);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Atualizar meta diária quando receber nova meta da tela de perfil
  useEffect(() => {
    if (route.params?.waterIntake) {
      setDailyGoal(route.params.waterIntake);
      updateUserData({ waterIntake: route.params.waterIntake });
    }
  }, [route.params?.waterIntake]);

  const updateUserData = async (data: any) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const addWater = async (amount: number) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert(
          'Erro',
          'Você precisa estar logado para registrar seu consumo de água.'
        );
        return;
      }

      const newAmount = waterIntake + amount;
      setWaterIntake(newAmount);

      // Criar novo item no histórico
      const now = new Date();
      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        amount,
        date: now.toLocaleDateString('pt-BR'),
        time: now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      const updatedHistory = [...history, newHistoryItem];
      setHistory(updatedHistory);

      // Atualizar dados no Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const historyCollectionRef = collection(db, 'users', user.uid, 'history');
      const todayDoc = doc(
        historyCollectionRef,
        now.toISOString().split('T')[0]
      );

      await updateDoc(userDocRef, {
        currentIntake: newAmount,
        lastUpdated: serverTimestamp(),
      });

      await setDoc(
        todayDoc,
        {
          items: arrayUnion(newHistoryItem),
          totalIntake: increment(amount),
          date: now.toISOString().split('T')[0],
        },
        { merge: true }
      );

      // Verificar conquistas
      if (newAmount >= dailyGoal && !goalCelebrated) {
        await checkAndUpdateAchievements(user.uid);
        setCongratsModalVisible(true);
        setGoalCelebrated(true);
      }
    } catch (error) {
      console.error('Erro ao adicionar água:', error);
      Alert.alert('Erro', 'Não foi possível registrar seu consumo de água.');
    }
  };

  const checkAndUpdateAchievements = async (userId: string) => {
    try {
      const achievementsRef = collection(db, 'users', userId, 'achievements');
      const dailyGoalAchievement = doc(achievementsRef, 'daily_goal');
      const achievementDoc = await getDoc(dailyGoalAchievement);

      if (!achievementDoc.exists() || !achievementDoc.data()?.completed) {
        await setDoc(
          dailyGoalAchievement,
          {
            id: 'daily_goal',
            title: 'Meta Diária Alcançada',
            completed: true,
            completedAt: serverTimestamp(),
            icon: 'trophy',
            description:
              'Parabéns! Você atingiu sua meta diária de consumo de água!',
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error('Erro ao verificar conquistas:', error);
    }
  };

  const deleteHistoryItem = async (itemId: number) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const updatedHistory = history.map((item) =>
        item.id === itemId ? { ...item, hidden: true } : item
      );
      setHistory(updatedHistory);

      const visibleItems = updatedHistory.filter((item) => !item.hidden);
      const newTotal = visibleItems.reduce((sum, item) => sum + item.amount, 0);
      setWaterIntake(newTotal);

      // Atualizar no Firestore
      const historyCollectionRef = collection(db, 'users', user.uid, 'history');
      const todayDoc = doc(
        historyCollectionRef,
        new Date().toISOString().split('T')[0]
      );

      await setDoc(
        todayDoc,
        {
          items: updatedHistory,
          totalIntake: newTotal,
        },
        { merge: true }
      );

      await updateDoc(doc(db, 'users', user.uid), {
        currentIntake: newTotal,
      });
    } catch (error) {
      console.error('Erro ao deletar item do histórico:', error);
      Alert.alert('Erro', 'Não foi possível deletar o registro.');
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    if (item.hidden) return null;

    return (
      <View style={styles.historyItem}>
        <View style={styles.historyItemInfo}>
          <Text style={styles.historyItemAmount}>{item.amount}ml</Text>
          <Text style={styles.historyItemTime}>
            {item.date} às {item.time}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert('Confirmar', 'Deseja remover este registro?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Confirmar', onPress: () => deleteHistoryItem(item.id) },
            ]);
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleCustomAmount = () => {
    const amount = Number.parseInt(customAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erro', 'Por favor, insira uma quantidade válida.');
      return;
    }
    addWater(amount);
    setCustomAmount('');
    setShowAddModal(false);
  };

  const resetWaterConsumed = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Zerar o total de água consumida
      setWaterIntake(0);
      setGoalCelebrated(false);

      // Atualizar no Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        currentIntake: 0,
        lastUpdated: serverTimestamp(),
      });

      console.log('Contador de água consumida zerado');
    } catch (error) {
      console.error('Erro ao resetar contador:', error);
      Alert.alert('Erro', 'Não foi possível resetar o contador.');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-Vindo,</Text>
        <Text style={styles.headerTitle}>{userName}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.waterCard}>
          <View style={styles.waterInfoContainer}>
            <View>
              <Text style={styles.waterAmount}>
                {(waterIntake / 1000).toFixed(2)} Litros
              </Text>
              <Text style={styles.waterLabel}>Consumidos Hoje</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetWaterConsumed}
              >
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.resetButtonText}>Reiniciar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color="white"
                  style={styles.addIcon}
                />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.waveContainer}>
            <View style={styles.wave1} />
            <View style={styles.wave2} />
            <View style={styles.wave3} />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((waterIntake / dailyGoal) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.goalContainer}>
              <Text style={styles.goalText}>
                {(dailyGoal / 1000).toFixed(2)} Litros
              </Text>
              <Text style={styles.goalLabel}>Minha Meta</Text>
            </View>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="settings-outline" size={24} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Histórico</Text>
            <TouchableOpacity onPress={() => setShowHistoryModal(true)}>
              <Text style={styles.viewAllText}>Ver Tudo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          {history.filter((item) => !item.hidden).length > 0 ? (
            history
              .filter((item) => !item.hidden)
              .slice(-3)
              .reverse()
              .map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyItemLeft}>
                    <View style={styles.bottleIconContainer}>
                      <Ionicons name="water" size={24} color="#2196F3" />
                    </View>
                    <Text style={styles.historyAmount}>{item.amount} ml</Text>
                  </View>

                  <View style={styles.historyItemCenter}>
                    <View>
                      <Text style={styles.historyLabel}>Data:</Text>
                      <Text style={styles.historyValue}>{item.date}</Text>
                    </View>
                    <View>
                      <Text style={styles.historyLabel}>Horário:</Text>
                      <Text style={styles.historyValue}>{item.time}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.waterActionButton}
                    onPress={() => {
                      Alert.alert(
                        'Confirmar',
                        'Deseja remover este registro?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          {
                            text: 'Confirmar',
                            onPress: () => deleteHistoryItem(item.id),
                          },
                        ]
                      );
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#2196F3" />
                  </TouchableOpacity>
                </View>
              ))
          ) : (
            <Text style={styles.noHistoryText}>Nenhum registro hoje</Text>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Consumo</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              placeholder="Digite a quantidade em ml"
              value={customAmount}
              onChangeText={setCustomAmount}
            />

            <View style={styles.quickAddButtons}>
              <TouchableOpacity
                style={styles.quickAddButton}
                onPress={() => {
                  setCustomAmount('200');
                }}
              >
                <Text style={styles.quickAddButtonText}>200ml</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAddButton}
                onPress={() => {
                  setCustomAmount('300');
                }}
              >
                <Text style={styles.quickAddButtonText}>300ml</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAddButton}
                onPress={() => {
                  setCustomAmount('500');
                }}
              >
                <Text style={styles.quickAddButtonText}>500ml</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleCustomAmount}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextPrimary,
                  ]}
                >
                  Adicionar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showHistoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.historyModalContent]}>
            <View style={styles.historyModalHeader}>
              <Text style={styles.modalTitle}>Histórico Completo</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={history.filter((item) => !item.hidden).reverse()}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.historyList}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de parabéns quando atingir a meta */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={congratsModalVisible}
        onRequestClose={() => setCongratsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.congratsModalView}>
            <View style={styles.congratsIconContainer}>
              <Ionicons name="trophy" size={50} color="#FFD700" />
            </View>
            <Text style={styles.congratsTitle}>Parabéns!</Text>
            <Text style={styles.congratsMessage}>Você concluiu sua META!</Text>
            <Text style={styles.congratsSubtitle}>
              {(dailyGoal / 1000).toFixed(2)} Litros de água consumidos
            </Text>
            <TouchableOpacity
              style={styles.congratsButton}
              onPress={() => setCongratsModalVisible(false)}
            >
              <Text style={styles.congratsButtonText}>Continuar</Text>
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: 'white',
    fontSize: 14,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  waterCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  waterInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF5252',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 3,
  },
  waterAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  waterLabel: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addIcon: {
    marginRight: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    height: 80,
  },
  wave1: {
    position: 'absolute',
    height: 80,
    width: '100%',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 100,
    bottom: -40,
    transform: [{ scaleX: 1.5 }],
  },
  wave2: {
    position: 'absolute',
    height: 70,
    width: '100%',
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
    borderRadius: 100,
    bottom: -30,
    transform: [{ scaleX: 1.3 }],
  },
  wave3: {
    position: 'absolute',
    height: 60,
    width: '100%',
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderRadius: 100,
    bottom: -20,
    transform: [{ scaleX: 1.1 }],
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  goalContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  goalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  goalLabel: {
    fontSize: 10,
    color: '#999',
  },
  infoButton: {
    marginLeft: 10,
  },
  historySection: {
    marginTop: 10,
    marginBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  viewAllText: {
    color: '#2196F3',
    fontSize: 14,
  },
  divider: {
    height: 2,
    backgroundColor: '#2196F3',
    marginBottom: 16,
  },
  historyList: {
    maxHeight: 400,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  historyItemLeft: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 60,
  },
  bottleIconContainer: {
    marginBottom: 5,
  },
  historyAmount: {
    fontSize: 12,
    color: '#666',
  },
  historyItemCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  historyLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  historyValue: {
    fontSize: 12,
    color: '#666',
  },
  waterActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyItemInfo: {
    flex: 1,
  },
  historyItemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyItemTime: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  noHistoryText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  historyModalContent: {
    height: '80%',
  },
  historyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAddButton: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  quickAddButtonText: {
    color: '#2196F3',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  modalButtonPrimary: {
    backgroundColor: '#2196F3',
  },
  modalButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
  },
  modalButtonTextPrimary: {
    color: 'white',
  },
  // Estilos para o modal de parabéns
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  congratsModalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  congratsIconContainer: {
    backgroundColor: '#E3F2FD',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  congratsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  congratsMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  congratsSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  congratsButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
  },
  congratsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
