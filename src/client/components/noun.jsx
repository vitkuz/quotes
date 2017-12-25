import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getQuotesByNoun } from '../actions/actions';

class Noun extends React.Component {
    componentDidMount() {
        this.props.getQuotesByNoun(this.props.match.params.name);
        console.log('Noun. Component did mount');
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.match.params.name !== this.props.match.params.name) {
            window.scrollTo(0, 0);
            this.props.getQuotesByNoun(this.props.match.params.name);
        }
        return true;
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
                    {index+1} <Link to={`/authors/${quote.author}`}>{ quote.author}</Link>: {quote.text }
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
        getQuotesByNoun,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Noun);
