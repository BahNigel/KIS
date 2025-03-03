import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from '@/constants/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function Styles() {
  const theme = useContext(ThemeContext);

  const getStyles = (theme) => StyleSheet.create({
    
    container: {
      flex: 1,
      zIndex: 9999,
      flexDirection: 'row',
      backgroundColor: 'transparent'
    },
    overlay: {
      backgroundColor: 'red',
      zIndex: -1,
    },
    sectionBase: {
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    swipeableView: {
      width: 200,
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    section: {
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme?.isDarkMode ? Colors.dark.background : Colors.light.background,
      borderRadius: 10,
    },
    groupSection: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cornerContainer: {
      position: 'absolute',
      bottom: 20, // Adjust as needed
      right: 20, // Adjust as needed
      width: 200, // Adjust as needed
      height: 200, // Adjust as needed
      backgroundColor: 'rgba(0,0,0,0.5)', // Optional: To create a background for the modal
      zIndex: 9999, // Ensure it's above other content
    },
    sectionContainer: {
      width: 10,
      marginRight: 5,
      padding: 5,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      backgroundColor: theme?.isDarkMode ? Colors.dark.background : Colors.light.background,
    },
    sectionContainer1: {
      padding: 5,
      backgroundColor: theme?.isDarkMode? Colors.dark.background : Colors.light.background,
    },
    logoImage: {
      width: 40,
      height: 40,
      borderRadius: 25,
    },
    channelName: {
      color: theme?.isDarkMode? 'white':'#36393f',
      fontWeight: 'bold',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    titleText: {
      color: theme?.isDarkMode? 'white':'#36393f', 
      fontSize: 18,
    },
    dropDownbotton: {
      color: theme?.isDarkMode? 'white':'#36393f', 
    },
    channelItem: {
      padding: 5,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      backgroundColor:  'royalblue',
    },
    channelItem1: {
      padding: 5,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      backgroundColor: '#BFBFBF',
    },
    subChannelItem: {
      marginTop: 18,
    },
    groupChannelItem: {
      marginTop: 10,
      padding: 10,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    subChannelItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 199,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      width: '65%',
      backgroundColor: '#36393f',
    },
    searchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: 20,
    },
    spliter: {
      height: 0.3,
      width: '100%',
      backgroundColor: theme?.isDarkMode? 'white':'#36393f',
    },
    searchInput: {
      flex: 1,
      paddingLeft: 10,
      paddingTop: 2,
      height: 34,
      width: '80%',
    },
    searchButton: {
      backgroundColor: '#36393f',
      borderTopRightRadius: 30,
      borderBottomRightRadius: 30,
      padding: 3,
      marginLeft: -5,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: '#fff'
    },
    button: {
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#3498db',
      padding: 5,
      borderRadius: 15,
    },
    buttonText: {
      color: '#fff',
      marginLeft: 5,
    },
    searchInputbutton: {
      color: '#fff',
      marginLeft: 5,
      backgroundColor: '#3498db',
      padding: 5,
      borderRadius: 15,
      marginTop: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 25,
    },
  
    newChannelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'royalblue',
      padding: 10,
      borderRadius: 15,
    },
    headerContainer: {
      flexDirection: 'row',
      position: 'relative',
    },
    iconContainer: {
      position: 'relative',
    },
    iconContainer1: {
      position: 'absolute',
      left: 6,
      top: 6,
    },
    modal: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      maxWidth: 400,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    modalHeaderText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    closeButton: {
      padding: 10,
    },
  });

  const styles = getStyles(theme);

  return styles;
}
