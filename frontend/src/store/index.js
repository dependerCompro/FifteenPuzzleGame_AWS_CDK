import { createStore } from 'vuex'
import gamestates from './modules/gamestates/index'
import popupstates from './modules/popupstates/index'

export default createStore({
    modules: {
        gamestates,
        popupstates
    }
});