import { combineReducers } from 'redux';

import AuthorsReducer from './reducer_authors';
import AuthorQuotesReducer from './reducer_authors_quotes';
import Quote from './reducer_quote';

const rootReducer = combineReducers({
    authors: AuthorsReducer,
    quotes: AuthorQuotesReducer,
    quote: Quote,
});

export default rootReducer;
