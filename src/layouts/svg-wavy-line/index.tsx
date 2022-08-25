import { FC, useRef, useState } from 'react';
import WavyLine from './wavy-line';
import styles from './index.module.scss';

const stageFrom = [1, 2, 3, 4];
const stageTo = [5, 6, 7, 8, 9];

const SvgWavyLine: FC = () => {
  const toRef = useRef<HTMLDivElement[]>([]);
  const fromRef = useRef<HTMLDivElement[]>([]);
  const [activeId, setActiveId] = useState<number>();

  const handleItemActive = (id) => {
    setActiveId(id);
  };

  const handleEdgeClick = (fromId, toId) => {
    console.log({ fromId, toId });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.itemWrapper}>
        {stageFrom.map((item) => (
          <div
            className={`${styles.item} ${
              activeId === item ? styles.itemActive : ''
            }`}
            key={item}
            ref={(_ref) => _ref && fromRef.current.push(_ref)}
            onClick={() => handleItemActive(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className={styles.itemWrapper}>
        {stageTo.map((item) => (
          <div
            className={`${styles.item} ${
              activeId === item ? styles.itemActive : ''
            }`}
            key={item}
            ref={(_ref) => _ref && toRef.current.push(_ref)}
            onClick={() => handleItemActive(item)}
          >
            {item}
          </div>
        ))}
      </div>
      {activeId &&
        (activeId <= 4
          ? stageTo.map((item, index) => (
              <WavyLine
                key={item}
                from={fromRef.current[activeId - 1]}
                to={toRef.current[index]}
                onEdgeClick={handleEdgeClick}
              />
            ))
          : stageTo.map((item, index) => (
              <WavyLine
                key={item}
                from={fromRef.current[index]}
                to={toRef.current[activeId - 5]}
                onEdgeClick={handleEdgeClick}
              />
            )))}
    </div>
  );
};

export default SvgWavyLine;
