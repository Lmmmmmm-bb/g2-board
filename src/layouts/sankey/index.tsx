import { FC, useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { DataSet } from '@antv/data-set';
import { colors, data } from './config';
import styles from './index.module.scss';

const Sankey: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const ds = new DataSet();
      const dv = ds
        .createView()
        .source(data, { type: 'graph', edges: (d) => d.links });
      dv.transform({
        type: 'diagram.sankey',
        sort: () => -1
      });
      chartRef.current && chartRef.current.destroy();

      const chart = new Chart({
        container: containerRef.current,
        autoFit: true,
        height: 800,
        padding: 40
      });
      chart.legend(false);
      chart.tooltip({ showTitle: false, showMarkers: false });
      chart.axis(false);
      chart.scale({
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
      edgeView.interaction('element-highlight');

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
        .position('x*y') // nodes数据的x、y由layout方法计算得出
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
      nodeView.interaction('element-highlight');

      // edge view & node view event listener
      nodeView.on('element:mouseleave', () => {
        edgeView.getElements().forEach((item) => item.clearStates());
      });
      nodeView.on('element:mouseenter', (e) => {
        const [_edgeView] = edgeView.geometries;
        _edgeView.elements.forEach((item) => {
          if (
            item.getData().target === e.data.data.name ||
            item.getData().source === e.data.data.name
          ) {
            item.setState('active', true);
          } else {
            item.setState('inactive', true);
          }
        });
      });
      edgeView.on('element:mouseleave', () => {
        nodeView.getElements().forEach((item) => item.clearStates());
      });
      edgeView.on('element:mouseenter', (e) => {
        const [_nodeView] = nodeView.geometries;
        _nodeView.elements.forEach((item) => {
          if (
            item.getData().name === e.data.data.target ||
            item.getData().name === e.data.data.source
          ) {
            item.setState('active', true);
          } else {
            item.setState('inactive', true);
          }
        });
      });

      chart.render();
      chartRef.current = chart;
    }
  }, []);

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <h3 className={styles.title}>桑基图 Sankey</h3>
      <p className={styles.description}>
        通过绑定自定义事件，实现鼠标移入节点和边时，节点和边的高亮显示。
      </p>
    </div>
  );
};

export default Sankey;
