import React from 'react';
import { StyleSheet,
         Text,
         View,
         TouchableOpacity,
         Animated,
         Easing,
         Alert,
         Button,
         TouchableHighlight } from 'react-native';
import Dimensions from 'Dimensions';
import ModeSelector from './ModeSelector';
import Tile from './Tile';
import BoardMenu from './BoardMenu';
import Modal from 'react-native-modal'
import { Ionicons } from '@expo/vector-icons';
let {width, height} = Dimensions.get('window');
let COLORS = ['#403837', '#BE3E2C'];
let MODES = ['square', 'plus', 'cross'];

export default class Board extends React.Component {
  constructor(props) {
    super();
    this.state = {
        board : this.buildBoard(props.size, props.moves),
        mode : MODES[0],
        originalProps : props,
        modal : {
          visible : false,
          msg : null,
          color : null,
          type : null
        }
    }
    this.mutateBoard(props);
    this.clickTile = this.clickTile.bind(this);
    this.setMode = this.setMode.bind(this);
  }

/* ----------------------------- initialization logic ------------------------*/
  mutateBoard(props) {
    if (props.level % 5 !== 1) {
      let numTilesToMutate = (props.level % 5) * (props.level / 5);
      if (numTilesToMutate < 1) { numTilesToMutate = 1; }
      for (let i = 0; i < numTilesToMutate; i++) {
        let tileId = Math.floor(Math.random()*this.state.board.size);
        this.state.board.tiles[tileId].tileStyle.backgroundColor = COLORS[1];
      }
    }
  }

  // build board given a board size N (n x n board)
  buildBoard(size, movesLeft) {
    let cell_size = 0.8*width * 1/size;
    let cell_padding = cell_size * 0.05;
    let border_radius = cell_padding * 2;
    let title_size = cell_size - cell_padding * 2;
    let opacities = this.getInitialOpacities(size);
    let tilts = this.getInitialTilt(size);
    let tiles = this.getInitialTileState(size, cell_size, cell_padding, opacities, tilts);
    return {
        size : size,
        cell_size : cell_size,
        cell_padding : cell_padding,
        border_radius : border_radius,
        title_size : title_size,
        opacities : opacities,
        tilts : tilts,
        tiles : tiles,
        movesLeft : movesLeft,
    }
  }

  // tile opacities
  getInitialOpacities(size) {
    let opacities = new Array(size * size);
    for (let i = 0; i < opacities.length; i++) {
      opacities[i] = new Animated.Value(1);
    }
    return opacities;
  }

  // tile tilt
  getInitialTilt(size) {
    let tilt = new Array(size * size);
    for (let i = 0; i < tilt.length; i++) {
      tilt[i] = new Animated.Value(0);
    }
    return tilt;
  }

  getInitialTileState(size, cell_size, cell_padding, opacities, tilts) {
    let tiles = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        let key = row * size + col;
        // add tilt effect to tile
        let tilt = tilts[key].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-30deg']
        });
        // tile styling
        let tileStyle = {
          left: col * cell_size + cell_padding,
          top: row * cell_size + cell_padding,
          opacity: opacities[key],
          transform: [{perspective: cell_size * 8},
                      {rotateX: tilt}],
          backgroundColor: COLORS[0] // set initial color to be green;
        };
        tiles.push({key : key, tileStyle : tileStyle});
      }
    }
    return tiles;
  }

  _resetInitialState() {
    let newState = {
      board : this.buildBoard(this.state.originalProps.size, this.state.originalProps.moves)
    }
    this.setState(newState);
  }

/* ----------------------------- board drawing logic -------------------------*/
  render() {
    let that = this;
    let dynamicStyles = this.getDynamicStyles();

    return (
      <View style={styles.game}>
        <View style={styles.boardMenu}>
          <BoardMenu setRoute={this.props.setRoute} movesLeft={this.state.board.movesLeft}
            level={this.props.level} score={this.props.score}/>
        </View>
        <View style={styles.board}>
          <View style={dynamicStyles.container}>
            {this.state.board.tiles.map(function(tile, i){
              return <Tile key={tile.key} id={tile.key} style={[dynamicStyles.tile, tile.tileStyle]} clickTile={that.clickTile}/>
            })}
          </View>
        </View>
        <View style={styles.selector}>
          <ModeSelector style={styles.modeSelector} setMode={this.setMode}/>
        </View>
        {this.modal()}
      </View>
    );
  }

