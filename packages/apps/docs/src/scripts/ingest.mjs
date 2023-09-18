import algoliaSearch from 'algoliasearch';

import docs from '../../record.json' assert { type: "json" };


const client = algoliaSearch('BD67NIA9JD', '0e7307de57fb813aab55f7429257aa61');
const index = client.initIndex('docs_website_dev');

index.saveObjects(docs, {
  autoGenerateObjectIDIfNotExist: true
}).then(({ objectIDs }) => {
  console.log(objectIDs);
});

