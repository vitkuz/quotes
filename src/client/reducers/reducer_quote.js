import C from '../constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.POPULATE_QUOTE_BY_ID:
            console.log(action.payload);
            return action.payload;
        default:
            return state;
    }
}