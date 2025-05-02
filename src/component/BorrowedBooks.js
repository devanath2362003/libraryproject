import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import "./Background.css"

function BorrowedBooks() {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://92.205.109.210:8051/library/borrowedbooks")
            .then(res => setBorrowedBooks(res.data.data))
            .catch(err => console.error("Error fetching borrowed books:", err));
    }, []);

    const col = [
        { name: "BOOK ID", selector: row => row.bookId, sortable: true },
        { name: "TITLE", selector: row => row.title, sortable: true },
        { name: "AUTHOR", selector: row => row.author, sortable: true },
        { name: "BORROWER", selector: row => row.borrower, sortable: true },
        { name: "BORROWED DATE", selector: row => row.borrowedDate, sortable: true }
    ];

    return (
        <div className="borrowed-books-container">
            <h2>BORROWED BOOKS</h2>
            <button onClick={() => navigate('/')}>Back to Library</button>
            <DataTable 
                columns={col}
                data={borrowedBooks}
                pagination
                highlightOnHover
                className="custom-data-table"
            />
        </div>
    );
}

export default BorrowedBooks;
