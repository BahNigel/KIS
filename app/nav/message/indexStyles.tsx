import { Colors } from '@/constants/Colors';
import { StyleSheet, useWindowDimensions } from 'react-native';

// Functional component to handle the dynamic styles
const useDynamicStyles = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Determine the color scheme dynamically
  const scheme = 'light'; // Fallback value for scheme
  const currentColors = Colors[scheme ?? 'light'];

  return StyleSheet.create({
    header: {
      paddingHorizontal: 15,
      paddingBottom: 10,
    },
    upperHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 10,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    iconsContainer: {
      flexDirection: 'row',
      gap: 15,
    },
    iconButton: {
      padding: 8,
    },
    lowerHeader: {
      marginTop: 10,
      paddingHorizontal: 10,
    },
    searchInput: {
      height: 40,
      borderRadius: 25,
      paddingLeft: 15,
      fontSize: 16,
      backgroundColor: currentColors.inputBackground, // Added dynamic color for input
      color: currentColors.textPrimary, // Set input text color based on scheme
    },
    naveContainer: {
      flex: 1,
      paddingHorizontal: 5,
    },
    tabLabelContainer: {
      borderRadius: 10,
      padding: 10,
      width: 70,
    },
    tabLabelText: {
      fontWeight: 'bold',
    },
    notificationBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: 'red',
      borderRadius: 10,
      paddingVertical: 2,
      paddingHorizontal: 6,
    },
    notificationText: {
      color: 'white',
      fontSize: 12,
    },
    tabBarLabelStyle: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    tabBarIndicatorStyle: {
      display: 'none',
    },
    tabBarStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: 'transparent',
      display: isTablet? 'none' : 'flex',
    },
    tabBarItemStyle: {
      paddingVertical: 10,
    },
    selectedHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    arrowContainer: {
      marginRight: 10,
    },
    selectedText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    iconGroup: {
      flexDirection: 'row',
      gap: 10,
    },
  });
};

export default useDynamicStyles;
