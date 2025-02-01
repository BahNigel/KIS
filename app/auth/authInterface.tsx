export default interface VerificationProps {
    visible: boolean;
    onClose: () => void;
    verificationCode: string;
    userDetails: any;
    navigation: any; // Define the specific type for navigation based on your navigation library, e.g., React Navigation
    setIsLoggedIn: (isLoggedIn: boolean) => void;
  }
  