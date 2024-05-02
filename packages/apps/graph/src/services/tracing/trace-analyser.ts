import { Command, Option } from 'commander';
import { readFileSync } from 'fs';
import { dotenv } from '../../utils/dotenv';

new Command()
  .command('trace-analyser')
  .description(`Analyse the ${dotenv.TRACING_LOG_FILENAME} file`)
  .addOption(
    new Option(
      '-l, --limit <number>',
      'Limit the number of queries to display',
    ),
  )
  .addOption(
    new Option(
      '-s, --sort <string>',
      'Sort the queries by the given property',
    ).default('median'),
  )
  .action(
    async (args: {
      sort:
        | 'query'
        | 'count'
        | 'median'
        | 'average'
        | 'max'
        | 'min'
        | 'stdDeviation';
      limit?: number;
    }) => {
      try {
        readFileSync(dotenv.TRACING_LOG_FILENAME);
      } catch (err) {
        console.error(
          `\n >>> Failure in reading the ${dotenv.TRACING_LOG_FILENAME} file. If you don't have a trace file yet, then enable tracing first. See the README for more information.\n`,
        );
        return;
      }

      const traces = readFileSync(dotenv.TRACING_LOG_FILENAME, 'utf8')
        .split('\n')
        .filter((line) => line !== '')
        .map((line) => {
          const [query, duration] = line.split(',');
          return { query, duration: parseFloat(duration) };
        });

      const queryStats = traces.reduce(
        (acc, trace) => {
          acc[trace.query].push(trace.duration);
          return acc;
        },
        {} as Record<string, number[]>,
      );

      const result = [];

      // Calculate statistics for each query
      // eslint-disable-next-line guard-for-in
      for (const query in queryStats) {
        const durations = queryStats[query].sort((a, b) => a - b);
        const count = durations.length;
        const sum = durations.reduce((a, b) => a + b, 0);
        const average = sum / count;
        const median =
          count % 2 === 0
            ? (durations[count / 2 - 1] + durations[count / 2]) / 2
            : durations[Math.floor(count / 2)];
        const max = Math.max(...durations);
        const min = Math.min(...durations);
        const stdDeviation = Math.sqrt(
          durations.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) /
            count,
        );

        result.push({
          query,
          count,
          median,
          average,
          max,
          min,
          stdDeviation,
        });
      }

      let sortedResult = [];

      if (!(args.sort in result[0])) {
        sortedResult = result.sort((a, b) => b.median - a.median);
      } else {
        // @ts-ignore
        sortedResult = result.sort((a, b) => b[args.sort] - a[args.sort]);
      }

      // Calculate p95 duration
      const allDurations = traces
        .map((trace) => trace.duration)
        .sort((a, b) => a - b);
      const p95 = percentile(0.95, allDurations);

      // Find queries with the slowest duration
      const slowestQueries = sortedResult.slice(
        0,
        Math.min(10, sortedResult.length),
      );

      // Print results
      console.log('Per Query Statistics:');
      console.table(
        !args.limit ? sortedResult : sortedResult.slice(0, args.limit),
      );
      if (args.limit && sortedResult.length > args.limit) {
        console.log(`and ${sortedResult.length - args.limit} more`);
      }

      console.log(`\nOverall p95 Duration: ${p95} ms`);
      console.log('\nTop 10 slowest queries:');
      console.table(slowestQueries);
    },
  )
  .parse();

export function percentile(p: number, values: number[]): number {
  if (p < 0 || p > 1) {
    throw new Error('p must be between 0 and 1');
  }

  const i = p * (values.length - 1);
  const floored = Math.floor(i);

  if (floored === i) {
    return values[i];
  }

  const decimal = i - floored;
  const difference = values[floored + 1] - values[floored];
  return values[floored] + difference * decimal;
}
