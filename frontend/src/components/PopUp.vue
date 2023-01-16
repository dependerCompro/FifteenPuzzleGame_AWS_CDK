<template>
  <div
    id="popup"
    class="popup"
  >
    <div v-if="onloadPopupVisibility">
      <p>Would you like to continue the previous game?</p>
      <div>
        <button
          id="button-yes"
          @click="yesClicked"
        >
          Yes
        </button>
        <button
          id="button-no"
          @click="noClicked"
        >
          No
        </button>
      </div>
    </div>
    <div v-if="GameOverPopupVisibility">
      <p>GAME OVER</p>
      <div>
        <button
          id="button-yes"
          @click="okClicked"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed:{
    ...mapGetters('gamestates', ['getScoreCardVisibility']),
    ...mapGetters('popupstates', ['getOnloadpopupVisibility', 'getGameOverPopupVisibility']),
    noClicked(){
      this.$store.commit("popupstates/makePopupHidden")
      this.$store.commit('gamestates/resetGame')
      this.$store.dispatch('gamestates/shuffle')
      return 0
    },
    yesClicked(){
      this.$store.commit("popupstates/makePopupHidden")
      this.$store.dispatch('gamestates/getLastStateFromServer')
      return 0
    },
    okClicked(){
      this.$store.commit("popupstates/makeGameOverPopupHidden")
      return 0
    },
    onloadPopupVisibility(){
      return this.getOnloadpopupVisibility === 'visible'
    },
    GameOverPopupVisibility(){
      return this.getGameOverPopupVisibility === 'visible'
    }
  }
}
</script>