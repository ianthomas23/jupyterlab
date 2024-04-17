import { DocumentManager, IDocumentWidgetOpener } from '@jupyterlab/docmanager';
import { DocumentRegistry } from '@jupyterlab/docregistry';
//import { ContentsManager, ServiceManager } from '@jupyterlab/services';
//import { Contents, ServiceManager } from '@jupyterlab/services';
import { ServiceManager } from '@jupyterlab/services';
import { Widget } from '@lumino/widgets';


export async function iant_listing(
  docRegistry: DocumentRegistry,
  serviceManager: ServiceManager.IManager,
) {
  console.log("ZZZ iant_listing docRegistry", docRegistry)
  console.log("ZZZ   ", serviceManager)


  /* from examples/filebrowser
  const docRegistry = new DocumentRegistry();
  const docManager = new DocumentManager({
    registry: docRegistry,
    manager,
    opener
  });

  interface IDocumentWidgetOpener {
    open(widget: IDocumentWidget, options?: DocumentRegistry.IOpenOptions): void;
    readonly opened: ISignal<IDocumentWidgetOpener, IDocumentWidget>;
  }
  */

  const opener: IDocumentWidgetOpener = {
    open: (widget: Widget) => {},
    get opened() {
      return {
        connect: () => {
          return false;
        },
        disconnect: () => {
          return false;
        }
      };
    },
  }

  const docManager = new DocumentManager({
    registry: docRegistry,  // Could maybe create a dummy one instead?
    manager: serviceManager,
    opener,
  })
  console.log("ZZZ docManager", docManager)

  // First challenge is to identify pwd, then do file listing of that directory.

  // Could call docManager.createNew?  But it returns Widget used to display it?
  // rename too, no widget involved.
  // In fact it is all widget-based, so at the wrong level for my requirements.

  //const contents = serviceManager.contents
  //const contents = new ContentsManager();
  const contents = serviceManager.contents;
  console.log("contents", contents)

  console.log("X2", contents.driveName("/"), "X")

  //log('Get contents of /tmp');

  // Both of these return a Model that has type == "directory"
  const g = await contents.get("");  // get() is get a file or directory (singular)
  console.log("get results", g);
  //const g2 = await contents.get('/');
  //console.log("get results", g2);

  // Get single file including contents.
  const setup = await contents.get("setup.py")
  console.log("get(setup.py)", setup)

  // get contents of a directory???
  //const opt: Contents.IFetchOptions = {
    //type?: ContentType;
    //format?: FileFormat;
    //content: false,
    //content?: boolean;
    //hash?: boolean;
  //}
  //const dir = await contents.get("design", opt)

  // For a directory, .content contains list of contents...
  const dir = await contents.get("design")
  console.log("dir(design)", dir)
  console.log("XXX contents of 'design' directory", dir.content)






  /* browser example
  const contents = new ContentsManager();

  log('Create a new directory');
  const model = await contents.newUntitled({ path: '/', type: 'directory' });
  log(`Created directory ${model.path}`);

  log('Move the new directory to /tmp');
  await contents.rename(model.path, '/tmp');

  log('Create new python file');
  const model2 = await contents.newUntitled({
    path: '/tmp',
    type: 'file',
    ext: 'py'
  });
  log(`Created ${model2.path}`);

  log('Rename file');
  await contents.rename(model2.path, '/tmp/foo.txt');

  log('Get contents of /tmp');
  await contents.get('/tmp');

  log('Save a file');
  await contents.save('/tmp/bar.txt');

  log('Copy a file');
  const model3 = await contents.copy('/tmp/bar.txt', '/tmp');
  log(`Copied to ${model3.path}`);

  log('Create a checkpoint');
  const checkpoint = await contents.createCheckpoint('/tmp/bar.txt');

  log('Restore a checkpoint');
  await contents.restoreCheckpoint('/tmp/bar.txt', checkpoint.id);

  log('List checkpoints for a file');
  const models2 = await contents.listCheckpoints('/tmp/bar.txt');
  log(models2[0].id);

  log('Delete a checkpoint');
  await contents.deleteCheckpoint('/tmp/bar.txt', checkpoint.id);

  log('Delete a file');
  await contents.delete('/tmp/bar.txt');*/

}
