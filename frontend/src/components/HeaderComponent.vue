<template>
  <header class="header">
    <div class="move-n-time">
      <div class="move-n-time__cards">
        <div class="moves">
          <h1>Moves</h1>
          <span id="moves">{{ moves }}</span>
        </div>
        <div class="time">
          <h1>Time</h1>
          <p>
            <span id="timer-min">
              {{ min <= 9 ? '0'+ min : min }}
            </span> : <span id="timer-sec">
              {{ sec <= 9 ? '0'+ sec : sec }}
            </span>
          </p>
        </div>
      </div>
      <div class="move-n-time__buttons">
        <button
          id="button-start"
          @click="startTimer"
        >
          {{ $store.state.gamestates.startButtonState }}
        </button>
        <button
          id="button-reset"
          @click="reloadPage"
        >
          Reset
        </button>
      </div>
    </div>
    <div class="header__title">
      <h1>Fifteen Puzzle Game</h1>
      <div
        id="scoreboard"
        class="scoreboard"
      >
        <button
          id="scoreboard-button"
          @click="makeScoreCardVisible"
        >
          Scoreboard
        </button>
      </div>
    </div>
  </header>
</template>

<script>

export default {  
  computed:{
    moves(){
      return this.$store.state.gamestates.moves
    },
    min(){
      return this.$store.state.gamestates.minutes
    },
    sec(){
      return this.$store.state.gamestates.seconds
    }
  },
  methods: {
    //TODO: To make it work without data property.
    timerFormatter() {
      this.$store.commit('gamestates/incrementSeconds')
      if (this.sec > 59) {
        this.$store.state.gamestates.seconds = 0
        this.$store.commit('gamestates/incrementMinutes')
      }
      this.$store.dispatch('gamestates/updateLastStateToServer')
    },

    startTimer() {
      if (this.$store.state.gamestates.startButtonState == "Start") {
        this.$store.state.gamestates.interval = setInterval(this.timerFormatter, 1000)
        this.$store.state.gamestates.play = true
        this.$store.state.gamestates.startButtonState = "Pause"
      }
      else if (this.$store.state.gamestates.startButtonState == "Pause") {
        clearInterval(this.$store.state.gamestates.interval)
        this.$store.state.gamestates.play = false
        this.$store.state.gamestates.startButtonState = "Resume"
      }
      else if (this.$store.state.gamestates.startButtonState == "Resume") {
        this.$store.state.gamestates.interval = setInterval(this.timerFormatter, 1000)
        this.$store.state.gamestates.play = true
        this.$store.state.gamestates.startButtonState = "Pause"
      }
    },

    reloadPage() {
      window.location.reload();
    },

    makeScoreCardVisible() {
      this.$store.commit('gamestates/makeScoreCardVisible')
    }
  }
}
</script>