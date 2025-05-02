import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Table from './component/Table';
import BorrowedBooks from './component/BorrowedBooks';
import './Borrow.css'; // Adjust path if needed

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route  path="/" element={<Table  />} />
                <Route path="/borrowed-books" element={<BorrowedBooks />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
