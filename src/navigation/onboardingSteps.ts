import type { ComponentType } from 'react';
import type { OnboardingStackParamList } from './types';

import WelcomeScreen from '../screens/WelcomeScreen';
import ThatGirlScreen from '../screens/ThatGirlScreen';
import NameScreen from '../screens/NameScreen';
import WhyChallengeScreen from '../screens/WhyChallengeScreen';
import BiggestChallengeScreen from '../screens/BiggestChallengeScreen';
import IdealDayScreen from '../screens/IdealDayScreen';
import HowHeardScreen from '../screens/HowHeardScreen';
import FriendsTasksScreen from '../screens/FriendsTasksScreen';
import DailyTodoScreen from '../screens/DailyTodoScreen';
import PartnerStatScreen from '../screens/PartnerStatScreen';
import MatchingScreen from '../screens/MatchingScreen';
import InviteScreen from '../screens/InviteScreen';
import SelectChallengeScreen from '../screens/SelectChallengeScreen';
import FindingChallengeScreen from '../screens/FindingChallengeScreen';
import TaskEditorScreen from '../screens/TaskEditorScreen';
import ChallengeLengthScreen from '../screens/ChallengeLengthScreen';
import WhenStartScreen from '../screens/WhenStartScreen';
import SignInScreen from '../screens/SignInScreen';
import PaywallScreen from '../screens/PaywallScreen';
import LikeAppScreen from '../screens/LikeAppScreen';
import CongratsScreen from '../screens/CongratsScreen';
import MakeItOfficialScreen from '../screens/MakeItOfficialScreen';

export interface OnboardingStep {
  name: keyof OnboardingStackParamList;
  component: ComponentType<any>;
  // Whether this step shows the header back button.
  showBack: boolean;
  // Whether this step shows the progress pill (questionnaire steps only).
  showProgress: boolean;
  // Card (default) or modal presentation.
  presentation?: 'card' | 'modal';
  // Disable the swipe-back gesture (used on loaders + the invite modal so the
  // user can't swipe back onto a loader that would auto-advance again).
  gestureEnabled?: boolean;
}

// THE single ordered source of truth for the onboarding flow. The navigator
// maps over this to register screens; useOnboardingNav reads it to compute the
// next step and the progress fraction. Reordering THIS array reorders the whole
// flow and recomputes progress — there is no other place that encodes order.
//
// Progress pill shows on the 8 questionnaire steps (Name → PartnerStat).
export const ONBOARDING_STEPS: OnboardingStep[] = [
  { name: 'Welcome', component: WelcomeScreen, showBack: false, showProgress: false },
  { name: 'ThatGirl', component: ThatGirlScreen, showBack: true, showProgress: false },
  { name: 'Name', component: NameScreen, showBack: true, showProgress: true },
  { name: 'WhyChallenge', component: WhyChallengeScreen, showBack: true, showProgress: true },
  { name: 'BiggestChallenge', component: BiggestChallengeScreen, showBack: true, showProgress: true },
  { name: 'IdealDay', component: IdealDayScreen, showBack: true, showProgress: true },
  { name: 'HowHeard', component: HowHeardScreen, showBack: true, showProgress: true },
  { name: 'FriendsTasks', component: FriendsTasksScreen, showBack: true, showProgress: true },
  { name: 'DailyTodo', component: DailyTodoScreen, showBack: true, showProgress: true },
  { name: 'PartnerStat', component: PartnerStatScreen, showBack: true, showProgress: true },
  { name: 'Matching', component: MatchingScreen, showBack: false, showProgress: false, gestureEnabled: false },
  {
    name: 'Invite',
    component: InviteScreen,
    showBack: false,
    showProgress: false,
    presentation: 'modal',
    gestureEnabled: false,
  },
  { name: 'SelectChallenge', component: SelectChallengeScreen, showBack: true, showProgress: false },
  {
    name: 'FindingChallenge',
    component: FindingChallengeScreen,
    showBack: false,
    showProgress: false,
    gestureEnabled: false,
  },
  { name: 'TaskEditor', component: TaskEditorScreen, showBack: true, showProgress: false },
  { name: 'ChallengeLength', component: ChallengeLengthScreen, showBack: true, showProgress: false },
  { name: 'WhenStart', component: WhenStartScreen, showBack: true, showProgress: false },
  { name: 'SignIn', component: SignInScreen, showBack: true, showProgress: false },
  { name: 'Paywall', component: PaywallScreen, showBack: false, showProgress: false },
  { name: 'LikeApp', component: LikeAppScreen, showBack: true, showProgress: false },
  { name: 'Congrats', component: CongratsScreen, showBack: true, showProgress: false },
  { name: 'MakeItOfficial', component: MakeItOfficialScreen, showBack: false, showProgress: false },
];

export default ONBOARDING_STEPS;
