import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modal: {
    backgroundColor: '#b3b3b3',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalMsg: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  modalClose: {
    textAlign: 'center',
    fontSize: 60,
    marginTop: 20,
    color: '#b3b3b3',
  },
});
