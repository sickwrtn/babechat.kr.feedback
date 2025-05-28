import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Index from '.';
import Error from './error';
import Admin from './admin';
import './main.css'

export function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Index/>} />
                <Route path="/sick/admin" element={<Admin />}/>
                <Route path="/*" element={<Error />} />
            </Routes>
        </Router>
    )
}

export default App