import s from './Graph.module.css';

import differenceWith from 'lodash/differenceWith';
import isUndefined from 'lodash/isUndefined';
import range from 'lodash/range';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getTime, useChainGraph } from 'services/api';
import { useWindowSize } from 'utils/hooks/useWindowSize';

const Graph: FC = () => {
  const { width } = useWindowSize();

  const memoGetGraphDimensions = useCallback(getGraphDimensions, [width]);
  const memoGetTime = useCallback(getTime, []);

  const {
    widthSize,
    heightSize,
    ySize,
    ySizeDelta,
    xSize,
    xSizeDelta,
    radius,
    fontSize,
    distance,
    chainDelta,
  } = memoGetGraphDimensions();

  const data = useChainGraph(ySize, ySizeDelta, xSize, xSizeDelta);
  const [graphData, setGraphData] = useState<{
    nodes: Record<string, string | number>[];
    links: Record<string, string>[];
  }>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    if (
      differenceWith(data.nodes, graphData.nodes, (a, b) => a.id === b.id)
        .length
    ) {
      setGraphData(data as any);
    }
  }, [data, graphData.nodes]);

  useEffect(() => {
    setInterval(() => {
      setGraphData((obj) => {
        const { nodes, links } = obj;
        return {
          nodes: nodes.map((item) => {
            if (item.height) {
              return {
                ...item,
                time: memoGetTime(item.creationTime as number),
              };
            }
            return item;
          }),
          links,
        };
      });
    }, 1000);
  }, [memoGetTime]);

  return (
    <div className={s.container}>
      <div className={s.innerContainer}>
        <ForceGraph2D
          graphData={graphData}
          dagMode="td"
          dagLevelDistance={50}
          height={heightSize}
          width={widthSize}
          enableZoomInteraction={false}
          linkColor={() => '#975E9A'}
          nodeRelSize={radius}
          cooldownTicks={0}
          nodeLabel={(node: Record<string, string | number>) => {
            if (node?.creationTime) {
              return `<p>Height: ${node.height} <br />Chain: ${node?.chainId}</p>`;
            }
            return;
          }}
          nodeCanvasObject={(node: Record<string, string | number>, ctx) => {
            const y = Number(node?.level) * ySize - ySizeDelta;
            node.y = y;
            node.fy = y;
            const x = Number(node?.chainId) * xSize - xSizeDelta;
            node.x = x;
            node.fx = x;

            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = node?.creationTime
              ? '#975E9A'
              : 'rgb(151 94 154 / 10%)';
            ctx.fill();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            if (node?.creationTime) {
              if (!isUndefined(node?.txs)) {
                ctx.fillText(`${node?.time}s`, node.x, node.y - distance);
                ctx.fillText(`${node?.txs} txs`, node.x, node.y + distance);
              } else {
                ctx.fillText(`${node?.time}s`, node.x, node.y + 1);
              }
            }
            if (node?.level === 0 && node?.chainId === 0) {
              const y1 = Number(-0.52) * ySize - ySizeDelta;
              const x1 = Number(-1) * xSize - xSizeDelta;
              const y2 = Number(-0.45) * ySize - ySizeDelta;
              ctx.beginPath();
              range(20).forEach((i) => {
                const x1 = Number(i) * xSize - xSizeDelta;
                ctx.fillText(String(i), x1, y1);
                ctx.fillText('CHAIN', x1, y1 + chainDelta);
              });
              ctx.fillText('HEIGHT', x1, y2);
              if (node?.height) {
                const height = Number(node.height);
                range(height, height - 4, -1).forEach((i, index) => {
                  ctx.fillText(
                    String(i),
                    x1,
                    Number(index) * ySize - ySizeDelta,
                  );
                });
              }
              ctx.stroke();
            }
          }}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          d3VelocityDecay={0.3}
        />
      </div>
    </div>
  );

  function getGraphDimensions() {
    const maxWidth = 1360;
    const minWidth = 700;
    const maxHeight = 500;
    const maxY = 120;
    const maxX = 70;
    const maxRadius = 30;
    const maxFontSize = 13;
    const widthSize =
      width > maxWidth
        ? width > 1440
          ? maxWidth
          : maxWidth - (1440 - width)
        : width < minWidth
        ? minWidth
        : width > 860
        ? width - 80
        : width - 32;
    const heightSize = (widthSize * maxHeight) / maxWidth;
    const ySize = (widthSize * maxY) / maxWidth;
    const ySizeDelta = ySize * 1.35;

    const xSize = (widthSize * maxX) / maxWidth;
    const xSizeDelta = xSize * 9;

    const radius = (widthSize * maxRadius) / maxWidth;
    const fontSize =
      (widthSize * maxFontSize) / maxWidth < 8
        ? 8
        : (widthSize * maxFontSize) / maxWidth;

    const distance = (widthSize * 7) / maxWidth;

    const chainDelta = (widthSize * 15) / maxWidth;

    return {
      widthSize,
      heightSize,
      ySize,
      ySizeDelta,
      xSize,
      xSizeDelta,
      radius,
      fontSize,
      distance,
      chainDelta,
    };
  }
};

export default memo(Graph);
