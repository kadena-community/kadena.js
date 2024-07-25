import { formatJson } from '../formatJson';

describe('formatJson', () => {
  it('should return formated json if json is given', () => {
    const json =
      '{"id": 1, "name": "He-man", "jobTitle": "Master of the Universe"}';
    const expectedResult = `{
  "id": 1,
  "name": "He-man",
  "jobTitle": "Master of the Universe"
}`;
    const result = formatJson(json);

    expect(result).toEqual(expectedResult);
  });

  it('should return the given string if json is malformatted', () => {
    const json = "{ id: 'Not formatted with quotes' }";

    const result = formatJson(json);

    expect(result).toEqual(json);
  });

  it('should return the empty if empty string is given', () => {
    const result = formatJson('');

    expect(result).toEqual('');
  });
});
