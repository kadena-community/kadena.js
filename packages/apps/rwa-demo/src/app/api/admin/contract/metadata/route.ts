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
Analyze the following JSON object. Reorder its properties (attributes) in a logical order:
- Place the most important or identifying properties at the top (e.g., id, name, title, etc based on context).
- Group related properties together (e.g., contact info, dates, metrics).
- Output ONLY the reordered JSON object as valid JSON. Do not include any explanations or additional text.
- make ABSOLUTELY SURE that the value of properties (attributes) are NOT changed in any way.

JSON to analyze:
${jsonString}
`;

  const { object: reorderedData } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: outputSchema,
    prompt,
  });

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
- Root is a Stack with flexDirection: 'column' for overall stacking.
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
- Max 2 columns wide (use flexDirection: 'row' for side-by-side, with flex: 1 or widths).
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
- generate a good label name for the attribute name (e.g., 'firstName' -> 'First Name', 'dob' -> 'Date of Birth', etc) and add that as a prop (named: 'label') of the eventual component


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
