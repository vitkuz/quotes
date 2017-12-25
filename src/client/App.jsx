import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAuthors } from './actions/actions';

import Authors from './components/authors';
import Author from './components/author';
import Noun from './components/noun';
import Header from './components/header';
import QuoteEdit from './components/QuoteEdit';

class App extends React.Component {
    componentDidMount() {
        this.props.getAuthors();
    }
    render() {
        return (
            <Router>
                <div className="App">
                    <Header />
                    <Switch>
                        <Route
                          exact
                          path="/authors"
                          component={Authors} />

                        <Route
                          path="/authors/:name"
                          component={Author} />

                        <Route
                            exact
                            path="/nouns/:name"
                            component={Noun} />

                        <Route
                            exact
                            path="/quotes/:id/edit"
                            component={QuoteEdit} />

                    </Switch>
                </div>
            </Router>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAuthors,
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(App);
