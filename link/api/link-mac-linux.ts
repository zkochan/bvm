import path from 'path';
import fs from 'fs-extra';

const BIN_DIR = '/usr/local/bin';


export async function link(source: string, linkName: string){
  validateBinDirInPath(BIN_DIR);
  const dest = path.join(BIN_DIR, linkName);
  // TODO: change to fs.lstatSync(dest, {throwIfNoEntry: false});
  // TODO: this requires to upgrade fs-extra to have the throwIfNoEntry property
  // TODO: we don't use fs.pathExistsSync since it will return false in case the dest is a symlink which will result error on write
  let exists;
  try {
    exists = await fs.lstat(dest);
    // eslint-disable-next-line no-empty
  } catch (e) {}
  if (exists) {
    fs.removeSync(dest);
  }
  const dir = path.dirname(dest);
  await fs.ensureDir(dir);
  return fs.symlink(source, dest);
}

function validateBinDirInPath(binDir: string){
  const osPaths = (process.env.PATH || process.env.Path || process.env.path).split(path.delimiter);
  if (osPaths.indexOf(binDir) === -1) {
    throw new Error(
      `the directory ${binDir} is not a bin directory on the machine, please update establish-dev-link script`
    );
  }
}


// exec(`chmod u+x ${source}`, (e, sout, serr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }

//   if (sout) console.log(sout);
//   if (serr) console.error(serr);
//   console.log(`now you can use the "${linkName}" command to run you dev app`);
// });