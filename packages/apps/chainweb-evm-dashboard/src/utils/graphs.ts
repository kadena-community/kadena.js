import * as d3 from "d3";

import { LineGraphOptions } from "./types";
import { tokens } from "@kadena/kode-ui/styles";
import { __n } from "./number";
import { formatDateCompact } from "./date";
import { AccumulatedGraphChartData, GraphChartData } from "../store/chain/type";
import {EventMouseData, UX} from "../store/ux/type";

export function appendGraphTooltip(
  chartId: string,
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  height: number,
  options: LineGraphOptions = {}
) {
  const focus = g.append("g")
    .attr("class", "focus")
    .style("display", "none");

  focus.append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", height)
    .style("stroke", tokens.kda.foundation.color.neutral.n40)
    .style("stroke-width", 1)
    .style("stroke-dasharray", "3,3");

  focus.append("circle")
    .attr("class", "hover-circle")
    .attr("r", 4)
    .style("fill", options.color?.line ?? tokens.kda.foundation.color.categorical.category1.default)
    .style("stroke", "white")
    .style("stroke-width", 2);

  focus.style("display", null);

  const tooltipExists = d3.select("body").selectAll(`#${chartId}-tooltip`).nodes().length > 0;
  let tooltip = null;

  if (tooltipExists) {
    tooltip = d3.select("body").select(`#${chartId}-tooltip`) as d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    tooltip.style("opacity", 0);
  } else {
    tooltip = d3.select("body").append("div")
      .attr("id", `${chartId}-tooltip`)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", tokens.kda.foundation.color.neutral["n95@alpha80"])
      .style("color", tokens.kda.foundation.color.text.base.inverse["@init"])
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", tokens.kda.foundation.typography.fontSize.xs)
      .style("z-index", tokens.kda.foundation.zIndex.toast)
      .style("opacity", 0)
    ;
  }

  return {
    focus,
    tooltip
  };
}

export function moveGraphTooltip(
  chartId: string,
  event: MouseEvent,
  chainId: number | undefined,
  data: Partial<AccumulatedGraphChartData>[],
  XScale: d3.ScaleLinear<number, number, never>,
  YScale: d3.ScaleLinear<number, number, never>,
  focus: d3.Selection<SVGGElement, unknown, null, undefined>,
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null
): (Partial<AccumulatedGraphChartData> & {
  index: number;
  chainId: number | undefined;
  event: EventMouseData;
}) | null {
  const [mouseX] = d3.pointer(event);
  const x0 = Math.round(XScale.invert(mouseX));
  const i = Math.min(Math.max(0, x0), data.length - 1);
  const d = data[i];

  if (d && typeof d.value === 'number' && tooltip) {
    focus.attr("transform", `translate(${XScale(i)}, ${YScale(d.value)})`);
    focus.select(".x-hover-line").attr("transform", `translate(0, ${-YScale(d.value)})`);

    tooltip.style("opacity", 0.9);

    const tooltipNode = tooltip.node();
    const tooltipWidth = tooltipNode?.offsetWidth && tooltipNode.offsetWidth > 120 ? tooltipNode.offsetWidth : 120;
    const pageWidth = window.innerWidth;
    const tooltipX = event.pageX + 10 + tooltipWidth > pageWidth
      ? event.pageX - tooltipWidth - 10
      : event.pageX + 10;

    const focusX = tooltipX ?? focus.node()?.getBoundingClientRect().x ?? 0;
    let focusY = focus.node()?.getBoundingClientRect().y ?? 0;

    if (focusY < 20) {
      focusY = (event.pageY - 28);
    }

    tooltip
      .html(createTooltipHtml(d))
        .style("top", focusY + "px")
        .style("left", focusX + "px")

    if (i && d.date && d.value !== undefined) {
      return {
        index: i,
        date: d.date,
        value: d.value,
        chainId,
        event: {
          mouseX,
          pageX: event.pageX,
          pageY: event.pageY,
        },
      };
    }
  }

  return null
}

export function proxyGraphTooltip(
  chartId: string,
  pointData: UX['chart']['focusedData']['point'],
  data: Partial<AccumulatedGraphChartData>[],
  XScale: d3.ScaleLinear<number, number, never>,
  YScale: d3.ScaleLinear<number, number, never>,
  dimensions: { width: number; height: number },
  focus: d3.Selection<SVGGElement, unknown, null, undefined>,
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null
) {
  if (!pointData || !data || !XScale || !YScale || !focus || !tooltip) {
    return;
  }

  const dateIndex = data.findIndex((item) => item.date === pointData.date);
  const x0 = dateIndex !== -1 ? dateIndex : 0;
  const d = data.find((item) => item.date === pointData?.date);
  const i = Math.min(Math.max(0, x0), data.length - 1);

  if (d && typeof d.value === 'number' && tooltip) {
    focus.attr("transform", `translate(${XScale(i)}, ${YScale(d.value)})`);
    focus.select(".x-hover-line").attr("transform", `translate(0, ${-YScale(d.value)})`);

    tooltip
      .style("opacity", 0.9);

    const focusX = focus.node()?.getBoundingClientRect().x ?? 0;
    const focusY = focus.node()?.getBoundingClientRect().y ?? 0;

    const tooltipNode = tooltip.node();
    const tooltipWidth = tooltipNode?.offsetWidth && tooltipNode.offsetWidth > 120 ? tooltipNode.offsetWidth : 120;
    const pageWidth = window.innerWidth;
    const tooltipX = focusX + 10 + tooltipWidth > pageWidth
      ? focusX - tooltipWidth - 10
      : focusX + 10;

    tooltip
      .html(createTooltipHtml(d))
      .style("left", tooltipX + "px")
      .style("top", focusY + "px");
  }
}

function createTooltipHtml(d: Partial<AccumulatedGraphChartData>) {
  if (!d || d.value === undefined) return '';

  return `
    <div>Value: ${__n(Number(d.value))}</div>
    ${d.date ? `<div>Time: ${formatDateCompact(new Date(d.date))}</div>` : ''}
  `;
}
