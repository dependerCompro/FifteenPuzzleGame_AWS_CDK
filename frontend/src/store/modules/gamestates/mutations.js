export default {
    resetMoves(state) {
      state.moves = 0;
    },
    incrementMoves(state) {
      state.moves++;
    },
    incrementMinutes(state) {
      state.minutes++;
    },
    incrementSeconds(state) {
      state.seconds++;
    },
    updateValues(state, payload) {
      state.values = payload
    },
    updateEmptyX(state, val) {
      state.emptyX = val
    },
    updateEmptyY(state, val) {
      state.emptyY = val
    },
    updateMinutes(state, val) {
      state.minutes = val
    },
    updateMoves(state, val) {
      state.moves = val
    },
    updateSeconds(state, val) {
      state.seconds = val
    },
    makeScoreCardVisible(state) {
      state.scoreCardVisibility = "visible"
    },
    makeScoreCardHidden(state) {
      state.scoreCardVisibility = "hidden"
    },
    resetGame(state) {
      state.moves = 0
      state.emptyX = state.size - 1
      state.emptyY = state.size - 1
      state.minutes = 0
      state.seconds = 0
      state.startButtonState = "Start"
      clearInterval(state.interval)
    }
  }