export default (state, action) => {
    switch (action.type) {
        case "UPDATE_THEME":
            return {
                ...state,
                theme: state.theme === "Dark" ? "Light" : "Dark"
            }
        case "FETCH_COVID19_DATA":
            return {
                ...state,
                covid19IndiaData: action.covid19IndiaData
            }
        default:
            return state;
    }
}