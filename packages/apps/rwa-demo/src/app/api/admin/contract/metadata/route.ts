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

  1. **Analyze the Content:** Examine the keys and values to identify themes or categories (e.g., identification (title, name), specifications, features, history, pricing).
  2. **Group Related Fields:** Cluster fields that logically belong together into nested objects.
  For example, group car specifications like "make," "model," and "year" under a "general" or "identification" object, or group house details like "bedrooms" and "bathrooms" under "propertyDetails."
  8. **Prioritize Readability:** Order fields within each group in a way that makes sense for the context (e.g., general info first, followed by specifics, then history or features). Apply this recursively to all levels of nesting.
  3. **Prioritize Key Information:** After grouping related fields, order the top-level groups (and sub-groups recursively) to prioritize the most important or essential information at the top. For example, fields like "title," "image" (e.g., image URLs), and "artist" (or equivalent identifiers like "name" or "ID") should appear first, followed by core attributes (e.g., specifications, descriptions), and then secondary details (e.g., history, pricing, metadata). Infer importance based on context, prioritizing fields that uniquely identify or visually represent the entity.
  5. **Preserve All Data:** Do not remove or alter any keys, values, or nested structures unless they are redundant or empty.
  6. **Handle Arrays and Nested Objects:** Retain arrays (e.g., lists of features or history records) and nested objects as they are, but group them logically if they relate to other fields.
  7. **Nested Object Handling:** When a field contains an object, keep it as an object but recursively apply the ordering and grouping principles: order its attributes logically for readability (e.g., general info first (title, name, images), then specifics) and ensure its internal structure is logically grouped.
  9. **Readable Labels:** When reorganizing, ensure that any nested object or array of objects uses a readable, descriptive label as its key name (e.g., "engineSpecifications" instead of vague or abbreviated keys). For arrays containing objects, the array key should be a clear, human-readable label describing the collection (e.g., "accidentRecords" for a list of accident history objects).
  10. **Handle Unknown Content:** Since the JSON content is unknown, make no assumptions about specific keys or values. Use the structure and semantics of the keys to infer relationships.
  11. **Depth Limitation:** If the data is more than 3 levels deep, refactor it to a maximum of 3 levels by regrouping or flattening deeper nests into logical structures at level 3 or shallower.
  12. **Output Format:** Return the reorganized JSON object in a well-formatted, readable structure.

  JSON to analyze:
   ${jsonString}
  `;

  //8. **Explain Your Choices:** Provide a brief explanation of why you grouped fields in a particular way, highlighting the logic behind the structure.

  const { object: reorderedData } = await generateObject({
    model: openai('gpt-4o'),
    schema: outputSchema,
    prompt,
  });

  console.log('dAta:', data);
  console.log('reorderedData:', reorderedData);

  // Prompt for layout based on reordered object
  //   const layoutPrompt = `
  // As a highly skilled and creative UI designer, create a JSON object representing a frontend layout to display an ordered JSON data object in a clean, modern, and visually appealing way. The layout must use CSS flexbox with \`display: flex\` and adhere to the following rules to ensure an intuitive and aesthetically pleasing user experience:

  // 1. **Structure**:
  //    - "stack" objects representing containers with a \`direction\` property ("row" or "column") for flexible arrangement.
  //    - "component" objects representing individual data display elements, designed for clarity and visual harmony.
  // 2. **Root Layout**: The root is a stack with \`direction: "column"\`, serving as the main container for the entire layout.
  // 5. **Component Properties**: Each component includes a \`props\` object with the following properties (and ONLY these properties):
  //   - \`type\`: "text" (for strings/numbers), "list" (for arrays), or "key-value" (for objects) or "key-value-list" (for list of objects) or "image" (for an image url or image object) to match the data type.
  //   - \`style\`: An object with CSS properties. only use CSS properties that have to do with a flex layout, expect gap.
  // 6. **Creative UI Design**:
  //   - For lists, ensure a compact, bullet-point style for readability.
  //   - For nested objects, break them into sub-stacks with clear hierarchy. Keep nested objects within a single column stack for clarity.
  // 7. **Dynamic Data Handling**: Handle any JSON input dynamically, ensuring all keys are represented. For example:
  //   - Strings/numbers use \`type: "text"\` with \`value\` set to the data.
  //   - When a \`value\` is an object make the  type of the component \`"key-value"\`.
  //   - When a \`value\` is an array of objects make the type of the component \`"key-value-list"\`.
  //   - Arrays that do NOT contain objects use \`type: "list"\` with \`value\` set to the array.
  // 8. **Responsive and Balanced Layout**:
  //   - Ensure two-column layouts are balanced, with equal \`flex: 1\` for columns unless specific widths are needed.
  //   - Maintain a maximum of two columns per row to avoid clutter and ensure responsiveness.
  // 9. **Component ATTRIBUTES**: Each component includes a \` the following attributes :
  //   - \`value\`: The actual data value from the JSON (e.g., "123 Main St, Springfield, USA" or 350000).
  //   - \`label\`: A clear, human-readable label for the data (e.g., "Address").
  //   - \`propName\`: The JSON key or path using dot notation for nested keys (e.g., "identification.address").
  //   - every component must have a \`label\` when it declares a section of information and always a unique identifier \`id\`.

  // 10. **validation:**
  //   - Traverse ALL keys recursively; map every leaf value to a component.
  //   - Validation: Ensure every input key appears in a propName; no new properties.
  // 11. **Example Input JSON**:
  // {
  //   "identification": {
  //     "address": "123 Main St, Springfield, USA",
  //     "owner": "John Doe"
  //   },
  //   "propertyDetails": {
  //     "size": "2000 sqft",
  //     "bedrooms": 4,
  //     "bathrooms": 3,
  //     "yearBuilt": 1995
  //   },
  //   "features": ["Garage", "Swimming Pool", "Garden"],
  //   "pricing": {
  //     "value": 350000
  //   }
  // }
  // 12. **Example Output JSON**:
  // {
  //   "type": "stack",
  //   "direction": "column",
  //   id: "root-stack",
  //   "props": {
  //     "style": { "display": "flex", "flexDirection": "column" }
  //   },
  //   "children": [
  //     {
  //       "type": "stack",
  //       "direction": "row",
  //       id: "top-section-stack",
  //       "props": {
  //         "style": { "display": "flex", "flexDirection": "row", "gap": "16px" }
  //       },
  //       "children": [
  //         {
  //           "type": "stack",
  //           "direction": "column",
  //           label: "Identification",
  //           id: "identification-stack",
  //           "props": {
  //             "style": { "display": "flex", "flexDirection": "column", "flex": 1 }
  //           },
  //           "children": [
  //             {
  //               "type": "text",
  //               "value": "123 Main St, Springfield, USA",
  //               "propName": "identification.address",
  //               "label": "Address",
  //               "id": "identification.address-text"
  //             },
  //             {
  //               "type": "text",
  //               "value": "John Doe",
  //               "propName": "identification.owner",
  //               "label": "Owner",
  //               "id": "identification.owner-text"
  //             }
  //           ]
  //         },
  //         {
  //           "type": "stack",
  //           "direction": "column",
  //           label: "Property Details",
  //           id: "propertyDetails-stack",
  //           "props": {
  //             "style": { "display": "flex", "flexDirection": "column", "flex": 1 }
  //           },
  //           "children": [
  //             {
  //               "type": "text",
  //               "value": "2000 sqft",
  //               "propName": "propertyDetails.size",
  //               "label": "Size",
  //               "id": "propertyDetails.size-text"
  //             },
  //             {
  //               "type": "text",
  //               "value": 4,
  //               "propName": "propertyDetails.bedrooms",
  //               "label": "Bedrooms",
  //               "id": "propertyDetails.bedrooms-number"
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       "type": "stack",
  //       "direction": "column",
  //       label: "Additional Information",
  //       id: "additional-info-stack",
  //       "props": {
  //         "style": { "display": "flex", "flexDirection": "column" }
  //       },
  //       "children": [
  //         {
  //           "type": "list",
  //           "value": ["Garage", "Swimming Pool", "Garden"],
  //           "propName": "features",
  //           "label": "Features",
  //           "id": "features-list",
  //           "props": {
  //             "style": { "width": "100%" }
  //           }
  //         },
  //         {
  //           "type": "key-value-list",
  //           "label": "Service History",
  //           "id": "service-history-key-value-list",
  //           "value": [
  //             {
  //               "date": "2021-06-15",
  //               "service": "Oil Change"
  //             },
  //             {
  //               "date": "2022-06-20",
  //               "service": "Tire Rotation"
  //             }
  //           ],
  //           "propName": "features",
  //           "props": {
  //             "style": { "width": "100%" }
  //           }
  //         },
  //         {
  //           "type": "text",
  //           "value": 350000,
  //           "propName": "pricing.value",
  //           "label": "Price",
  //           "id": "pricing.value-number",
  //           "props": {
  //             "style": { "width": "100%" }
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // }

  // JSON:
  // ${JSON.stringify(reorderedData, null, 2)}
  // `;

  const layoutPrompt = `
Traferse recursively through the following JSON and enrich the data values with the following rules:
1. add a human readable label to every field that declares a section of information (e.g., "Address").
2. add a unique identifier to every field
3. add a propName to every field that declares the path to the value using dot notation for nested keys 
4. add a order attribute for every field that declares the order in which the fields should be displayed, starting from 0 and going up, use a dot notation for nested keys (e.g., "1", "1.1", "1.2", "2", "2.1")
4. add a type to every field that declares the type of data it holds, use "text" for strings, "number" for numbers, "list" for arrays, "key-value" for objects, "key-value-list" for list of objects and "image" for an image url or image object
5. if the value is an key-value, have the attributes in the correct order in an array
- make sure that all the fields still exist in the output, do not remove any fields. but DO NOT add fields either.
- make sure that the output is a valid JSON object
6. if type is a "number" and it can be formatted as a number, add a prop "shouldLocalizeFormat: true" to the props object of that field (example a year should NOT be localized. a measure of distance should).
7. make absolutely sure that the order of the fields is the same as in the input JSON, do not change the order of the fields.
example input: 
{
    "ImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    "title": "Starry Night",
    "dimensions": {
        "height": "73.7 cm",
        "width": "92.1 cm"
    },
    "exhibitionHistory": [
        {
            "exhibitionName": "Van Gogh and the Colors of the Night",
            "location": "Art Institute of Chicago",
            "year": 2005
        },
        {
            "exhibitionName": "Masterpieces of Post-Impressionism",
            "location": "Louvre Museum, Paris",
            "year": 2010
        }
    ],
    
}

example output:
{
  ImageUrl: {
    type: "image",
    value: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    label: "Image Url",
    id: "ImageUrl-image",
    propName: "ImageUrl"
  },
  title: {
    type: "text",
    value: "Starry Night",
    label: "Title",
    id: "title-text",
    propName: "title"
  },
  dimensions: {
    type: "key-value",
    label: "Dimensions",
    id: "dimensions-key-value",
    propName: "dimensions",
    value: [
      {
        type: "text",
        value: "73.7 cm",
        label: "Height",
        id: "dimensions.height-text",
        propName: "dimensions.height" 
      },
      {
        type: "text",
        value: "92.1 cm",
        label: "Width",
        id: "dimensions.width-text",
        propName: "dimensions.width"
      }
    ]
  },
  exhibitionHistory: {
    type: "key-value-list",
    label: "Exhibition History",
    id: "exhibitionHistory-key-value-list",
    propName: "exhibitionHistory",
    value: [
      {
        type: "text",
        value: "Van Gogh and the Colors of the Night",
        label: "Exhibition Name",
        id: "exhibitionHistory[0].exhibitionName-text",
        propName: "exhibitionHistory[0].exhibitionName"
      },
      {
        type: "text",
        value: "Art Institute of Chicago",
        label: "Location",
        id: "exhibitionHistory[0].location-text",
        propName: "exhibitionHistory[0].location"
        },
        {
        type: "number",
        value: 2005,
        label: "Year",
        id: "exhibitionHistory[0].year-number",
        propName: "exhibitionHistory[0].year"
      }
    ]
  }
}

JSON to analyze:
${JSON.stringify(reorderedData, null, 2)}
`;

  // Generate layout object
  const { object: layoutObject } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: z.object({}).passthrough(), //

    prompt: layoutPrompt,
  });

  console.log('layoutObject:', layoutObject);

  return new Response(JSON.stringify(layoutObject), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST = withOrgAdmin(_POST);
