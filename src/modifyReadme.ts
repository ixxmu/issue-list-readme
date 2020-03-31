import * as core from '@actions/core';
import createTableContents from './createTableContents';
import getContents from './getContents';

const modifyReadme = async () => {
  try {
    const pattern = core.getInput('pattern');
    const contents = await getContents();

    console.log(contents);

    const firstIndex = contents.readme.indexOf(pattern);
    const lastIndex = contents.readme.lastIndexOf(pattern);

    console.log(firstIndex, lastIndex);

    if (firstIndex === -1 || lastIndex === -1) {
      throw 'notValidIndexException';
    }

    const beforeTable = contents.readme.substring(
      0,
      firstIndex + pattern.length
    );
    console.log(beforeTable);

    const afterTable = contents.readme.substring(
      contents.readme.lastIndexOf(pattern)
    );
    console.log(afterTable);

    const table = await createTableContents(contents.issues);
    console.log(table);

    return beforeTable + table + afterTable;
  } catch (error) {
    core.setFailed(error.message);
    throw error.message;
  }
};

export default modifyReadme;