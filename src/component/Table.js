import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import './Table.css';

function Table() {
    const [details, setDetails] = useState([]);
    const [sign, setSign] = useState({ title: '', author: '', genre: '' });
    const [editId, setEditId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({ title: '', author: '', genre: '' });

    const navigate = useNavigate(); // Hook for navigation

    function tablecontent(e) {
        setSign({ ...sign, [e.target.name]: e.target.value });
    }

    function fetchData() {
        axios.get("http://92.205.109.210:8051/library/getall")
            .then(res => setDetails(res.data.data))
            .catch(err => console.error("Error fetching data:", err));
    }

    useEffect(() => {
        fetchData();
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        axios.post("http://92.205.109.210:8051/library/create", sign)
            .then(res => {
                alert(res.data.message);
                fetchData();
            });
    }
    
    function handleEdit(row) {
        setEditId(row._id);
        setEditData({ title: row.title, author: row.author, genre: row.genre });
        setEditMode(true);
    }

    function handleSave(row) {
        axios.post(`http://92.205.109.210:8051/library/update/${row.bookId}`, editData)
            .then(() => {
                fetchData();
                setEditMode(false);
                setEditId(null);
            });
    }

    function handleDelete(row) {
        axios.post(`http://92.205.109.210:8051/library/delete/${row.bookId}`)
            .then(() => fetchData());
    }

    function handleBorrow(row) {
        const borrowerName = prompt("Enter Borrower's Name:");
        if (!borrowerName) return;

        axios.post("http://92.205.109.210:8051/library/borrow", { bookId: row.bookId, borrower: borrowerName })
            .then(() => fetchData());
    }

    function handleReturn(row) {
        axios.post("http://92.205.109.210:8051/library/returnbook", { bookId: row.bookId })
            .then(() => fetchData());
    }

    function handleChange(e) {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    }

    const col = [
        { name: "BOOK ID", selector: row => row.bookId, sortable: true },
        { name: "TITLE", selector: row => editMode && row._id === editId ? <input type="text" name="title" value={editData.title} onChange={handleChange} /> : row.title, sortable: true },
        { name: "AUTHOR", selector: row => editMode && row._id === editId ? <input type="text" name="author" value={editData.author} onChange={handleChange} /> : row.author, sortable: true },
        { name: "GENRE", selector: row => editMode && row._id === editId ? <input type="text" name="genre" value={editData.genre} onChange={handleChange} /> : row.genre, sortable: true },
        { name: "AVAILABILITY", selector: row => row.availabilityStatus, sortable: true },
        {
            name: "ACTIONS",
            selector: row => (
                <div>
                    {editMode && row._id === editId ? (
                        <button onClick={() => handleSave(row)}>Save</button>
                    ) : (
                        <button onClick={() => handleEdit(row)}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(row)}>Delete</button>
                    <button onClick={() => handleBorrow(row)}>Borrow</button>
                    <button onClick={() => handleReturn(row)}>Return</button>
                </div>
            ),
        }
    ];

    return (
        <div className="library-table-container">
            <h2 className="library-heading">LIBRARY MANAGEMENT SYSTEM</h2>


            <form className='library-form' onSubmit={handleSubmit}>
                <div>
                    <label className='library-label'>TITLE:</label>
                    <input type="text" name="title" onChange={tablecontent} placeholder="Enter Book Title" />
                </div>
                <div>
                    <label  className='library-label'>AUTHOR:</label>
                    <input type="text" name="author" onChange={tablecontent} placeholder="Enter Author Name" />
                </div>
                <div>
                    <label  className='library-label' >GENRE:</label>
                    <input type="text" name="genre" onChange={tablecontent} placeholder="Enter Genre" />
                </div>
                <button>Submit</button>
            </form>

            {/* View Borrowed Books Button */}
            <button className='abc'  onClick={() => navigate('/borrowed-books')}>View Borrowed Books</button>
            <div className="table-responsive">
            <DataTable 
                columns={col}
                data={details}
                pagination
                highlightOnHover
                selectableRows
                selectableRowsHighlight
                className="custom-data-table"
            />
            </div>
        </div>
    );
}

export default Table;
