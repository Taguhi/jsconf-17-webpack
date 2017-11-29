import React from 'react';
import Logo from '../Logo';
import Counter from '../Counter';

import styles from './App.css'


const App = () => (
  <div className={styles.app}>
    <Logo />
    <Counter />
  </div>
);

export default App;
