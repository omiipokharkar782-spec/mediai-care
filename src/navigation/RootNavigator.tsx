import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/hooks';
import { AdminHomeScreen } from '../screens/AdminHomeScreen';
import { AiChatScreen } from '../screens/AiChatScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { DoctorHomeScreen } from '../screens/DoctorHomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { MedicalHistoryScreen } from '../screens/MedicalHistoryScreen';
import { NewPrescriptionScreen } from '../screens/NewPrescriptionScreen';
import { OcrScannerScreen } from '../screens/OcrScannerScreen';
import { PatientHomeScreen } from '../screens/PatientHomeScreen';
import { PatientRecordScreen } from '../screens/PatientRecordScreen';
import { PatientsScreen } from '../screens/PatientsScreen';
import { PrescriptionsScreen } from '../screens/PrescriptionsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { QrScanScreen } from '../screens/QrScanScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { FloatingTabBar } from './FloatingTabBar';
import type { AppStackParamList, AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tabs = createBottomTabNavigator();

function PatientTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...props} />}>
      <Tabs.Screen name="PatientHome" component={PatientHomeScreen} />
      <Tabs.Screen name="Reports" component={ReportsScreen} />
      <Tabs.Screen name="AiTools" component={AiChatScreen} />
      <Tabs.Screen name="Appointments" component={AppointmentsScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

function DoctorTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...props} />}>
      <Tabs.Screen name="DoctorHome" component={DoctorHomeScreen} />
      <Tabs.Screen name="Appointments" component={AppointmentsScreen} />
      <Tabs.Screen name="AiTools" component={AiChatScreen} />
      <Tabs.Screen name="Patients" component={PatientsScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...props} />}>
      <Tabs.Screen name="AdminHome" component={AdminHomeScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  const { status, role } = useAppSelector((s) => s.auth);
  const authenticated = status === 'authenticated';

  return (
    <NavigationContainer>
      {authenticated ? (
        <AppStack.Navigator
          screenOptions={{ headerShown: false, animation: 'slide_from_right', animationDuration: 350 }}
        >
          {role === 'doctor' ? (
            <AppStack.Screen name="DoctorTabs" component={DoctorTabs} />
          ) : role === 'admin' ? (
            <AppStack.Screen name="AdminTabs" component={AdminTabs} />
          ) : (
            <AppStack.Screen name="PatientTabs" component={PatientTabs} />
          )}
          <AppStack.Screen name="Prescriptions" component={PrescriptionsScreen} />
          <AppStack.Screen name="MedicalHistory" component={MedicalHistoryScreen} />
          <AppStack.Screen name="PatientRecord" component={PatientRecordScreen} />
          <AppStack.Screen name="NewPrescription" component={NewPrescriptionScreen} />
          <AppStack.Screen name="AiChat" component={AiChatScreen} />
          <AppStack.Group screenOptions={{ presentation: 'fullScreenModal', animation: 'fade_from_bottom' }}>
            <AppStack.Screen name="OcrScanner" component={OcrScannerScreen} />
            <AppStack.Screen name="QrScan" component={QrScanScreen} />
          </AppStack.Group>
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
          <AuthStack.Screen name="Splash" component={SplashScreen} />
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
