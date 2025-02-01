import { Colors } from '@/constants/Colors';
import { Dimensions, StyleSheet } from 'react-native';

// Determine the color scheme dynamically
const scheme = 'light'; // Fallback value for scheme
const currentColors = Colors[scheme ?? 'light'];

// Get the screen width
const { width } = Dimensions.get('window');
const isTablet = width >= 768; // Adjust threshold for tablet size

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: currentColors.background,
    flexDirection: isTablet ? 'row' : 'column', // Row for tablets, column for phones
  },
  filterSection: {
    marginBottom: 25,
    borderRadius: 10,
  },
  filterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: currentColors.textPrimary, // Primary text color based on scheme
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 3,
    backgroundColor: !isTablet? currentColors.tabIconDefault : 'transparent', // Button background based on scheme
  },
  filterButtonText: {
    fontSize: 14,
    color: currentColors.buttonText, // Text color inside buttons based on scheme
  },
  activeFilterButton: {
    backgroundColor: currentColors.tint, // Active button color based on tint
  },
  activeSelectButton: {
    backgroundColor: '#5d478b',
  },
  chatsSection: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  selectedChatItem: {
    backgroundColor: currentColors.tabIconDefault,  // Selected chat background color
  },
  profileImageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: currentColors.textPrimary, // Name text color based on scheme
  },
  selectedChatName: {
    color: currentColors.primary,  // Change text color for selected chat
  },
  chatMessage: {
    fontSize: 14,
    color: currentColors.textSecondary, // Message text color based on scheme
  },
  selectedChatMessage: {
    color: currentColors.coloredText,  // Change message text color for selected chat
  },
  chatDetails: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  chatTime: {
    fontSize: 12,
    color: currentColors.messageTimestamp, // Timestamp text color based on scheme
  },
  unreadCount: {
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: currentColors.tint, // Unread count background color based on scheme
  },
  unreadCountText: {
    color: 'white', // White color for unread count text based on scheme
    fontSize: 12,
    fontWeight: 'bold',
  },
  achieveSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    margin: isTablet? 3 : 0,
  },
  achieveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 5,
    borderRadius: 5,
  },
  archivedText: {
    fontSize: 16,
    marginLeft: 5,
    color: currentColors.textSecondary, // Archived text color based on scheme
  },
  addButton: {
    zIndex: 9, 
    position: 'absolute', 
    bottom: 50, 
    right: 20, 
    padding: 13, 
    backgroundColor:currentColors.tint, 
    borderRadius: 10, 
  },
});

