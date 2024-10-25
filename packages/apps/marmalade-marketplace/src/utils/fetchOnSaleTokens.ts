import { NonFungibleTokenBalance } from '@/graphql/queries/client';
import { database } from '@/utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Dispatch, SetStateAction } from 'react';

export const fetchOnSaleTokens = async (
  accountName: string,
  cb: Dispatch<SetStateAction<NonFungibleTokenBalance[]>>,
) => {
  if (accountName) {
    //const querySnapshot = await getDocs(query(collection(database, 'sales')));
    const salesRef = collection(database, 'sales');
    const q = await query(salesRef, where('seller.account', '==', accountName));
    const querySnapshot = await getDocs(q);

    const docs: NonFungibleTokenBalance[] = [];
    querySnapshot.forEach((doc) => {
      docs.push(doc.data() as NonFungibleTokenBalance);
    });
    cb(docs);
  }
};
