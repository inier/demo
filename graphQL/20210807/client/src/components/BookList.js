import React from "react";
// import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { getBooksQuery, delBookMutation } from '../queries/queries';
import BookDetails from "./BookDetails";

function BookList(props) {
    const [selected, setSelected] = React.useState(null);

    function delBook(e) {
        props.delBookMutation({
            variables: { id: e.target.dataset.id },
            refetchQueries: [{ query: getBooksQuery }],
        });
    }
    function displayBooks() {
        const data = props.getBooksQuery;

        if (data.loading) {
            return <li>Loading Books...</li>
        } else {
            return data.books.map(({ id, name, genre }) => {
                const active = id === selected;
                return <li key={id} className={active ? "active": ""} onClick={() => { setSelected(id) }}>
                    {name} [ {genre} ]
                    {active && <div className="delete" onClick={delBook} data-id={id}>+</div>}
                </li>
            });
        }
    }

    return (
        <div>
            <ul id="book-list">
                {displayBooks()}
            </ul>
            <BookDetails id={selected} />
        </div>
    );
}

// BookList.propTypes = {};

export default compose(
    graphql(getBooksQuery, { name: "getBooksQuery" }),
    graphql(delBookMutation, { name: "delBookMutation" })
)(BookList);
