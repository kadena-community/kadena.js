enum NetworkTypes {
  Mainnet = Mainnet,
  Testnet = Testnet,
}

interface IMenuConfigItem {
  label: string;
  children: { url: string; label: string }[];
}

type IMenuConfig = IMenuConfigItem[];
