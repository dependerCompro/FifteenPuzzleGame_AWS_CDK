export default {
  makePopupVisible(state) {
    state.onloadPopupVisibility = "visible"
  },
  makePopupHidden(state) {
    state.onloadPopupVisibility = "hidden"
  },
  makeGameOverPopupVisible(state) {
    state.gameOverPopupVisibility = "visible"
  },
  makeGameOverPopupHidden(state) {
    state.gameOverPopupVisibility = "hidden"
  }
}