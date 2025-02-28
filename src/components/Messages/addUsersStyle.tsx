import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedUsersContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    maxHeight: 85,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  selectedUser: {
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  selectedUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  selectedUserName: {
    fontSize: 12,
    maxWidth: 60,
    textAlign: 'center',
    marginTop: 5,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  tickOverlay: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    backgroundColor: 'green',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  popupContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupMessage: {
    color: 'white',
    fontSize: 16,
  },
});
export default styles