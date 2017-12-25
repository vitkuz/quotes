import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getQuotesByAuthor } from '../actions/actions';

class Author extends React.Component {
    componentDidMount() {
        this.props.getQuotesByAuthor(this.props.match.params.name);
        console.log('Author. Component did mount')
    }

    renderNouns(nouns) {
        return nouns.map((noun,index) => {
            return (<span key={index} className="quote__noun">
                <Link to={`/nouns/${noun}`}>{ noun }</Link>
            </span>)
        });
    }

    renderQuotes() {
        return this.props.quotes.map((quote,index) => {
            return (<div key={quote._id} className="quote">
                <span>
                    {index+1} { quote.author}: {quote.text }
                </span>
                {this.renderNouns(quote.nouns)}
                <span><Link to={`/quotes/${quote._id}/edit`}>{ quote._id }</Link></span>
            </div>)
        });
    }

    render() {
        console.log(this.props.match.params);
        if (this.props.quotes.length === 0) {
            return <div>Загрузка</div>
        }

        return (
            <div>
                <h1>{this.props.match.params.name}</h1>
                { this.props.quotes.length } цитат
                <hr/>
                { this.renderQuotes() }
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        quotes: state.quotes,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getQuotesByAuthor,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Author);
