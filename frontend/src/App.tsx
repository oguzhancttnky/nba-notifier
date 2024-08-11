import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AuthRouter from './components/AuthRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <div className="container mx-auto">
                    <AuthRouter />
                </div>
            </Router>
            <ToastContainer autoClose={1500} pauseOnHover={false} closeOnClick={true} />
        </Provider>
    );
};

export default App;
