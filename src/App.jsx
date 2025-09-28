import { Route, Routes } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Home from '@/pages/home/index.jsx';
import Layout from '@/components/Layout/index.jsx';
import context from '@/components/context.jsx';
import Venue from '@/pages/venue/index.jsx';
import Login from '@/pages/login/index.jsx';
import Register from '@/pages/register/index.jsx';
import Profile from '@/pages/profile/index.jsx';
import Admin from '@/pages/admin/index.jsx';
import { ProtectedRoute, ManagerRoute } from '@/components/ProtectedRoute.jsx';
import Toasts from '@/components/Toasts.jsx';


function App() {
  const [venues, setVenues] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [input, setInput] = useState('');
  // Initialize auth synchronously from localStorage to avoid redirect on refresh
  const [user, setUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('auth') || '{}');
      return stored.user || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('auth') || '{}');
      return stored.token || null;
    } catch {
      return null;
    }
  });
  // search + pagination + sorting
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [sort, setSort] = useState('created');
  const [order, setOrder] = useState('desc');
  // toasts
  const [toasts, setToasts] = useState([]);

  // removed: we now read from storage in initializers above

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify({ user, token }));
  }, [user, token]);

  const addToast = (message, type = 'info', timeout = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, type, timeout }]);
  };
  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  const auth = useMemo(() => ({ user, setUser, token, setToken }), [user, token]);

  return (
    <>
      <context.Provider value={{ venues, setVenues, searchResults, setSearchResults, input, setInput, auth, page, setPage, limit, setLimit, sort, setSort, order, setOrder, toasts, addToast, removeToast }}>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='venue/:id' element={<Venue />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path='admin' element={<ManagerRoute><Admin /></ManagerRoute>} />
          </Route>
        </Routes>
        <Toasts toasts={toasts} remove={removeToast} />
      </context.Provider>
    </>
  );
}

export default App;