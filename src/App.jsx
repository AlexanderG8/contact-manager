import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactsPage from './pages/ContactsPage';
import ContactDetailPage from './pages/ContactDetailPage';
import ContactEditPage from './pages/ContactEditPage';
import ContactNewPage from './pages/ContactNewPage';

export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contact/:id" element={<ContactDetailPage />} />
          <Route path="/contacts/edit/:id" element={<ContactEditPage />} />
        <Route path="/contacts/new" element={<ContactNewPage />} />
        </Routes>
    </Router>
  );
}
