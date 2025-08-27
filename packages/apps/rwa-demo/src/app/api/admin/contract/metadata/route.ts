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
Based on the following  JSON object, create a good layout for the frontend to display the data.
Use the allowed components to represent the data properties with labels (e.g., a div row with Text for key and appropriate component for value).
Infer types from values:
- Strings: Text (if looks like image URL, use Image)
- Numbers: Number
- Arrays of strings/numbers: List with Text/Number items (if image URLs, use ImageCarousel)
- Nested objects: div with sub-layout
Group related properties into rows/columns based on the ordering.
Constraints:
- children array SHOULD ALWAYS be in a 'children' array. NOT a children array in the props
  example:
    {
      type: 'Stack',
      props: { style: { display: 'flex', flexDirection: 'column' } },
      children: [  <--- children array here ---> ],
    }
  example of NOT correct: 
    {
      type: 'Stack',
      props: { style: { display: 'flex', flexDirection: 'column' }, children: [...], },
      
    }  
- The Root Stack can contain multiple Stack components with flexDirection: 'column' for full-width rows, components
  The Stack components that are direct children of the Root Stack can have flexDirection: 'row' or 'column' and if 'row' they can contain MAX 2 child Stack components for columns.
  for example this is a possible layout structure:
  - root (stack column)
    - stack (row)
      - stack (column)  <--- max 2 of these for columns
        - component (flex: 1 or width defined)
        - component (flex: 1 or width defined)
      - stack (column)  <--- max 2 of these for columns
        - component (flex: 1 or width defined)
        - component (flex: 1 or width defined)
    - component (full width)
    - stack (row)
      - component (full width)
      - component (full width)
    - stack (row)
      - stack (column)
        - component (flex: 1 or width defined)
        - component (flex: 1 or width defined)
      - stack (column)
        - component (flex: 1 or width defined) 


- Can mix: e.g., full-width row (1 column), then 2-column row.
- Use flex properties like justifyContent, alignItems as needed.
- Order components based on the reordered JSON.
- Make the layout logical and visually appealing.

Allowed components in JSON:
- Stack: { type: 'Stack',  children: [...], props: { style: { display: 'flex', flexDirection: 'row' | 'column', ... } } }
- Text: { type: 'Text', props: { value: string, label?:string } }
- Number: { type: 'Number', props: { value: number, label?:string } }
- List: { type: 'List', children?: ListItem[], props: { label?:string } }
- ListItem: { type: 'ListItem', props: { type: 'Text' | 'Number', value:string } }
- Image: { type: 'Image', props: { value: string, label?:string } }
- ImageCarousel: { type: 'ImageCarousel', children?: Image[], props: { label?:string } }
- add the name of the attribute as a prop (named: 'data-prop') of the eventual component
- when the object is a List add the name of the attribute as a prop (named: 'data-prop') as a prop of the List component
- no need to add a label component, this will be handled by the frontend
- generate a good label name for the attribute name (e.g., 'firstName' -> 'First Name', 'dob' -> 'Date of Birth', etc) and add that as a prop (named: 'label') of the eventual component.
  When there are no units available for a number in the data, do NOT make up any units by yourself

make ABSOLUTELY SURE that it returns a VALID JSON object with the layout structure as described above.
Output ONLY the JSON object for the root Stack component.

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
