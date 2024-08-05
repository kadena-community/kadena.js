import { objectToDataRenderComponentFields } from '../objectToDataRenderComponentFields';

describe('objectToDataRenderComponentFields', () => {
  it('should create a key value array from the given object', () => {
    const obj = {
      heman: {
        name: 'He-Man',
        alterEgo: 'Prince Adam',
      },
      cringer: {
        name: 'Cringer',
        alterEgo: 'Battle Cat',
      },
    };

    const expectedResult: any[] = [
      {
        key: 'heman',
        value: '{"name":"He-Man","alterEgo":"Prince Adam"}',
      },
      {
        key: 'cringer',
        value: '{"name":"Cringer","alterEgo":"Battle Cat"}',
      },
    ];
    const result = objectToDataRenderComponentFields(obj);
    expect(result).toEqual(expectedResult);
  });
});
