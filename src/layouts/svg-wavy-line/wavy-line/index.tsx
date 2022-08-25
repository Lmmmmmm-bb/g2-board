import { FC, useMemo } from 'react';

interface IWavyLineProps {
  from: HTMLDivElement;
  to: HTMLDivElement;
  onEdgeClick?: (from, to) => void;
}

const STROKE_WIDTH = 50;

const WavyLine: FC<IWavyLineProps> = (props) => {
  const { from, to, onEdgeClick } = props;

  const line = useMemo(() => {
    const width = to.offsetLeft - from.offsetLeft - from.offsetWidth;
    const height = Math.abs(from.offsetTop - to.offsetTop) + STROKE_WIDTH;
    return {
      width,
      height,
      d: `M0 ${height}C${width / 2} ${height} ${
        width / 2
      } ${STROKE_WIDTH} ${width} ${STROKE_WIDTH}V0C${width / 2} 0 ${
        width / 2
      } ${height - STROKE_WIDTH} 0 ${height - STROKE_WIDTH}L 0 ${height}Z`
    };
  }, [from, to]);

  const handleEdgeClick = (from, to) => {
    onEdgeClick?.(from, to);
  };

  return (
    <svg
      style={{
        position: 'absolute',
        left: from.offsetLeft + from.offsetWidth,
        top:
          from.offsetTop < to.offsetTop
            ? from.offsetTop + from.offsetHeight / 4
            : to.offsetTop + to.offsetHeight / 4,
        transform: `scaleX(${from.offsetTop < to.offsetTop ? '-1' : '1'})`
      }}
      width={line.width}
      height={line.height}
      viewBox={`0 0 ${line.width} ${line.height}`}
    >
      <path
        style={{ cursor: 'pointer' }}
        d={line.d}
        fill='#5470C6'
        fillOpacity='0.2'
        onClick={() => handleEdgeClick(from.offsetTop, to.offsetTop)}
      />
    </svg>
  );
};

export default WavyLine;
