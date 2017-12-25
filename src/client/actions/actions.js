import C from '../constants';

export function populateAuthors(data) {
    return {
        type: C.POPULATE_AUTHORS,
        payload: data,
    };
}

export function populateAuthorsQuotes(data) {
    return {
        type: C.POPULATE_AUTHORS_QUOTES,
        payload: data,
    };
}

export function populateNounsQuotes(data) {
    console.log(data);
    return {
        type: C.POPULATE_NOUNS_QUOTES,
        payload: data,
    };
}

export function populateQuote(data) {
    console.log(data);
    return {
        type: C.POPULATE_QUOTE_BY_ID,
        payload: data,
    };
}

export function getAuthors() {
    return function (dispatch) {
        return fetch(`http://localhost:5000/api/quotes/authors`)
            .then(resp => resp.json())
            .then(data => dispatch(populateAuthors(data)))
            .catch((error) => {
                console.log(error);
            });
    }
}

export function getQuotesByAuthor(name) {
    return function (dispatch) {
        return fetch(`http://localhost:5000/api/quotes/authors/${name}`)
            .then(resp => resp.json())
            .then(data => dispatch(populateAuthorsQuotes(data)))
            .catch((error) => {
                console.log(error);
            });
    }
}

export function getQuotesByNoun(name) {
    return function (dispatch) {
        return fetch(`http://localhost:5000/api/quotes/nouns/${name}`)
            .then(resp => resp.json())
            .then(data => dispatch(populateNounsQuotes(data)))
            .catch((error) => {
                console.log(error);
            });
    }
}

export function getQuoteById(id) {
    return function (dispatch) {
        return fetch(`http://localhost:5000/api/quotes/${id}`)
            .then(resp => resp.json())
            .then(data => dispatch(populateQuote(data)))
            .catch((error) => {
                console.log(error);
            });
    }
}
