import { Dimensions } from 'react-native';

const Width = Dimensions.get('window').width;

export default {
  levelPicker: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  levelPickerHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: Width * 0.9,
    marginTop: 30,
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToMenu: {
    backgroundColor: '#BE3E2C',
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 5,
    marginBottom: 20,
    flex: 1,
    justifyContent: 'center',
  },
  menuText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#f2f2f2',
    fontFamily: 'MontserratBold',
  },
  levelPickerText: {
    fontSize: 20,
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    fontFamily: 'MontserratBold',
  },
  levelPickerElement: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelPickerBox: {
    backgroundColor: '#403837',
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 5,
    marginBottom: 20,
    width: '95%',
    flex: 1,
    justifyContent: 'center',
  },
  rows: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    margin: 5,
    height: Width * 0.8 / 4 - 10 + 20,
    backgroundColor: '#649122',
    borderWidth: 5,
    borderColor: '#d6d7da',
  },
  cellDisabled: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    margin: 5,
    height: Width * 0.8 / 4 - 10 + 20,
    backgroundColor: 'gray',
    opacity: 0.5,
    borderWidth: 5,
    borderColor: '#d6d7da',
  },
  innerCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: Width * 0.1,
    color: '#f2f2f2',
    fontFamily: 'MontserratBold',
  },
  ratingBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    color: '#f2f2f2',
    fontSize: 13,
  },
};
