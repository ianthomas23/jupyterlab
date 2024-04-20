import { IFileSystem } from './file_system';
import { parse } from './parse';

export class Shell {
  constructor(fileSystem: IFileSystem) {
    this._fileSystem = fileSystem;
  }

  async execute(source: string): Promise<string> {
    const ast = parse(source);
    const cmds = ast.commands;

    if (cmds.length >= 1 && cmds[0].length == 1 && cmds[0][0] == 'ls') {
      const filenames = await this._fileSystem.list('');
      return filenames.join(' ');
    } else if (cmds.length >= 1 && cmds[0].length == 2 && cmds[0][0] == 'rm') {
      const path = cmds[0][1];
      await this._fileSystem.delete(path);
      return '';
    } else if (
      cmds.length >= 1 &&
      cmds[0].length == 2 &&
      cmds[0][0] == 'touch'
    ) {
      const path = cmds[0][1];
      await this._fileSystem.touch(path);
      return '';
    } else {
      return source;
    }
  }

  // @ts-ignore
  private _fileSystem: IFileSystem;
}
