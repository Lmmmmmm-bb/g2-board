import { FC } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Sankey from '@/layouts/sankey';
import styles from './index.module.scss';

const App: FC = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>G2 Playground</h2>
      <p className={styles.description}>G2 实在是太难玩了！</p>
      <div className={styles.linkWrapper}>
        <Link to='/sankey'>桑基图 Sankey</Link>
      </div>
      <Routes>
        <Route path='/sankey' element={<Sankey />} />
      </Routes>
    </div>
  );
};

export default App;