/* ----------------------------- game logic ----------------------------------*/
  clickTile(id) {
    let newState = this.state; // ensure that we decrement moves before checking win TODO: refactor
    let ids;

    // decrement moves before we setState later on
    newState.board.movesLeft--

    switch (this.state.mode) {
      case MODES[0]:
        ids = this._squareModeClickHandler(id); break;
      case MODES[1]:
        ids = this._plusModeClickHandler(id); break;
      case MODES[2]:
        ids = this._crossModeClickHandler(id); break;
      default:
        console.log('that mode is unsupported'); break;
    }

    for (let i = 0; i < ids.length; i++) {
        this._triggerTileAnimation(ids[i]).start();
    }
    this._triggerColorChange(ids, newState);
  }

  setMode(mode) {
    let modeIndex = MODES.indexOf(mode);
    if (modeIndex !== -1) {
      this.setState({
        mode : MODES[modeIndex]
      });
    }
  }

  checkWinOrLose(newState) {
      if (this._didWin()) {
        this.renderModal('levelup');
      } else if (newState.board.movesLeft === 0) {
        this.renderModal('fail');
        // modal handles the fail state
        // if (this.props.level !== 0) {
        //   this.props.setRoute('newGame');
        // } else {
        //   // board renders based on key, which is level, if the level is 0 we need to reset the state instead.
        //   this._resetInitialState();
        // }
      }
  }

  _didWin() {
    let size = this.state.board.size;
    for (let i = 0; i < (size * size); i++) {
        if (this.state.board.tiles[i].tileStyle.backgroundColor !== "#BE3E2C") {
            return false;
        }
    }
    return true;
  }

  // TODO: refactors all these handlers
  buildClickHandlerVars(id) {
    size = this.state.board.size;
    return [[id], size, id % size, Math.floor(id / size)];
  }

  _plusModeClickHandler(id) {
    let [ids, size, xPos, yPos] = this.buildClickHandlerVars(id);

    if (yPos === 0) {
      if (xPos === 0) { ids = ids.concat([id + 1, id + size]); }
      else if (xPos < size - 1) { ids = ids.concat([id - 1, id + 1, id + size]); }
      else { ids = ids.concat([id - 1, id + size]); }
    } else if (yPos < size - 1) {
      if (xPos === 0) { ids = ids.concat([id + 1, id + size, id - size]); }
      else if (xPos < size - 1) { ids = ids.concat([id - 1, id + 1, id + size, id - size]); }
      else { ids = ids.concat([id - 1, id + size, id - size]); }
    } else {
      if (xPos === 0) { ids = ids.concat([id + 1, id - size]); }
      else if (xPos < size - 1) { ids = ids.concat([id - 1, id + 1, id - size]); }
      else { ids = ids.concat([id - 1, id - size]); }
    }

    return ids;
  }

  _squareModeClickHandler(id) {
    let [ids, size, xPos, yPos] = this.buildClickHandlerVars(id);

    if (yPos === 0) {
      if (xPos === 0) { ids = ids.concat([id + 1, id + size, id + size + 1]); }
      else if (xPos < size - 1) { ids = ids.concat([id - 1, id + 1, id + size, id + size - 1, id + size + 1]); }
      else { ids = ids.concat([id - 1, id + size, id + size - 1]); }
    } else if (yPos < size - 1) {
      if (xPos === 0) { ids = ids.concat([id + 1, id + size, id - size, id + size + 1, id - size + 1]); }
      else if (xPos < size - 1) { ids = ids.concat([id - 1, id + 1, id + size, id - size, id + size - 1, id + size + 1, id - size - 1, id - size + 1]); }
      else { ids = ids.concat([id - 1, id + size, id - size, id - size - 1, id + size - 1]); }
    } else {
      if (xPos === 0) { ids = ids.concat([id + 1, id - size, id - size + 1]); }
      else if (xPos < size - 1) { ids = ids.concat([id - 1, id + 1, id - size, id - size - 1, id - size + 1]); }
      else { ids = ids.concat([id - 1, id - size, id - size - 1]); }
    }

    return ids;
  }

  _crossModeClickHandler(id) {
    let [ids, size, xPos, yPos] = this.buildClickHandlerVars(id);

    if (yPos === 0) {
      if (xPos === 0) { ids = ids.concat([id + size + 1]); }
      else if (xPos < size - 1) { ids = ids.concat([id + size - 1, id + size + 1]); }
      else { ids = ids.concat([id + size - 1]); }
    } else if (yPos < size - 1) {
      if (xPos === 0) { ids = ids.concat([id + size + 1, id - size + 1]); }
      else if (xPos < size - 1) { ids = ids.concat([id + size - 1, id + size + 1, id - size - 1, id - size + 1]); }
      else { ids = ids.concat([id - size - 1, id + size - 1]); }
    } else {
      if (xPos === 0) { ids = ids.concat([id - size + 1]); }
      else if (xPos < size - 1) { ids = ids.concat([id - size - 1, id - size + 1]); }
      else { ids = ids.concat([id - size - 1]); }
    }

    return ids;
  }

