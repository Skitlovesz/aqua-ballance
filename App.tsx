import React, { useState, useRef } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native"

import ProfileScreen from "./app/(tabs)/profile"
import HomeScreen from "./app/(tabs)/index"
import AchievementsScreen from "./app/(tabs)/achievements"
import HistoryScreen from "./app/(tabs)/history"
import SettingsScreen from "./app/(tabs)/settings"

export type RootStackParamList = {
  Profile: undefined
  MainTabs: undefined
}

export type MainTabParamList = {
  Home: undefined
  Achievements: undefined
  History: undefined
  Settings: undefined
}

const Tab = createBottomTabNavigator<MainTabParamList>()
const Stack = createNativeStackNavigator<RootStackParamList>()

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap
  focused: boolean
  onPress: () => void
}

function TabBarIcon({ name, focused, onPress }: TabBarIconProps) {
  const animatedValue = useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: focused ? 1 : 0,
      friction: 4,
      useNativeDriver: true,
    }).start()
  }, [focused])

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50], 
  })

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  })

  return (
    <TouchableOpacity onPress={onPress} style={styles.iconButton}>
      {focused ? (
        <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
          <Ionicons name={name} size={24} color="#2196F3" />
        </Animated.View>
      ) : (
        <View style={styles.fixedIcon}>
          <Ionicons name={name} size={24} color="white" />
        </View>
      )}
    </TouchableOpacity>
  )
}

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs"

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const notchAnimation = useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(notchAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start()

    return () => {
      Animated.timing(notchAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }
  }, [state.index])

  const notchPosition = notchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["25%", `${25 * state.index}%`],
  })

  return (
    <View style={styles.tabBarWrapper}>
      <Animated.View
        style={[
          styles.notchContainer,
          {
            left: notchPosition,
          },
        ]}
      >
        <View style={styles.notch} />
      </Animated.View>

      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index

          let iconName: keyof typeof Ionicons.glyphMap = "home"
          if (route.name === "Home") {
            iconName = "home-outline"
          } else if (route.name === "Achievements") {
            iconName = "trophy-outline"
          } else if (route.name === "History") {
            iconName = "stats-chart-outline"
          } else if (route.name === "Settings") {
            iconName = "settings-outline"
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as keyof MainTabParamList)
            }
          }

          return (
            <View key={route.key} style={styles.tabItem}>
              <TabBarIcon name={iconName} focused={isFocused} onPress={onPress} />
            </View>
          )
        })}
      </View>
    </View>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "relative",
    height: 60,
    backgroundColor: "transparent",
  },
  notchContainer: {
    position: "absolute",
    width: "25%",
    alignItems: "center",
    zIndex: 1,
  },
  notch: {
    width: 50,
    height: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: "#f5f5f5",
    top: -1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#2196F3",
    height: 60,
    position: "relative",
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  fixedIcon: {
    position: "absolute",
    top: 23,
  },
})
