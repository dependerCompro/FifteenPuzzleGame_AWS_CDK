import mutations from './mutations'

export default {
    namespaced: true,
    state(){
        return{
            onloadPopupVisibility: "visible",
            gameOverPopupVisibility: "hidden",
        }
    },
    getters: {
        getOnloadpopupVisibility(state){
            return state.onloadPopupVisibility;
        },
        getGameOverPopupVisibility(state){
            return state.gameOverPopupVisibility;
        }
    },
    mutations,
    actions: {}
};