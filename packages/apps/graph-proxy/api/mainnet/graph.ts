import { createHandler } from '../../utils/handler';

const GRAPHQL_ENDPOINT = process.env.GRAPH_ENDPOINT ?? ''; // Replace with your GraphQL server URL

const handler = createHandler(GRAPHQL_ENDPOINT);

export default handler;
