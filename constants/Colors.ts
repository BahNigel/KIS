const tintColorLight = '#2B4FA7'; // Blue for light mode
const tintColorDark = '#001A3D'; // Very dark blue for dark mode

export const Colors = {
  light: {
    text: '#1A202C', // textPrimary for light mode
    textPrimary: '#1A202C', // Adding textPrimary explicitly
    textSecondary: '#4A5568', // Adding textSecondary explicitly
    background: '#F7FAFC', // background for light mode
    backgroundSecondary: '#747485',
    tint: tintColorLight, // Blue tint for light mode
    icon: '#4A5568', // textSecondary for light mode
    tabIconDefault: '#718096', // textDescription for light mode
    tabIconSelected: tintColorLight,
    buttonText: '#1A202C', // buttonText for light mode
    framButtonText: '#FFFFFF',
    buttonBackground: '#E2E8F0', // buttonBackground for light mode
    buttonSecondary: '#CBD5E0', // buttonSecondary for light mode
    inactiveButtonColor: '#CBD5E0', // Inactive button color for light mode
    inputBackground: '#E2E8F0', // Input field background for light mode
    inputText: '#1A202C', // Input field text for light mode
    messageBackground: '#FFFFFF', // Message bubble background for light mode
    messageText: '#1A202C', // Message bubble text for light mode
    messageTimestamp: '#718096', // Timestamp text for light mode
    notificationBackground: '#CBD5E0', // Notification background for light mode
    notificationText: '#1A202C', // Notification text for light mode
    transparent: 'rgba(255, 255, 255, 0.1)', // Light mode transparent background
    primary: '#007bff',
    coloredText: '#2B4FA7', // Same as tintColorLight for a cohesive design
  },
  dark: {
    text: '#FFFFFF', // textPrimary for dark mode
    textPrimary: '#FFFFFF', // Adding textPrimary explicitly
    textSecondary: '#CBD5E0', // Adding textSecondary explicitly
    background: '#1A202C', // background for dark mode
    backgroundSecondary: '#131E24',
    tint: tintColorDark, // Very dark blue tint for dark mode
    icon: '#CBD5E0', // textSecondary for dark mode
    tabIconDefault: '#A0AEC0', // textDescription for dark mode
    tabIconSelected: tintColorDark,
    buttonText: '#FFFFFF', // buttonText for dark mode
    framButtonText: '#FFFFFF',
    buttonBackground: '#2D3748', // buttonBackground for dark mode
    buttonSecondary: '#4A5568', // buttonSecondary for dark mode
    inactiveButtonColor: '#4A5568', // Inactive button color for dark mode
    inputBackground: '#2D3748', // Input field background for dark mode
    inputText: '#FFFFFF', // Input field text for dark mode
    messageBackground: '#2D3748', // Message bubble background for dark mode
    messageText: '#FFFFFF', // Message bubble text for dark mode
    messageTimestamp: '#A0AEC0', // Timestamp text for dark mode
    notificationBackground: '#4A5568', // Notification background for dark mode
    notificationText: '#FFFFFF', // Notification text for dark mode
    transparent: 'rgba(0, 0, 0, 0.5)', // Dark mode transparent background
    primary: '#1a73e8',
    coloredText: '#1a73e8', // Same as primary for a cohesive design
  },
};
