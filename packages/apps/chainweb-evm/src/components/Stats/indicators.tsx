import { useEffect, useRef, useState } from "react";
import { Chain, GraphChartData } from "../../store/chain/type"
import { storeHandlers, useAppState } from "../../store/selectors";
import { convertColorToBackgroundSubtleColor, createGradient } from "../../utils/color";
import { tokens } from "@kadena/kode-ui/styles";

import * as d3 from "d3";
import { GraphOptions, LineGraphOptions } from "../../utils/types";

import styles from "./box.module.css";
import headerStyles from "../Nav/Header/header.module.css";
import { __n, debounce } from "../../utils";
import { appendGraphTooltip, proxyGraphTooltip, moveGraphTooltip } from "../../utils/graphs";

export const ChainStatus = ({ chain }: { chain: Chain }) => {
  return (
    <span>
      {chain.metaData.status === 'online' ? (
        <span style={{ color: tokens.kda.foundation.color.semantic.positive.n50 }}>(Online)</span>
      ) : chain.metaData.status === 'syncing' ? (
        <span style={{ color: tokens.kda.foundation.color.semantic.info.n50 }}>(Syncing)</span>
      ) : (
        <span style={{ color: tokens.kda.foundation.color.semantic.negative.n50 }}>(Offline)</span>
      )}
    </span>
  )
}

export const DataIndicator = ({ value, max, color }: { value: number; max: number; color: string }) => {
  useAppState((state) => state.ux);
  const uxHandlers = storeHandlers().ux;

  return (
    <div className={styles.barWrapper} style={{ backgroundColor: convertColorToBackgroundSubtleColor(color, undefined, uxHandlers.isDarkMode()) }}>
      <div className={styles.bar} style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
    </div>
  )
}

export const TransactionsGraph = ({
  chartId,
  chainId,
  className,
  title,
  options = {},
}: {
  chartId: string;
  chainId?: number;
  className?: string;
  title: string;
  options?: GraphOptions;
}) => {
  const chainHandlers = storeHandlers().chains;

  const data = chainId
    ? chainHandlers.getGraphData('newTxns', chainId)
    : chainHandlers.getGraphAllDataAccumulatedChains('newTxns')
  ;

  return (
    <div
      className={[styles.boxGraphWrapper, className].filter(Boolean).join(' ')}
      style={{ background: createGradient(options.background || {}) }}
    >
      <h4 className={styles.graphTitle}>{title}</h4>
      <LinesGraph chartId={chartId} chainId={chainId} title={title} data={data} options={{ ...options, color: { line: tokens.kda.foundation.color.categorical.category1.default } }} />
    </div>
  );
}

export const BlocksGraph = ({ options, className }: { options?: LineGraphOptions; className?: string }) => {
  const chainHandlers = storeHandlers().chains;
  const data = chainHandlers.getGraphAllDataAccumulatedChains('newBlocks');
  const title = chainHandlers.getGraphTitle('newBlocks', 'description');

  if (!data) return <div className={[styles.boxGraphWrapper, className].filter(Boolean).join(' ')}>No data</div>;

  return <div className={[styles.boxGraphWrapper, className].filter(Boolean).join(' ')}>
    <LinesGraph chartId="blocks-graph" title={title} data={data} options={{ ...options, color: { line: tokens.kda.foundation.color.categorical.category2.default } }} />
  </div>;
}

export const AddressesGraph = ({ options, className }: { options?: LineGraphOptions; className?: string }) => {
  const chainHandlers = storeHandlers().chains;
  const data = chainHandlers.getGraphAllDataAccumulatedChains('newAccounts');
  const title = chainHandlers.getGraphTitle('newAccounts', 'description');

  if (!data) return <div className={[styles.boxGraphWrapper, className].filter(Boolean).join(' ')}>No data</div>;

  return <div className={[styles.boxGraphWrapper, className].filter(Boolean).join(' ')}>
    <LinesGraph chartId="addresses-graph" title={title} data={data} options={{ ...options, color: { line: tokens.kda.foundation.color.categorical.category3.default } }} />
  </div>;
}

