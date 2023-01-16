import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export default {
    namespaced: true,
    state(){
        return{
            values: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]],
            size: 4,
            seconds: 0,
            minutes: 0,
            moves: 0,
            emptyX: 3,
            emptyY: 3,
            interval: null,
            play: false,
            shuffleValue: 10,
            gameOverArray: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]],
            startButtonState: "Start",
            scoreCardVisibility: "hidden",
            connectionObject: new WebSocket("wss://9cs6q8gyfb.execute-api.us-east-1.amazonaws.com/dev"),
            restApiStage: "https://x5qa1kq42k.execute-api.us-east-1.amazonaws.com/prod/"
        }
    },
    getters,
    mutations,
    actions
};