import { Colors } from '@/constants/Colors';
import { Dimensions, StyleSheet } from 'react-native';

// Determine the color scheme dynamically
const scheme = 'light'; // Fallback value for scheme
const currentColors = Colors[scheme ?? 'light'];

// Get the screen width
const { width } = Dimensions.get('window');
const isTablet = width >= 768; // Adjust threshold for tablet size

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
      },
      refreshButton: {
        position:'relative'
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      chatItem1: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginTop: 15,
      },
      chatItem: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginTop: 15,
        justifyContent: 'space-between'
      },
      profileImageWrapper: {
        marginRight: 15,
      },
      profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      },
      chatContent: {
        flex: 1,
      },
      chatName: {
        fontWeight: 'bold',
      },
      webInputContainer: {
        padding: 15,
      },
      inputField: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
      },
      searchContainer: {
        marginBottom: 10,
        paddingHorizontal: 15,
      },
      searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        paddingHorizontal: 10,
      },
      searchIcon: {
        marginRight: 10,
      },
      searchInput: {
        flex: 1,
        fontSize: 16,
        height: 40,
      },
});

