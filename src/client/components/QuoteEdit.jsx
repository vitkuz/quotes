import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getQuoteById } from '../actions/actions';

class Noun extends React.Component {
    componentDidMount() {
        this.props.getQuoteById(this.props.match.params.id);
        console.log('Quote Edit. Component did mount');
    }

    render() {

        return (
            <div>
                <h1>QUOTE EDIT FORM</h1>
                <form>
                    <label htmlFor="">text</label>
                    <input type="text" name="text" value={this.props.quote.text}/>
                    <hr/>
                    <label htmlFor="">author</label>
                    <input type="text" name="author" value={this.props.quote.author}/>
                    <hr/>
                    <label htmlFor="">nouns</label>
                    <input type="text" name="author" value={this.props.quote.nouns}/>
                    <hr/>
                    <label htmlFor="">topic</label>
                    <input type="text" name="author" value={this.props.quote.topic}/>
                    <button>Save</button>
                </form>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        quote: state.quote,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getQuoteById,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Noun);
