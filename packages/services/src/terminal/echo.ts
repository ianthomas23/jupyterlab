import { ISignal, Signal } from '@lumino/signaling';

import { ServerConnection } from '..';

import * as Terminal from './terminal';


export class EchoTerminalConnection implements Terminal.ITerminalConnection {
  constructor(options: Terminal.ITerminalConnection.IOptions) {

    console.log("==> EchoTerminalConnection constructor");

    //this._name = options.model.name;
    this._name = "echo_terminal_name";

    //this.serverSettings = options.serverSettings ?? ServerConnection.makeSettings();
    this.serverSettings = options.serverSettings!;
    console.log("==>   serverSettings", this.serverSettings)

    /*this.serverSettings = {
      baseUrl: "",
      appUrl: "",
      wsUrl: "",
      token: "",
      appendToken: false,
      init: {},
      fetch: {},
      Request: {},
      Headers: {},
      WebSocket: {},
      serializer: null
    }*/
  }

  get connectionStatus(): Terminal.ConnectionStatus {
    //console.log("==> connectionStatus")
    return this._connectionStatus;
  }

  get connectionStatusChanged(): ISignal<this, Terminal.ConnectionStatus> {
    //console.log("==> connectionStatusChanged")
    return this._connectionStatusChanged;
  }

  dispose(): void {
    //console.log("==> dispose")
  }

  get disposed(): ISignal<this, void> {
    //console.log("==> disposed")
    return this._disposed;
  }

  get isDisposed(): boolean {
    //console.log("==> isDisposed")
    return this._isDisposed;
  }

  get messageReceived(): ISignal<this, Terminal.IMessage> {
    console.log("==> messageReceived", this._messageReceived)
    return this._messageReceived;
  }

  get model(): Terminal.IModel {
    //console.log("==> model")
    return { name: this._name };
  }

  get name(): string {
    return this._name;
  }

  async reconnect(): Promise<void> {
    //console.log("==> reconnect")
  }

  send(message: Terminal.IMessage): void {
    console.log("==> send",  message)
    // type 'set_size', 'stdin'
  }

  async shutdown(): Promise<void> {
    console.log("==> shutdown")
  }

  readonly serverSettings: ServerConnection.ISettings;

  private _connectionStatus: Terminal.ConnectionStatus = 'connecting';
  private _connectionStatusChanged = new Signal<this, Terminal.ConnectionStatus>(this);
  private _disposed = new Signal<this, void>(this);
  private _isDisposed = false;
  private _messageReceived = new Signal<this, Terminal.IMessage>(this);

  private _name: string;
}
