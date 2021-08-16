import React from "react";
// import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { getBookQuery } from '../queries/queries';

function BookDetails(props) {
    function displayBookDetails() {
        const { book } = props.data;

        if (book) {
            const { name, genre, author } = book;

            return (<div>
                <h2>{name}</h2>
                <p>{genre}</p>
                <p>{author.name}</p>
                <p>All books by this author:</p>
                <ul className="other-books">
                    {author.books.map(({ id, name, genre }) => {
                        return <li key={id}>{name} [ {genre} ]</li>
                    })}
                </ul>
            </div>);
        } else {
            return <div>No book selected...</div>
        }
    }

    return (
        <div id="book-details">
            {displayBookDetails()}
        </div>
    );
}

// BookDetails.propTypes = {};

export default graphql(getBookQuery, {
    options: (props) => {
        return {
            variables: {
                id: props.id,
            }
        }
    }
})(BookDetails);
