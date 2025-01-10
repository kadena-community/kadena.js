import { csvFileToArray } from '../csvFileToArray';

describe('csvFileToArray utils', () => {
  it('should return an array from the csv string with the correct attributes', () => {
    const csv = `account,alias
k:a57ac28aa3a80ad84908c4f7c00d91b95b9da335a623bd941e8c41897d275377,he-man
k:5132ac0629ab78326614879b62521b8f71a4eadf4eb2826d5e9757c832785782,skeletor
k:5132ac0629ab78326614879b62521b8f71a4eadf4eb2826d5e9757c832785785,cringer
k:5132ac0629ab78326614879b62521b8f71a4eadf4eb2826d5e9757c832785786,greyskull
k:5132ac0629ab78326614879b62521b8f71a4eadf4eb2826d5e9757c832785787,teela-na`;

    const result = csvFileToArray(csv);
    expect(result.length).toEqual(5);
    expect(result[0]).toEqual({
      account:
        'k:a57ac28aa3a80ad84908c4f7c00d91b95b9da335a623bd941e8c41897d275377',
      alias: 'he-man',
    });
  });
});
