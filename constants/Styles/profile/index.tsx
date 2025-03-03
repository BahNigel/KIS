import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemeContext } from '@/constants/ThemeContext';

export default function Styles() {
  const theme = useContext(ThemeContext);

  const getStyles = (theme: any) => StyleSheet.create({
    
    container: {
        flex: 1,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme?.isDarkMode? 'white':'#36393f',
      },
      smalltitle: {
        color:'gray',
      },
      separator: {
        height: 1,
        width: '100%',
        backgroundColor: theme?.isDarkMode? 'white':'#36393f',
      },
      userImageContainer: {
        height: 155,
        borderBottomWidth: 1,
        backgroundColor: theme?.isDarkMode ? Colors.dark.background : Colors.light.background,
        width: "100%",
        justifyContent: 'center',
        zIndex: 5,
      },
      profilePicContain: {
        backgroundColor: "green",
        borderRadius: 50,
        width: 80,
        height: 80,
        top: -35,
        zIndex: 5,
        marginLeft: 10,
        borderWidth: 5,
        borderColor: "black",
      },
      topbar: {
        height: 100,
        width: "100%",
        backgroundColor: theme?.isDarkMode? Colors.dark.background : Colors.light.background,
      },
      profileTextContain: {
        width: 250,
        marginLeft: 10,
        height: 40,
        marginTop: -5,
        backgroundColor: theme?.isDarkMode ? Colors.dark.background : Colors.light.background,
      },
      picTextContainer: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: theme?.isDarkMode ? Colors.dark.background : Colors.light.background,
      },
      profileNameContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        backgroundColor: theme?.isDarkMode ? Colors.dark.background : Colors.light.background,
      },
      smallText: {
        backgroundColor: theme?.isDarkMode ? Colors.dark.background : Colors.light.background,
        color: theme?.isDarkMode? 'white':'#36393f',
      },
      modalContent: {
        marginTop: 10,
      },
      settingItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      iconContainer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      settingTextContainer: {
        flexDirection: 'column',
      }, 
      mainSettingItemText: {
        fontSize: 17,
        color: theme?.isDarkMode? 'white':'#36393f',
      },
      subSettingItemText: {
        fontSize: 12,
        color: theme?.isDarkMode? 'white':'#36393f',
      },
      analysisSection: {
        padding: 10,
        position: 'relative',
      },
      scrollContainer: {
        flexDirection: 'row',  // Aligns items horizontally inside the ScrollView
        alignItems: 'center',  // Centers items vertically
      },
      analysisBox: {
        marginHorizontal: 10,  // Adds spacing between items
        padding: 15,
        backgroundColor: 'white',  // You can change the background color if needed
        borderRadius: 10,
        alignItems: 'center',  // Centers content inside each box
        paddingHorizontal: 60,
      },
      analysisText: {
        fontSize: 14,
        fontWeight: 'bold',
      },
      analysisValue: {
        fontSize: 16,
        color: 'black',
      },
      arrowContainer: {
        position: 'absolute',
        top: '25%',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      },
  });

  const styles = getStyles(theme);

  return styles;
}