export const ChainsGraph = ({
  chainCount,
  activeChainCount,
  className
}: {
  chainCount: number;
  activeChainCount: number;
  className?: string
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const deboucedRedraw = useRef(
    debounce(
      () => {
        drawGraph();
      }, 16
    )
  ).current;

  const drawGraph = () => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const centerX = width / 2;
    const centerY = height * 0.75;
    const radius = Math.min(width, height * 0.8) * 0.5;

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "gaugeGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", tokens.kda.foundation.color.semantic.negative.n50);
    gradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", tokens.kda.foundation.color.semantic.warning.n50);
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", tokens.kda.foundation.color.semantic.positive.n50);

    const backgroundArc = d3.arc()
      .innerRadius(radius - 6)
      .outerRadius(radius + 6)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    svg.append("path")
      .attr("d", backgroundArc({} as d3.DefaultArcObject)!)
      .attr("fill", tokens.kda.foundation.color.neutral.n10)
      .attr("transform", `translate(${centerX}, ${centerY})`);

    const progressArc = d3.arc()
      .innerRadius(radius - 6)
      .outerRadius(radius + 6)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + (activeChainCount / chainCount) * Math.PI);

    svg.append("path")
      .attr("d", progressArc({} as d3.DefaultArcObject)!)
      .attr("fill", "url(#gaugeGradient)")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    const needleLength = radius * 0.65;
    const needleWidth = 8;
    const needleTipLength = needleLength * 1.6;
    const needleBaseLength = needleLength * 0.2;
    const needlePath = `
      M ${-needleWidth/2} 0
      L 0 ${-needleTipLength}
      L ${needleWidth/2} 0
      L 0 ${needleBaseLength}
      Z
    `;
    const rotationAngle = (activeChainCount / chainCount) * 180 - 90;

    const progressPathArg = d3.arc()
      .innerRadius(radius - 6)
      .outerRadius(radius + 6)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2);

    const progressPath = svg.append("path")
      .attr("d", progressPathArg({} as d3.DefaultArcObject)!)
      .attr("fill", "url(#gaugeGradient)")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    progressPath.transition()
      .duration(5000)
      .ease(d3.easeCubicInOut)
      .attrTween("d", function() {
        const interpolate = d3.interpolate(0, (activeChainCount / chainCount) * Math.PI);
        const arc = (t: number) => d3.arc()
          .innerRadius(radius - 6)
          .outerRadius(radius + 6)
          .startAngle(-Math.PI / 2)
          .endAngle(-Math.PI / 2 + interpolate(t))

        return (t: number) => arc(t)({} as d3.DefaultArcObject)!;
      });

    const getComputedColor = (color: string) => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(`${color.replace('var(', '').replace(')', '')}`)
        .trim() ?? '';
    };
    const getColors = () => {
      const colorStart = getComputedColor(tokens.kda.foundation.color.semantic.negative.n50);
      const colorEnd = getComputedColor(
        activeChainCount / chainCount < 0.5
          ? tokens.kda.foundation.color.semantic.negative.n50
          : activeChainCount / chainCount < 0.75
            ? tokens.kda.foundation.color.semantic.warning.n50
            : tokens.kda.foundation.color.semantic.positive.n50
      );

      return { colorStart, colorEnd };
    }

    svg.append("path")
      .attr("d", needlePath)
      .attr("fill", getColors().colorStart)
      .attr("stroke", tokens.kda.foundation.color.neutral.n0)
      .attr("stroke-width", 1)
      .attr("transform", `translate(${centerX}, ${centerY}) rotate(-90)`)
      .transition()
      .duration(5000)
      .ease(d3.easeCubicInOut)
      .attr("transform", `translate(${centerX}, ${centerY}) rotate(${rotationAngle})`)
      .attr("fill", getColors().colorEnd)
    ;


    Array.from({ length: chainCount + 1 }, (_, index) => {
      const value = index / chainCount;
      const angle = -Math.PI + value * Math.PI;
      const innerRadius = radius * 0.8;
      const outerRadius = radius * 0.95;

      if (index === 0 || index === chainCount) return;

      svg.append("line")
        .attr("x1", centerX + Math.cos(angle) * innerRadius)
        .attr("y1", centerY + Math.sin(angle) * innerRadius)
        .attr("x2", centerX + Math.cos(angle) * outerRadius)
        .attr("y2", centerY + Math.sin(angle) * outerRadius)
        .attr("stroke", tokens.kda.foundation.color.neutral.n0)
        .attr("stroke-width", 2)
    });
  };

  useEffect(() => {
    deboucedRedraw();
  }, [chainCount, activeChainCount]);

  useEffect(() => {
    window.addEventListener('resize', deboucedRedraw);

    return () => window.removeEventListener('resize', deboucedRedraw);
  }, []);

  return (
    <div className={[styles.boxGraphWrapper, className].filter(Boolean).join(' ')}>
      <svg width="100%" height="100%" ref={svgRef} preserveAspectRatio="none"></svg>
    </div>
  );
}

