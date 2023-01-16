export default {
    makeMove({ commit, getters }, move) {
        let temp;
        let values = getters.getValues;
        let newValues = [...values]
        let X = getters.getEmptyX;
        let Y = getters.getEmptyY;
        if (move === "UP" && X > 0) {
            temp = values[X - 1][Y]
            newValues[X - 1][Y] = 0
            commit('updateEmptyX', X - 1)
        }

        else if (move === "RIGHT" && Y < 3) {
            temp = values[X][Y + 1]
            newValues[X][Y + 1] = 0
            commit('updateEmptyY', Y + 1)
        }

        else if (move === "DOWN" && X < 3) {
            temp = values[X + 1][Y]
            newValues[X + 1][Y] = 0
            commit('updateEmptyX', X + 1)
        }

        else if (move === "LEFT" && Y > 0) {
            temp = values[X][Y - 1]
            newValues[X][Y - 1] = 0
            commit('updateEmptyY', Y - 1)
        }
        newValues[X][Y] = temp
        commit('updateValues', newValues)
    },
    shuffle({ getters }) {
        let iterations = getters.getShuffleValue
        const moveOptions = ["UP", "RIGHT", "DOWN", "LEFT"]
        for (let i = 0; i < iterations; i++) {
            let move = moveOptions[Math.floor(Math.random() * moveOptions.length)]
            this.dispatch('gamestates/makeMove', move)
        }
    },
    getStatisticsFromServer() {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", this.state.gamestates.restApiStage+"statistics");
            xhr.send();
            xhr.onload = () => {
                const statistics = JSON.parse(xhr.response);
                resolve(statistics);
            };
        });
    },
    postStatisticsToServer({ getters }) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", this.state.gamestates.restApiStage+"statistics");
        xhr.setRequestHeader("Content-Type", "application/json");
        const msg = JSON.stringify(getters.createMessageForStatistics);
        xhr.send(msg);
    },
    getLastStateFromServer({ commit }) {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", this.state.gamestates.restApiStage+"laststate");
            xhr.send();
            xhr.onload = () => {
                const lastStateData = JSON.parse(xhr.response);
                const dataObject = lastStateData[0]
                commit('updateValues', dataObject.values)
                commit('updateEmptyX', dataObject.emptyX)
                commit('updateEmptyY', dataObject.emptyY)
                commit('updateMinutes', parseInt(dataObject.minutes))
                commit('updateMoves', parseInt(dataObject.moves))
                commit('updateSeconds', parseInt(dataObject.seconds))
                resolve(lastStateData);
            };
        });
    },
    updateLastStateToServer({ getters }) {
        if (this.state.gamestates.connectionObject.readyState === 1) {
            const Request = {
                action: "updateLastState",
                data: getters.createMessageForLastState
            };
            this.state.gamestates.connectionObject.send(JSON.stringify(Request));
        } else {
            console.log("Web Socket Connection Broke...! 💥")
        }
    }
}