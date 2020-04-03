export default (state, action) => {
    switch (action.type) {
        case "UPDATE_THEME":
            return {
                ...state,
                theme: state.theme === "Dark" ? "Light" : "Dark"
            }
        case "FETCH_DISTRICT_WISE_DATA":
            return {
                ...state,
                districtWiseData: action.districtWiseData
            }
        case "FETCH_STATEWISE_DATA_FROM_SHEET":
            return {
                ...state,
                stateWiseData: action.stateWiseData
            }
        default:
            return state;
    }
}