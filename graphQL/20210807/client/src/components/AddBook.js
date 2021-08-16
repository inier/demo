import React from "react";
// import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import {
    getAuthorsQuery,
    addBookMutation,
    getBooksQuery,
} from "../queries/queries";
import "./AddBook.css";

function AddBook(props) {
    const [book, setBook] = React.useState({
        name: "",
        genre: "",
        authorId: "",
    });

    function displayAuthors() {
        const data = props.getAuthorsQuery;

        if (data.loading) {
            return <option>Loading Authors...</option>;
        } else {
            return data.authors.map(({ id, name }) => {
                return (
                    <option key={id} value={id}>
                        {name}
                    </option>
                );
            });
        }
    }

    function submitForm(e) {
        e.preventDefault();
        console.log(book);
        if (book.name && book.genre && book.authorId) {
            props.addBookMutation({
                variables: book,
                refetchQueries: [{ query: getBooksQuery }],
            });
        } else {
            alert("参数不能为空");
        }
    }

    return (
        <form id="add-book" onSubmit={submitForm}>
            <h1>Add New Book</h1>
            <div className="field">
                <label> Book Name：</label>
                <input
                    className="edit"
                    type="text"
                    onChange={(e) => setBook({ ...book, name: e.target.value })}
                />
            </div>
            <div className="field">
                <label> Genre：</label>
                <input
                    className="edit"
                    type="text"
                    onChange={(e) => setBook({ ...book, genre: e.target.value })}
                />
            </div>
            <div className="field">
                <label> Author： </label>
                <select
                    className="edit"
                    onChange={(e) => setBook({ ...book, authorId: e.target.value })}
                >
                    <option key="defaultOP" value="">
                        Select Author
                    </option>
                    {displayAuthors()}
                </select>
            </div>

            <button className="btn">+</button>
        </form>
    );
}

// AddBook.propTypes = {};

export default compose(
    graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
    graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);
