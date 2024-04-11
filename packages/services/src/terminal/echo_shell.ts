import { JSONPrimitive } from '@lumino/coreutils';
import { Signal } from '@lumino/signaling';

import { IMessage, ITerminalConnection } from './terminal';

import bashEmulator from "bash-emulator"



export class EchoShell {
  constructor(signal: Signal<ITerminalConnection, IMessage>) {
    console.log("==> EchoShell constructor");
    this._current_line = "";
    this._prompt = "\x1b[1;31mjs-shell:$\x1b[1;0m "
    this._signal = signal;

    // Really want delayed initialisation of this.
    this._shell = bashEmulator({
      workingDirectory: '/home/someone',
      fileSystem: {
        '/': {
          type: 'dir',
          modified: Date.now(),
        },
        '/home': {
          type: 'dir',
          modified: Date.now(),
        },
        '/home/someone': {
          type: 'dir',
          modified: Date.now(),
        },
        '/home/someone/file1': {
          type: 'file',
          modified: Date.now(),
          content: 'This is the file contents',
        },
        '/home/someone/other': {
          type: 'file',
          modified: Date.now(),
          content: 'Something',
        },
        '/home/someone/subdir': {
          type: 'dir',
          modified: Date.now(),
        },
        '/home/someone/subdir/subfile': {
          type: 'file',
          modified: Date.now(),
          content: 'Blah blah',
        },
      }
    })

    /*if (this._prompt) {
      console.log("START")
      this.send_stdout([this._prompt])
    }*/
  }

  // For jupyter-server-terminals it is terminado that handles messages.
  async receive(message: IMessage) {
    //console.log("message_type", message.type);
    if (message.type == "set_size") {

    }
    else if (message.type == "stdin") {
      if (message.content) {
        const char = message.content[0] as string;

        // Also need to handle arrow keys, delete, etc.
        // See https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797
        //#if (char.charCodeAt(0) == 13) {
        if (char[0] == "\r") {
          this.send_stdout(["\r\n"]);

          const res = await this._run_command(this._current_line);
          if (res) {
            const split = res.split("\n")
            const joined = split.join("\r\n")
            this.send_stdout([joined + "\r\n"])
          }
          this._current_line = "";

          this.send_stdout([this._prompt]);
        } else {
          this._current_line += char;
          // Echo character back
          this.send_stdout([char]);
        }
      }
    }
  }

  async _run_command(command: string): Promise<string> {
    //return command.toUpperCase();
    let result: string;
    try {
      result = await this._shell.run(command);
    }
    catch(e) {
      result = e;
    }
    return result;
  }

  send_stdout(content: JSONPrimitive[]): void {
    this._signal.emit({type: "stdout", content});
  }


  private _current_line: string;
  private _prompt: string;
  private _signal: Signal<ITerminalConnection, IMessage>;
  private _shell: any;
}
