import type { IAddContractProps } from '@/services/createContract';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { withOrgAdmin } from '../../../withAuth';

// Define recursive schema for layout components
const BaseComponentSchema: z.ZodTypeAny = z.lazy(() =>
  z.union([
    z.object({
      type: z.literal('div'),
      props: z.object({
        style: z.record(z.string(), z.string()).optional(),
      }),
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      children: z.array(ComponentSchema).optional(),
    }),
    z.object({
      type: z.literal('Text'),
      props: z.object({
        value: z.string(),
      }),
    }),
    z.object({
      type: z.literal('Number'),
      props: z.object({
        value: z.number(),
      }),
    }),
    z.object({
      type: z.literal('List'),
      props: z.object({
        items: z.array(
          z.union([
            z.object({
              type: z.literal('Text'),
              props: z.object({
                value: z.string(),
              }),
            }),
            z.object({
              type: z.literal('Number'),
              props: z.object({
                value: z.number(),
              }),
            }),
          ]),
        ),
      }),
    }),
    z.object({
      type: z.literal('Image'),
      props: z.object({
        src: z.string(),
      }),
    }),
    z.object({
      type: z.literal('ImageCarousel'),
      props: z.object({
        images: z.array(z.string()),
      }),
    }),
  ]),
);

const ComponentSchema = z.object({
  component: BaseComponentSchema,
});

// Define a permissive schema for the output JSON
// Since the input JSON can have any structure, we use z.record to accept any key-value pairs
const outputSchema = z.object({}).passthrough().describe(`
  A reordered version of the input JSON object where:
  - The most important or identifying properties (e.g., id, name, title) are placed at the top.
  - Related properties (e.g., contact info, dates, metrics) are grouped together.
  - if needed nested properties can be added in an array to be shown as a list
  - Nested objects or arrays may be reordered if it improves clarity, but the focus is on top-level properties.
`);

