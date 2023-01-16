<template>
  <div class="wrapper">
    <HeaderComponent />
    <OnloadPopup v-if="OnloadPopupVisibility" />
    <ScoreboardCard v-if="visibility" />
    <OnloadPopup v-if="GameOverPopupVisibility" />
    <PuzzleBoard />
    <PlayingInstructions />
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import OnloadPopup from '@/components/PopUp.vue';
import ScoreboardCard from '@/components/ScoreboardCard.vue';
import PlayingInstructions from '@/components/PlayingInstructions.vue';
import PuzzleBoard from '@/components/PuzzleBoard.vue';
import { mapGetters } from "vuex";

export default {
  name: 'HomeView',
  components: {
    HeaderComponent,
    OnloadPopup,
    ScoreboardCard,
    PuzzleBoard,
    PlayingInstructions,
  },
  computed:{
    ...mapGetters('gamestates', ['getScoreCardVisibility']),
    ...mapGetters('popupstates', ['getOnloadpopupVisibility', 'getGameOverPopupVisibility']),
    visibility(){
      return this.getScoreCardVisibility === 'visible'
    },
    OnloadPopupVisibility(){
      return this.getOnloadpopupVisibility === 'visible'
    },
    GameOverPopupVisibility(){
      return this.getGameOverPopupVisibility === 'visible'
    }
  }
}
</script>

<style>
@import '@/assets/css/main.css';
</style>