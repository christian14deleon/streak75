import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TodayScreen from '../screens/main/TodayScreen';
import FriendsStubScreen from '../screens/main/FriendsStubScreen';
import ProfileStubScreen from '../screens/main/ProfileStubScreen';
import CalendarModal from '../screens/main/CalendarModal';
import TaskEditorScreen from '../screens/TaskEditorScreen';
import { colors, sizes, spacing } from '../theme';
import { fonts } from '../theme/typography';
import type { MainStackParamList, MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Ionicons name per tab (filled when focused, outline otherwise).
function tabIcon(routeName: keyof MainTabsParamList, focused: boolean): keyof typeof Ionicons.glyphMap {
  switch (routeName) {
    case 'Today':
      return focused ? 'today' : 'today-outline';
    case 'Friends':
      return focused ? 'people' : 'people-outline';
    case 'Profile':
    default:
      return focused ? 'person' : 'person-outline';
  }
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: sizes.tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.sm,
          paddingTop: spacing.sm,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 11,
        },
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={tabIcon(route.name, focused)} size={22} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Friends" component={FriendsStubScreen} />
      <Tab.Screen name="Profile" component={ProfileStubScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator<MainStackParamList>();

// The main app: a bottom-tab navigator wrapped in a native stack so the task
// editor and the calendar can be presented modally from anywhere (e.g. the
// Today header). The editor is the SAME screen used in onboarding; here it is
// given fromMain:true so its "Validate"/back simply dismisses the modal.
export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen
        name="TaskEditor"
        component={TaskEditorScreen}
        initialParams={{ fromMain: true }}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarModal}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}

export default MainNavigator;
