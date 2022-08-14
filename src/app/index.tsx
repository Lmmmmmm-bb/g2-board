import { FC } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Sankey from '@/layouts/sankey';
import styles from './index.module.scss';

const App: FC = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>G2 Playground</h2>
      <div className={styles.linkWrapper}>
        <Link to='/sankey'>Sankey</Link>
      </div>
      <Routes>
        <Route path='/sankey' element={<Sankey />} />
      </Routes>
    </div>
  );
};

export default App;
