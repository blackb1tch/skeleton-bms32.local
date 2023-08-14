import React from 'react';
import ReactDOM from 'react-dom/client';

import SearchFormSpareParts from "./src/Form/SearchFormSpareParts.jsx";


if (document.querySelector('.search-form')) {
    const searchFormSpareParts = ReactDOM.createRoot(document.querySelector('.search-form'));
    searchFormSpareParts.render(<SearchFormSpareParts/>);
}



