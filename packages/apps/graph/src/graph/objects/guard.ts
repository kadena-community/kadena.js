import { builder } from '../builder';
import JsonString from './json-string';
import Keyset from './keyset';

export default builder.unionType('Guard', {
  description: 'A guard',
  types: [Keyset, JsonString],
  resolveType(guard) {
    if ('keys' in guard) {
      return Keyset.name;
    } else {
      return JsonString.name;
    }
  },
});
