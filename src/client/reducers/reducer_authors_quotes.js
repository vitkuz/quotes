import C from '../constants';

// const initialState = {
//     byId: {},
//     allIds: [],
// };

export default function (state = [], action) {
    switch (action.type) {
        case C.POPULATE_AUTHORS_QUOTES:
            console.log(action.payload);
            return action.payload;
        case C.POPULATE_NOUNS_QUOTES:
            console.log(action.payload);
            return action.payload;
        default:
            return state;
    }
}