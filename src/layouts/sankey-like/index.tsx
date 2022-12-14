import { FC, useRef, useEffect } from 'react';
import { Chart } from '@antv/g2';
import { DataSet } from '@antv/data-set';
import { colors, data } from './config';
import styles from './index.module.scss';

const SankeyLike: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      chartRef.current && chartRef.current.destroy();
      const ds = new DataSet();
      const dv = ds
        .createView()
        .source(data, { type: 'graph', edges: (d) => d.links });
      dv.transform({
        type: 'diagram.sankey',
        sort: () => -1
      });

      const chart = new Chart({
        container: containerRef.current,
        autoFit: true,
        height: 800,
        padding: 40
      });
      chart
        .legend(false)
        .tooltip({ showTitle: false, showMarkers: false })
        .axis(false)
        .scale({
          x: { sync: true, nice: true },
          y: { sync: true, nice: true }
        });

      // edge view
      const edges = dv.edges.map((edge) => {
        return {
          source: edge.source.name,
          target: edge.target.name,
          x: edge.x,
          y: edge.y,
          value: edge.value,
          origin: edge
        };
      });
      const edgeView = chart.createView();
      edgeView
        .data(edges)
        .edge()
        .position('x*y')
        .shape('arc')
        .color('source', colors)
        .tooltip('target*source*value', (target, source, value) => ({
          name: `${source} to ${target}`,
          value
        }))
        .style({ lineWidth: 0, fillOpacity: 1 })
        .state({
          active: {
            style: { lineWidth: 0, fillOpacity: 1 }
          },
          inactive: {
            style: { lineWidth: 0, fillOpacity: 0.2 }
          }
        });

      // node view
      const nodes = dv.nodes.map((node) => ({
        x: node.x,
        y: node.y,
        name: node.name,
        origin: node
      }));
      const nodeView = chart.createView();
      nodeView
        .data(nodes)
        .polygon()
        .position('x*y') // nodes?????????x???y???layout??????????????????
        .color('name', colors)
        .label('name', {
          style: {
            fill: '#545454',
            textAlign: 'start'
          },
          offset: 0,
          content: (obj) => `     ${obj.name}`
        })
        .tooltip('origin', (origin) => {
          const { name, targetLinks, sourceLinks } = origin;
          const total = (
            targetLinks.length === 0 ? sourceLinks : targetLinks
          ).reduce((acc, cur) => acc + cur.value, 0);
          return { name, value: total };
        })
        .style({ lineWidth: 0, fillOpacity: 1 })
        .state({
          active: {
            style: { lineWidth: 0, fillOpacity: 1 }
          },
          inactive: {
            style: { lineWidth: 0, fillOpacity: 0.2 }
          }
        });

      chart.interaction('element-highlight');
      chart.render();
      chartRef.current = chart;
    }
  }, []);

  return (
    <div>
      <svg>
        <path d='M0 40 Q 50 20, 100 40 T 200 40, L 200 80, Q 150 100, 100 80, T 0 80' />
      </svg>
      <div ref={containerRef} className={styles.wrapper}>
        <h3 className={styles.title}>???????????? Sankey-Like</h3>
      </div>
    </div>
  );
};

export default SankeyLike;
