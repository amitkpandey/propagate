import { StyleSheet } from 'react-native';
import Dimensions from 'Dimensions';
const Width = Dimensions.get('window').width;

export default StyleSheet.create({
    leaderboard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CECDCD'
    },
    leaderboard_header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: Width*0.9,
        marginTop: 30
    },
    leaderboard_score: {
        width: Width*0.8,
        height: 45,
        padding: 10,
        margin: 2,
        backgroundColor: '#403837',
        borderRadius: 5,
    },
    leaderboard_score_flex: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leaderboard_score_text_1: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'left',
        marginLeft: 5,
        color: 'white',
        fontSize: 12
    },
    leaderboard_score_text_2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        fontSize: 10
    },
    leaderboard_score_text_3: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        textAlign: 'right',
        marginRight: 5,
        color: 'white',
        fontSize: 18
    },
    menuButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backToMenu: {
        backgroundColor: '#BE3E2C',
        padding: 5,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 5
    },
    menuText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white'
    },
    scoreText: {
        fontSize:20,
        padding:5,
        paddingLeft:8,
        paddingRight:8
    },
    emptyElement: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    scoreElement: {
        flex: 2.2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    scoreBox: {
        backgroundColor: '#ff9900',
        padding: 5,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 5,
        width: '90%',
    }
});