import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Index from '.';
import Error from './error';
import Admin from './admin';
import './main.css'
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { env } from './env';

export function App() {

    const { t, i18n } = useTranslation();

    useEffect(()=>{
        i18n.changeLanguage(env.language);
        const title = document.head.getElementsByTagName("title")[0]
        title.innerHTML = t("header.title");
    },[])

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