import { getFrontmatter, getFrontmatterFromTsx } from './../getFrontmatter';

describe('utils getFrontmatter', () => {
  it('should return json of frontmatter from Markdown content', async () => {
    const content = `---
  title: test 
  description: description here
---

# title here  
and more content
    `;

    const result = await getFrontmatter(content);
    const exptectedResult = {
      title: 'test',
      description: 'description here',
    };

    expect(result).toStrictEqual(exptectedResult);
  });
  it('should return undefined if there is no frontmatter in content', async () => {
    const content = `
# title here  
and more content
`;

    const result = await getFrontmatter(content);
    const exptectedResult = undefined;

    expect(result).toStrictEqual(exptectedResult);
  });
});

describe('utils getFrontmatterFromTsx', () => {
  it('should return json of frontmatter from TSX content', async () => {
    const content = `import type { IMostPopularPage } from '@/MostPopularData';
     
    const Home: FC<IProps> = ({ popularPages }) => {
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
            title: 'test',
            description: 'description here TSX",
          },
        },
      };
    };
    
    export default Home;
    `;

    const result = await getFrontmatterFromTsx(content);
    const exptectedResult = {
      title: 'test',
      description: 'description here TSX',
    };

    expect(result).toStrictEqual(exptectedResult);
  });
  it('should return undefined if there is no frontmatter in TSX content', async () => {
    const content = `import type { IMostPopularPage } from '@/MostPopularData';
       
      const Home: FC<IProps> = ({ popularPages }) => {
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
          },
        };
      };
      
      export default Home;
      `;

    const result = await getFrontmatterFromTsx(content);
    const exptectedResult = undefined;

    expect(result).toStrictEqual(exptectedResult);
  });
});
