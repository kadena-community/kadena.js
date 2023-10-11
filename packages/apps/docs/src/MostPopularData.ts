export interface IMostPopularPage {
  path: string;
  views: number;
  title: string;
}

interface IDimensionValue {
  /** DimensionValue value */
  value?: string;
}

interface IMetricValue {
  /** MetricValue value */
  value?: string;
}

export interface IRow {
  /** Row dimensionValues */
  dimensionValues?: IDimensionValue[];

  /** Row metricValues */
  metricValues?: IMetricValue[];
}

export interface IRunReportResponse {
  rows?: IRow[];
  /** RunReportResponse rowCount */
  rowCount?: number;
}
