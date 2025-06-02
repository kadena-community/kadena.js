import type { IRecord } from '@/utils/filterRemovedRecords';

export const useGetInvestor = ({ account }: { account: string }) => {
  // const [innerData, setInnerData] = useState<IRecord | undefined>();
  // const { organisation } = useOrganisation();
  // const { asset } = useAsset();
  // const store = useMemo(() => {
  //   if (!organisation) return;
  //   return RWAStore(organisation);
  // }, [organisation]);

  // useEffect(() => {
  //   const listenToAccount = (result: IRegisterIdentityProps) => {
  //     setInnerData((v: any) => {
  //       if (v) return { ...v, alias: result.alias };
  //       return {
  //         alias: result.alias,
  //         account: result.accountName,
  //       };
  //     });
  //   };

  //   const initInnerData = async () => {
  //     const data = await store?.getAccount({ account });
  //     console.log({ data });
  //     setInnerData({
  //       accountName: account,

  //       creationTime: 0,
  //     });
  //   };

  //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //   initInnerData();
  //   const off = store?.listenToAccount(account, listenToAccount, asset);
  //   return off;
  // }, [account, store, asset]);

  return { data: { accountName: account } as IRecord };
};
