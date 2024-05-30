export const checkUrlAgainstList = (
  url: string,
  urlList: IRedirect[],
): string[] => {
  const matchingUrls: string[] = [];

  for (const listItem of urlList) {
    if (listItem.source) {
      const listItemRegex = new RegExp(
        `^${listItem.source.replace(/:\w+/g, '([^/]+)')}$`,
      );
      if (listItemRegex.test(url)) {
        const sourceArray = listItem.source.split('/');
        const destinationArray = listItem.destination.split('/');
        const urlArray = url.split('/');
        let isValid = true;

        const newUrlArray = destinationArray.map((slug) => {
          if (!slug.startsWith(':')) return slug;
          const positionIdx = sourceArray.lastIndexOf(slug);

          if (!urlArray[positionIdx]) {
            isValid = false;
            return '';
          }
          return urlArray[positionIdx];
        });

        //if one of the sections is empty, do not return a url
        if (isValid) {
          const newUrl = newUrlArray.join('/');
          matchingUrls.push(newUrl);
        }
      }
    }
  }

  return matchingUrls;
};
