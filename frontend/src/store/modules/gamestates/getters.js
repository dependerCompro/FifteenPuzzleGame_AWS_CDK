export default {
    getValues(state) {
        return state.values
    },
    getSize(state) {
        return state.size
    },
    getSeconds(state) {
        return state.seconds
    },
    getminutes(state) {
        return state.minutes
    },
    getMoves(state) {
        return state.moves
    },
    getEmptyX(state) {
        return state.emptyX
    },
    getEmptyY(state) {
        return state.emptyY
    },
    getShuffleValue(state) {
        return state.shuffleValue
    },
    getStartButtonState(state) {
        return state.startButtonState
    },
    getScoreCardVisibility(state){
        return state.scoreCardVisibility
    },
    createMessageForStatistics(state) {
        var messageObj = {
            minutes: state.minutes,
            seconds: state.seconds,
            moves: state.moves,
            userid: 1,
        };
        return messageObj;
    },
    createMessageForLastState(state) {
        var messageObj = {
            id: 1,
            minutes: state.minutes,
            seconds: state.seconds,
            moves: state.moves,
            values: state.values,
            emptyX: state.emptyX,
            emptyY: state.emptyY
        }
        return messageObj
    },
}