/* ----------------------------- animations ----------------------------------*/
  _triggerColorChange(ids, newState) {
    for (let i = 0; i < ids.length; i++) {
      let currColor = this.state.board.tiles[ids[i]].tileStyle.backgroundColor;
      let currIndex = COLORS.indexOf(currColor);
      let newIndex = (currIndex === COLORS.length - 1) ? 0 : currIndex + 1;
      newState.board.tiles[ids[i]].tileStyle.backgroundColor = COLORS[newIndex];
    }
    this.setState(newState);
    this.checkWinOrLose(newState);
  }

  _triggerTileAnimation(id) {
    let opacity = this.state.board.opacities[id];
    let tilt = this.state.board.tilts[id];
    opacity.setValue(.5); // half transparent, half opaque
    tilt.setValue(2);
    return Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, // fully opaque
        duration: 450, // milliseconds
      }),
      Animated.timing(tilt, {
        toValue: 0, // mapped to 0 degrees (no tilt)
        duration: 450, // milliseconds
        easing: Easing.quad // quadratic easing function: (t) => t * t
      })
    ]);
  }

/* ----------------------------- dynamic styling -----------------------------*/
  getDynamicStyles() {
    return {
      container: {
        width: this.state.board.cell_size * this.state.board.size,
        height: this.state.board.cell_size * this.state.board.size,
        backgroundColor: 'transparent',
      },
      tile: {
        position: 'absolute',
        width: this.state.board.title_size,
        height: this.state.board.title_size,
        borderRadius: this.state.board.border_radius,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#403837',
      }
    }
  }

/* -------------------------------- Modal ------------------------------------*/
  modal(msg) {
    let opacity = (this.state.modal.type === "levelup") ? 0.9 : 1
    return (
      <Modal isVisible={this.state.modal.visible} backdropColor={this.state.modal.color}
        backdropOpacity={opacity} animationIn={'zoomInDown'} animationOut={'zoomOutUp'}
        animationInTiming={200} animationOutTiming={200} backdropTransitionInTiming={200}
        backdropTransitionOutTiming={200}>
        <View>
          <View style={styles.modal}>
            <Text style={[styles.modalMsg, {color:this.state.modal.color}]}>{this.state.modal.msg}</Text>
          </View>
          <TouchableHighlight underlayColor='transparent' onPress={() => {this.hideModal()}}>
            <Ionicons style={styles.modalClose} name="md-arrow-dropright-circle" />
          </TouchableHighlight>
        </View>
      </Modal>
    )
  }

  renderModal(type) {
    switch (type) {
      case 'fail':
        this.setState({modal:{
          visible: true,
          msg: "SORRY. OUT OF MOVES.",
          color: '#dd7b6e',
          type: 'fail'
        }}); break;
      case 'levelup':
        this.setState({modal:{
          visible: true,
          msg: "LEVEL UP",
          color: '#7AAF29',
          type: 'levelup'
        }}); break;
    }
  }

  hideModal() {
    if (this.state.modal.type === 'fail') {
      this.props.setRoute('gameOver');
    } else {
      // don't need to remove modal because this component is getting reconstructed
      // this.setState({modal:{visible: false}});
      this.props.levelUp();
    }
  }
}

/* ----------------------------- static styling ------------------------------*/
const styles = StyleSheet.create({
  boardMenu: {
    flex: 1
  },
  board: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selector: {
    flex: 1
  },
  game: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#CECDCD',
  },
  modal: {
    backgroundColor: '#b3b3b3',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalMsg: {
    fontSize: 30,
    fontFamily: 'NukamisoLite',
    textAlign: 'center'
  },
  modalClose: {
    textAlign: 'center',
    fontSize: 60,
    marginTop: 20,
    color: '#b3b3b3'
  }
});
