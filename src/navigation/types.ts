import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ---- Onboarding stack ------------------------------------------------------
// One screen per step. Most steps take no params. The task editor accepts an
// optional `fromMain` flag because the SAME screen component is also mounted in
// the main stack (where "Validate" should pop back instead of advancing the
// onboarding flow).
export type OnboardingStackParamList = {
  Welcome: undefined;
  ThatGirl: undefined;
  Name: undefined;
  WhyChallenge: undefined;
  BiggestChallenge: undefined;
  IdealDay: undefined;
  HowHeard: undefined;
  FriendsTasks: undefined;
  DailyTodo: undefined;
  PartnerStat: undefined;
  Matching: undefined;
  Invite: undefined;
  SelectChallenge: undefined;
  FindingChallenge: undefined;
  TaskEditor: { fromMain?: boolean } | undefined;
  ChallengeLength: undefined;
  WhenStart: undefined;
  SignIn: undefined;
  Paywall: undefined;
  LikeApp: undefined;
  Congrats: undefined;
  MakeItOfficial: undefined;
};

// ---- Main app --------------------------------------------------------------
export type MainTabsParamList = {
  Today: undefined;
  Friends: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  TaskEditor: { fromMain?: boolean } | undefined;
  Calendar: undefined;
};

// ---- Root ------------------------------------------------------------------
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

// ---- Convenience screen-prop helpers --------------------------------------
export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabsParamList, T>,
    NativeStackScreenProps<MainStackParamList>
  >;
