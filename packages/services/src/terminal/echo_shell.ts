import { JSONPrimitive } from '@lumino/coreutils';
import { Signal } from '@lumino/signaling';

import { IMessage, ITerminalConnection } from './terminal';



export class EchoShell {
  constructor(signal: Signal<ITerminalConnection, IMessage>) {
    console.log("==> EchoShell constructor");
    this._current_line = "";
    this._prompt = "js-shell:$ "
    this._signal = signal;

    /*if (this._prompt) {
      console.log("START")
      this.send_stdout([this._prompt])
    }*/
  }

  // For jupyter-server-terminals it is terminado that handles messages.
  receive(message: IMessage): void {
    console.log("message_type", message.type);
    if (message.type == "set_size") {

    }
    else if (message.type == "stdin") {
      if (message.content) {
        const char = message.content[0] as string;
        if (char.charCodeAt(0) == 13) {
          this.send_stdout(["\r\n"]);

          // await results of running command.
          const res = this._run_command(this._current_line);
          if (res) {
            this.send_stdout([res + "\r\n"]);
          }

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

  _run_command(command: string): string {

    return "COMMAND RESULT";

  }

  send_stdout(content: JSONPrimitive[]): void {
    this._signal.emit({type: "stdout", content});
  }


  private _current_line: string;
  private _prompt: string;
  private _signal: Signal<ITerminalConnection, IMessage>;
}
