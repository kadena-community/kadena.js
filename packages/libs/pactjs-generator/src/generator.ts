import { createReadStream, PathLike, readFileSync } from 'fs';
import byline from 'byline';

interface IContractDefinition {}

export class FileContractDefinition implements IContractDefinition {
  bylineStream: byline.LineStream | undefined;

  constructor(private filePath: PathLike) {
    this.load();
    this.parse();
  }

  private load(): void {
    var stream = createReadStream(this.filePath);
    this.bylineStream = byline.createStream(stream, { keepEmptyLines: true });
  }

  private parse(): void {
    if (this.bylineStream !== undefined) {
      let lineNo: number = 0;
      this.bylineStream.on('data', function (line: Buffer) {
        lineNo++;
        if (line.toString().includes('defun')) {
          console.log(lineNo, line.toString());
        }
      });
    }
  }

  get methods() {
    return [];
  }
}

export class PactTypescriptGenerator {
  constructor(...args: IContractDefinition) {}
}