export const LinesGraph = ({
  chartId,
  title,
  chainId,
  data,
  className,
  options = {}
}: {
  chartId: string;
  data: Partial<GraphChartData>[];
  title?: string;
  chainId?: number;
  className?: string;
  options?: LineGraphOptions;
}) => {
  const uxChartState = useAppState((state) => state.ux.chart) ?? false;
  const uxHandlers = storeHandlers().ux;
  const svgRef = useRef<SVGSVGElement>(null);
  const debouncedSetChartFocusedData = useRef(
    debounce(
      (focusedData: any) => {
        uxHandlers.setChartFocusedData(focusedData);
      }, 16
    ) // ~60fps
  ).current;
  const deboucedUnsetChartFocusedData = useRef(
    debounce(
      () => {
        uxHandlers.unsetChartFocusedData();
      }, 3 * 16
    )
  ).current;

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [interactingChartId, setInteractingChartId] = useState<string | null>(null);

  let focus: d3.Selection<SVGGElement, unknown, null, undefined>;
  let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null = null;

  const margin = {
    top: options.margins?.top ?? 20,
    right: options.margins?.right ?? 20,
    bottom: options.margins?.bottom ?? 20,
    left: options.margins?.left ?? 40
  };
  const svg = d3.select(svgRef.current);

  function drawGraph(isAnimated = false) {
    if (!svgRef.current || !data || data.length === 0 || !width || !height) return;

    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const XScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);
    const YScale = d3.scaleLinear()
      .domain(d3.extent(data, d => typeof d.value === 'number' ? d.value : 0) as [number, number])
      .range([height, 0]);
    const line = d3.line<any>()
      .x((_, i) => XScale(i))
      .y(d => YScale(d.value ?? 0))
      .curve(d3.curveCardinal);
    const path = g.append("path")
      .datum(data)
      .attr("fill", options.color?.fill ?? "none")
      .attr("stroke", options.color?.line ?? tokens.kda.foundation.color.categorical.category1.default)
      .attr("stroke-width", 2)
      .attr("d", line);
    const totalLength = path.node()?.getTotalLength() || 0;

    if (isAnimated) {
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    }

    const overlay = g.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all");

    overlay
      .on("mouseenter", () => {
        const { focus: _focus, tooltip: _tooltip } = appendGraphTooltip(chartId, g, height, options);

        focus = _focus;
        tooltip = _tooltip;

        setInteractingChartId(chartId);
      })
      .on("mousemove", function(event) {
        setInteractingChartId((prevId) => prevId !== chartId ? chartId : prevId);

        const point = moveGraphTooltip(chartId, event, chainId, data, XScale, YScale, focus, tooltip);

        if (point && point.date && point.value !== undefined) {
          debouncedSetChartFocusedData({
            point: {
              index: point.index,
              date: point.date,
              value: point.value,
              chainId: chainId,
              event: {
                mouseX: point.event.mouseX,
                pageX: point.event.pageX,
                pageY: point.event.pageY,
              },
            }
          });
        }
      })
    ;

    svg.on("mouseleave", () => {
      d3.selectAll(".tooltip").remove();
      svg.selectAll(".focus.proxy").remove();
      deboucedUnsetChartFocusedData();
      setInteractingChartId(null)
    });
  }

  useEffect(() => {
    if (
      (
        (chainId && uxChartState.focusedData?.point?.chainId !== chainId) ||
        !chainId ||
        interactingChartId !== chartId
      ) &&
      svgRef.current!.clientWidth &&
      svgRef.current!.clientHeight
    ) {
      const focusedData = uxChartState.focusedData;
      const hoveredSVG = document.querySelector('svg:hover');
      const hoveredChartId = hoveredSVG?.closest('div[id]')?.id;

      if (hoveredChartId) {
        if (hoveredChartId !== chartId) {
          svg.selectAll(".focus").remove();
        } else if (!chainId) {
          hoveredSVG?.querySelectorAll(".focus").forEach(el => el.remove());
        }
      } else {
        svg.selectAll(".focus").remove();
      }

      if (focusedData?.point && data && data.length > 0 && svgRef.current!.clientWidth && svgRef.current!.clientHeight) {
        const pointIndex = data.findIndex(d => d.date === focusedData?.point?.date);

        if (pointIndex !== -1) {
          const { focus: _focus, tooltip: _tooltip } = appendGraphTooltip(chartId, svg.select('g'), svgRef.current!.clientHeight - margin.top - margin.bottom, options);

          focus = _focus;
          tooltip = _tooltip;

          if (tooltip.node()?.getAttribute("id") !== interactingChartId + "-tooltip") {
            tooltip
              .classed("proxy", true);
          }

          proxyGraphTooltip(
            chartId,
            focusedData.point,
            data,
            d3.scaleLinear().domain([0, data.length - 1]).range([0, svgRef.current!.clientWidth - margin.left - margin.right]),
            d3.scaleLinear().domain(d3.extent(data, d => typeof d.value === 'number' ? d.value : 0) as [number, number]).range([svgRef.current!.clientHeight - margin.top - margin.bottom, 0]),
            { width: svgRef.current!.clientWidth - margin.left - margin.right, height: svgRef.current!.clientHeight - margin.top - margin.bottom },
            focus,
            tooltip,
          );
        } else {
          d3.selectAll(".tooltip.proxy").remove();
        }
      }
    }
  }, [uxChartState.focusedData, svgRef.current?.clientWidth, svgRef.current?.clientHeight, interactingChartId]);

  useEffect(() => {
    if (!uxChartState.isMovingOverChart) {
      d3.selectAll(".tooltip").remove();
      svg.selectAll(".focus").remove();
    }
  }, [uxChartState.isMovingOverChart]);

  useEffect(() => {
    drawGraph();
  }, [width, height]);

  useEffect(() => {
    drawGraph(true);
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        setWidth(svgRef.current.clientWidth - margin.left - margin.right);
        setHeight(svgRef.current.clientHeight - margin.top - margin.bottom);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      setWidth(svgRef.current.clientWidth - margin.left - margin.right);
      setHeight(svgRef.current.clientHeight - margin.top - margin.bottom);
    }
  }, [svgRef.current?.clientWidth, svgRef.current?.clientHeight]);

  return <div id={chartId} className={[styles.boxGraphWrapper, className].filter(Boolean).join(' ')}>
    { title ? <h4 className={styles.graphTitle}>{title}</h4> : null }
    <svg width="100%" height="100%" ref={svgRef} preserveAspectRatio="none"></svg>
  </div>;
};

export const ProgressBar = ({ className }: { className?: string }) => {
  const uxTimeState = useAppState((state) => state.ux.time.services);
  const uxLoadingState = useAppState((state) => Object.values(state.ux.chains).some(chain => chain.isLoading));
  const uxHandlers = storeHandlers().ux;

  const [, setTick] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!uxLoadingState) {
      setIsResetting(true);
      setProgress(0);

      timer = setTimeout(() => {
        setIsResetting(false);
        setProgress(100);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [uxLoadingState]);

  useEffect(() => {
    if (progress === 100) setTick((prev) => prev + 1);
  }, [progress]);

  return (
    <div className={className} style={{ backgroundColor: convertColorToBackgroundSubtleColor('rgb(74, 144, 121)', undefined, uxHandlers.isDarkMode()) }}>
      <div className={headerStyles.progressBarInner} style={{
        backgroundColor: tokens.kda.foundation.color.brand.primary.n50,
        width: `${progress}%`,
        transition: isResetting ? 'unset' : `width ${uxTimeState.refreshInterval}ms linear`
      }} />
    </div>
  )
};
