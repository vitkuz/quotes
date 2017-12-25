import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Authors extends React.Component {
    renderAuthors() {
        return this.props.authors.map((author, index) => {
            return <div key={author._id}>{index+1} <Link to={`/authors/${author._id}`}>{author._id}</Link> | { author.count }</div>
        });
    }

    render() {

        return (
            <div>
                <h1>{this.props.authors.length} авторов</h1>
                { this.renderAuthors() }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authors: state.authors,
    };
}


export default connect(mapStateToProps, null)(Authors);
