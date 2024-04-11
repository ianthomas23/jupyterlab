import { JSONPrimitive } from '@lumino/coreutils';
import { Signal } from '@lumino/signaling';

import { IMessage, ITerminalConnection } from './terminal';



export class EchoShell {
  constructor(signal: Signal<ITerminalConnection, IMessage>) {
    console.log("==> EchoShell constructor");
    this._current_line = "";
    this._prompt = "\x1b[1;31mjs-shell:$\x1b[1;0m "
    this._signal = signal;

    /*if (this._prompt) {
      console.log("START")
      this.send_stdout([this._prompt])
    }*/
  }

  // For jupyter-server-terminals it is terminado that handles messages.
  async receive(message: IMessage) {
    console.log("message_type", message.type);
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
            this.send_stdout([res + "\r\n"]);
          }
          this._current_line = "";

          this.send_stdout([this._prompt]);
        } else {
          this._current_line += char;
          console.log(`char #${char}# current_line ${this._current_line}$`);
          // Echo character back
          this.send_stdout([char]);
        }
      }
    }
  }

  async _run_command(command: string): Promise<string> {
    return command.toUpperCase();
  }

  send_stdout(content: JSONPrimitive[]): void {
    this._signal.emit({type: "stdout", content});
  }


  private _current_line: string;
  private _prompt: string;
  private _signal: Signal<ITerminalConnection, IMessage>;
}
