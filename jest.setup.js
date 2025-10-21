/* eslint-disable no-undef */
import '@testing-library/jest-native/extend-expect';

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock react-native-encrypted-storage
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock @react-navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
  }),
  NavigationContainer: ({ children }) => children,
}));

// Mock redux-persist
jest.mock('redux-persist', () => ({
  persistStore: jest.fn(),
  persistReducer: jest.fn((config, reducer) => reducer),
}));

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }) => children,
}));