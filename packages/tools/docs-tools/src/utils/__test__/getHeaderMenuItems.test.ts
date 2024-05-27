import { cleanup } from '@testing-library/react';
import { isMarkDownFile } from '../markdown/isMarkdownFile';
import { getHeaderMenuItems, getPageTreeById } from './../getHeaderMenuItems';

describe('utils getHeaderMenuItems', () => {
  beforeAll(() => {
    vi.mock('fs/promises', async () => {
      const actual = (await vi.importActual('fs/promises')) as {};
      return {
        default: {
          ...actual,
          readFile: async (file: string) => {
            const fileArray = file.split('/');
            if (isMarkDownFile(file)) {
              return `---
  title: mocktitle ${fileArray.at(-1)}
  description: Kadena makes blockchain work for everyone.
  menu: mockmenu ${fileArray.at(-1)}
  label: Setup
  order: 2
  editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/tools/cookbook/README.md
  layout: full
  tags: [javascript,typescript,pact,reference,api]
---
              # Setup
              
              this is a test file`;
            }

            return `
            import type { IMostPopularPage } from '@/MostPopularData';
            import React from 'react';
            
            interface IProps {
              popularPages: IMostPopularPage[];
            }
            
            const Home: FC<IProps> = () => {
              return (
                <div>
                  content
                </div>
              );
            };
            
            export const getStaticProps: GetStaticProps = async () => {
              return {
                props: {
                  ...(await getPageConfig({
                    popularPages: '/build',
                    filename: __filename,
                  })),
                  frontmatter: {
                    title: 'mocktitle ${fileArray.at(-1)}',
                    menu: 'mockmenu ${fileArray.at(-1)}',
                    subTitle: 'Build your best ideas with us',
                    label: 'Introduction',
                    order: 1,
                    description: 'Build on Kadena',
                    layout: 'landing',
                  },
                },
              };
            };
            
            export default Home;
                        
            `;
          },
        },
      };
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('should return headerMenuItems from config', async () => {
    const result = await getHeaderMenuItems();
    const expectedResult = [
      {
        root: '/contribute',
        menu: 'mockmenu index.tsx',
        title: 'mocktitle index.tsx',
      },
      {
        root: '/test',
        menu: 'mockmenu index.md',
        title: 'mocktitle index.md',
      },
      {
        root: '/test/test2',
        menu: 'mockmenu index.md',
        title: 'mocktitle index.md',
      },
    ];

    expect(result).toStrictEqual(expectedResult);
  });
});

describe('utils getPageTreeById', () => {
  it('should return the correct pageTree by given ID', async () => {
    const id = 'contribute.ambassadors.mod';
    const expectedResult = {
      url: '/moderator',
      id: 'mod',
      file: '/contribute/ambassadors/moderator.md',
    };

    const result = await getPageTreeById(id);
    expect(result[result.length - 1]).toStrictEqual(expectedResult);
    expect(result.length).toBe(3);
  });

  it('should return the correct pageTree when given short ID', async () => {
    const id = 'contribute';

    const result = await getPageTreeById(id);
    expect(result[result.length - 1].id).toStrictEqual('contribute');
    expect(result.length).toBe(1);
  });
  it('should throw an error when id was not found', async () => {
    const id = 'contribute.skeletor';

    await expect(async () => await getPageTreeById(id)).rejects.toThrowError(
      'skeletor',
    );
  });
});
