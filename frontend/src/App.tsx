import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AuthRouter from './components/AuthRouter'; // Import the new AuthWrapper component

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="container mx-auto">
          <AuthRouter />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
