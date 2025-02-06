export interface UserData {
  id: string;
  name: string;
  contacts: string;
  lastMessage: string;
  image: string | null;
  lastMessageTime: string;
  unreadCount: number;
  type: any;
  favorite: boolean;
  archived?: boolean;
}

export interface ChatsProps {
  select: boolean; // Added 'select' with boolean type
  setSelectedValue: React.Dispatch<React.SetStateAction<number>>; // Correctly typing setSelectedValue
  setSelect: React.Dispatch<React.SetStateAction<boolean>>; // Correctly typing setSelect
}




export interface ChatRoomProps {
  visible: boolean;
  onClose: () => void;
  userData: {
    id: string;
    name: string;
    lastMessage: string;
    image: string | null;
    lastMessageTime: string;
    unreadCount: number;
    type: string;
    favorite: boolean;
  };
}


export interface ChatRoom2Props {
  userData: {
    id: string;
    name: string;
    lastMessage: string;
    image: string | null;
    lastMessageTime: string;
    unreadCount: number;
    type: string;
    favorite: boolean;
  };
}


export interface ChatRoomModalProps {
  userData: {
    id: string;
    name: string;
    lastMessage: string;
    image: string | null;
    unreadCount: number;
    type: string;
    favorite: boolean;
  };
}

export const userDataInit = {
    id: '',
    name: '',
    lastMessage: '',
    contacts: '',
    image: null,
    lastMessageTime: '',
    unreadCount: 0,
    type: 'single',
    favorite: false,
}