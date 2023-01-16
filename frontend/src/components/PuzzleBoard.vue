<template>
  <div class="puzzle-board">
    <table
      id="field"
      class="board"
    >
      <tr
        v-for="(row, i) in $store.state.gamestates.values"
        :key="i"
      >
        <td
          v-for="(val, j) in row"
          :key="j"
          :class="val == 0 ? 'empty-cell' : 'cell'"
          @click="mouseMove(i, j)"
        >
          {{
            val == 0 ? "" : val
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('gamestates',['getValues'])
  },
  watch: {
    getValues: {
      handler(newValues) {
        if (this.isGameOver(newValues)) {
          setTimeout(() => {
            this.$store.commit("popupstates/makeGameOverPopupVisible")
            this.$store.dispatch('gamestates/postStatisticsToServer')
            this.$store.commit('gamestates/resetGame')
            this.$store.dispatch('gamestates/shuffle')
            this.$store.dispatch('gamestates/updateLastStateToServer')
          }, 1000);
        }
      }
    }
  },
  methods: {
    ...mapGetters('gamestates',['getEmptyX','getEmptyY', ]),
    mouseMove(i, j) {
      // UP, DOWN, LEFT, RIGHT here denotes the movement of empty cell.
      var move;
      if (i - 1 == this.$store.state.gamestates.emptyX && j == this.$store.state.gamestates.emptyY) {
        move = "DOWN"
      }

      else if (i == this.$store.state.gamestates.emptyX && j + 1 == this.$store.state.gamestates.emptyY) {
        move = "LEFT"
      }

      else if (i + 1 == this.$store.state.gamestates.emptyX && j == this.$store.state.gamestates.emptyY) {
        move = "UP"
      }

      else if (i == this.$store.state.gamestates.emptyX && j - 1 == this.$store.state.gamestates.emptyY) {
        move = "RIGHT"
      }
      else {
        move = "INVALID"
      }
      
      if (this.$store.state.gamestates.play) {
        this.$store.dispatch('gamestates/makeMove', move)
        this.$store.commit('gamestates/incrementMoves')
      }
    },
    isGameOver(newValues) {
      return JSON.stringify(newValues) === JSON.stringify(this.$store.state.gamestates.gameOverArray)
    }
  }
}
</script> 