const _POST = async (request: NextRequest) => {
  const { ...data } = (await request.json()) as IAddContractProps & {
    accountAddress: string;
  };
  const organisationId = new URL(request.url).searchParams.get(
    'organisationId',
  );

  if (!data || !organisationId) {
    return new Response('Not correct Data', {
      status: 401,
      statusText: 'Not correct Data',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const jsonString = JSON.stringify(data, null, 2);

  const prompt = `
You are an expert data organizer. I have a JSON object with unknown content, structure, and keys. Your task is to reorganize this JSON object into a logical, intuitive, and hierarchical structure that groups related fields together, improves readability, and enhances usability. Follow these guidelines:

Analyze the Content: Examine the keys and values to identify themes or categories (e.g., identification, specifications, features, history, pricing).
Group Related Fields: Cluster fields that logically belong together into nested objects. For example, group car specifications like "make," "model," and "year" under a "general" or "identification" object, or group house details like "bedrooms" and "bathrooms" under "propertyDetails."
Maintain Hierarchy: Use nested objects to reflect relationships between data (e.g., "engine" details like "horsepower" and "cylinders" should stay under "engine").
Preserve All Data: Do not remove or alter any keys, values, or nested structures unless they are redundant or empty.
Standardize Naming (Optional): If keys have inconsistent naming (e.g., "yearBuilt" vs. "year_built"), suggest a consistent convention (e.g., camelCase or snake_case) but keep original names unless instructed otherwise.
Handle Arrays and Nested Objects: Retain arrays (e.g., lists of features or history records) and nested objects as they are, but group them logically if they relate to other fields.
Prioritize Readability: Order fields in a way that makes sense for the context (e.g., general info first, followed by specifics, then history or features).
Explain Your Choices: Provide a brief explanation of why you grouped fields in a particular way, highlighting the logic behind the structure.
Handle Unknown Content: Since the JSON content is unknown, make no assumptions about specific keys or values. Use the structure and semantics of the keys to infer relationships.
Output Format: Return the reorganized JSON object in a code block, followed by a short explanation of the reorganization logic.

JSON to analyze:
${jsonString}
`;

  const { object: reorderedData } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: outputSchema,
    prompt,
  });
  console.log(reorderedData);

  // Prompt for layout based on reordered object
  const layoutPrompt = `
As a highly skilled and creative UI designer, create a JSON object representing a frontend layout to display an ordered JSON data object in a clean, modern, and visually appealing way. The layout must use CSS flexbox with \`display: flex\` and adhere to the following rules to ensure an intuitive and aesthetically pleasing user experience:

1. **Structure**: The layout is a nested structure with:
   - "stack" objects representing containers with a \`direction\` property ("row" or "column") for flexible arrangement.
   - "component" objects representing individual data display elements, designed for clarity and visual harmony.
2. **Root Layout**: The root is a stack with \`direction: "column"\`, serving as the main container for the entire layout.
3. **Two-Column Design**: Stacks with \`direction: "row"\` can contain up to two stacks with \`direction: "column"\` for a balanced two-column layout, or full-width components for emphasis on key data.
4. **Component Flexibility**: Components can be full-width (\`width: "100%"\`) for prominent data or within a column (\`flex: 1\` or a defined width) for compact, side-by-side presentation.
5. **Component Properties**: Each component includes a \`props\` object with the following properties (and ONLY these properties):
  - \`type\`: "text" (for strings/numbers), "list" (for arrays), or "key-value" (for objects) to match the data type.
  - \`style\`: An object with CSS properties. only use CSS properties that have to do with a flex layout.
6. **Creative UI Design**:
  - Group related data (e.g., "identification", "pricing") into stacks to create logical sections.
  - For lists, ensure a compact, bullet-point style for readability.
  - For nested objects, break them into sub-stacks with clear hierarchy.
7. **Dynamic Data Handling**: Handle any JSON input dynamically, ensuring all keys are represented. For example:
  - Strings/numbers use \`type: "text"\` with \`value\` set to the data.
  - Arrays use \`type: "list"\` with \`value\` set to the array.
  - Objects use \`type: "key-value"\` for simple key-value pairs or nested stacks for complex objects, with \`value\` set to the object or its properties.
8. **Responsive and Balanced Layout**:
  - Ensure two-column layouts are balanced, with equal \`flex: 1\` for columns unless specific widths are needed.
  - Use full-width components for high-priority data (e.g., pricing or features) to draw attention.
  - Maintain a maximum of two columns per row to avoid clutter and ensure responsiveness.
9. **Component ATTRIBUTES**: Each component includes a \` the following attributes :
  - \`value\`: The actual data value from the JSON (e.g., "123 Main St, Springfield, USA" or 350000).
  - \`label\`: A clear, human-readable label for the data (e.g., "Address").
  - \`propName\`: The JSON key or path using dot notation for nested keys (e.g., "identification.address").
10. **Example Input JSON**:
{
  "identification": {
    "address": "123 Main St, Springfield, USA",
    "owner": "John Doe"
  },
  "propertyDetails": {
    "size": "2000 sqft",
    "bedrooms": 4,
    "bathrooms": 3,
    "yearBuilt": 1995
  },
  "features": ["Garage", "Swimming Pool", "Garden"],
  "pricing": {
    "value": 350000
  }
}
11. **Example Output JSON**:
{
  "type": "stack",
  "direction": "column",
  "props": {
    "style": { "display": "flex", "flexDirection": "column" },
  },
  "children": [
    {
      "type": "stack",
      "direction": "row",
      "props": {
        "style": { "display": "flex", "flexDirection": "row", "gap": "16px" },
      },
      "children": [
        {
          "type": "stack",
          "direction": "column",
          "props": {
            "style": { "display": "flex", "flexDirection": "column", "flex": 1 },
          },
          "children": [
            {
              "type": "text",
              "value": "123 Main St, Springfield, USA",
              "propName": "identification.address",
              "label": "Address"
            },
            {
              "type": "text",
              "value": "John Doe",
              "propName": "identification.owner",
              "label": "Owner"
            }
          ]
        },
        {
          "type": "stack",
          "direction": "column",
          "props": {
            "style": { "display": "flex", "flexDirection": "column", "flex": 1 },
          },
          "children": [
            {
              "type": "text",
              "value": "2000 sqft",
              "propName": "propertyDetails.size",
              "label": "Size"
            },
            {
              "type": "text",
              "value": 4,
              "propName": "propertyDetails.bedrooms",
              "label": "Bedrooms"
            }
          ]
        }
      ]
    },
    {
      "type": "stack",
      "direction": "column",
      "props": {
        "style": { "display": "flex", "flexDirection": "column" },
      },
      "children": [
        {
          "type": "list",
          "value": ["Garage", "Swimming Pool", "Garden"],
          "propName": "features",
          "label": "Features",
          "props": {
            "style": { "width": "100%" }
          }
        },
        {
          "type": "text",
          "value": 350000,
          "propName": "pricing.value",
          "label": "Price",
          "props": {
            "style": { "width": "100%" }
          }
        }
      ]
    }
  ]
}

make sure that all the quotes are in the correct place and that the JSON is valid.
make sure that ALL properties of the original JSON are represented in the layout.

JSON:
${JSON.stringify(reorderedData, null, 2)}
`;

  // Generate layout object
  const { object: layoutObject } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: z.object({}).passthrough(), //

    prompt: layoutPrompt,
  });

  return new Response(JSON.stringify(layoutObject), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST = withOrgAdmin(_POST);
