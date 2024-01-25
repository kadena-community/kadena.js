interface IAccount {
  name: string;
  waccount: string;
  caccount: string;
  publicKey: string;
  cid: string;
}

type ToastType = 'error' | 'success' | 'info';
interface IToast {
  type: ToastType;
  message: string;
}

type IDataHook<T> = (...args: any) => {
  isLoading: boolean;
  error?: IError;
  data: T;
};

interface IProofOfUs {
  tokenId: string;
  date: number;
  minted?: number;
  signees: IProofOfUsSignee[];
  avatar: {
    background?: string;
    lines: ICanvasPath[];
  };
}

interface IError {
  message: string;
}

type IProofOfUsSignee = Pick<IAccount, 'name' | 'publicKey' | 'cid'> & {
  initiator: boolean;
};

type IExportImageType = 'jpeg' | 'png';

interface IPoint {
  readonly x: number;
  readonly y: number;
}

interface ICanvasPath {
  readonly paths: IPoint[];
  readonly strokeWidth: number;
  readonly strokeColor: string;
  readonly drawMode: boolean;
  readonly startTimestamp?: number;
  readonly endTimestamp?: number;
}

interface IReactSketchCanvasRef {
  eraseMode: (_erase: boolean) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  exportImage: (imageType: IExportImageType) => Promise<string>;
  exportSvg: () => Promise<string>;
  exportPaths: () => Promise<ICanvasPath[]>;
  loadPaths: (paths: ICanvasPath[]) => void;
  getSketchingTime: () => Promise<number>;
  resetCanvas: () => void;
}
