import React from 'react';
import Transaction from './components/transaction';
require('dotenv').config();

function App() {
    return (
        <div className="App">
            <Transaction />
        </div>
    );
}

export default App;