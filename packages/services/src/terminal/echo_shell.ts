import { JSONPrimitive } from '@lumino/coreutils';
import { Signal } from '@lumino/signaling';

import { IMessage, ITerminalConnection } from './terminal';

import { Shell } from './cockle_index'
import { JupyterFileSystem } from './jupyter_file_system'

export class EchoShell {
  constructor(signal: Signal<ITerminalConnection, IMessage>) {
    console.log('==> EchoShell constructor'); // Why do I see two of these?
    this._current_line = '';
    this._prompt = '\x1b[1;31mjs-shell:$\x1b[1;0m '; // red color.
    this._signal = signal;
  }

  _initialize(): void {
    if (this._shell) return;

    // to create Shell object, need a JupyterFileSystem which needs a Contents.IManager
    // In dev-mode only
    const w = window as any
    const contentsManager = w.jupyterapp.serviceManager.contents as any
    console.log("CONTENTS MANAGER", contentsManager)

    const fs = new JupyterFileSystem(contentsManager)
    this._shell = new Shell(fs)

    if (this._prompt) {
      this.send_stdout([this._prompt]);
    }
  }

  // For jupyter-server-terminals it is terminado that handles messages.
  async receive(message: IMessage) {
    if (!this._shell) {
      this._initialize();
    }

    //console.log("message_type", message.type);
    if (message.type == 'set_size') {
    } else if (message.type == 'stdin') {
      if (message.content) {
        const char = message.content[0] as string;
        const code = char.charCodeAt(0);
        //console.log("CHARACTER", char, char.charCodeAt(0))

        // Also need to handle arrow keys, delete, etc.
        // See https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797
        if (code == 13) {
          this.send_stdout(['\r\n']);

          const res = await this._run_command(this._current_line);
          if (res) {
            const split = res.split('\n');
            const joined = split.join('\r\n');
            this.send_stdout([joined + '\r\n']);
          }
          this._current_line = '';

          this.send_stdout([this._prompt]);
        } else if (code == 127) {
          console.log('BACKSPACE');
          if (this._current_line.length > 0) {
            this._current_line = this._current_line.slice(0, -1);
          }
          this.send_stdout([
            '\x1B[0G' + this._prompt + this._current_line + ' ' + '\x1B[1D'
          ]);
        } else {
          this._current_line += char;
          // Send whole line.
          this.send_stdout(['\x1B[0G' + this._prompt + this._current_line]);
        }
      }
    }
  }

  async _run_command(command: string): Promise<string> {
    //return command.toUpperCase();
    let result: string;
    try {
      result = await this._shell!.execute(command);
    } catch (e) {
      result = e;
    }
    return result;
  }

  send_stdout(content: JSONPrimitive[]): void {
    this._signal.emit({ type: 'stdout', content });
  }

  private _current_line: string;
  private _prompt: string;
  private _signal: Signal<ITerminalConnection, IMessage>;
  private _shell?: Shell;
}
