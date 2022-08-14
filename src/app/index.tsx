import { FC } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styles from './index.module.scss';
import Sankey from '@/layouts/sankey';
import SankeyLike from '@/layouts/sankey-like';

const App: FC = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>G2 Playground</h2>
      <p className={styles.description}>G2 实在是太难玩了！</p>
      <div className={styles.linkWrapper}>
        <Link to='/sankey'>桑基图 Sankey</Link>
        <Link to='/sankey-like'>类桑基图 Sankey-Like</Link>
      </div>
      <Routes>
        <Route path='/sankey' element={<Sankey />} />
        <Route path='/sankey-like' element={<SankeyLike />} />
      </Routes>
    </div>
  );
};

export default App;
