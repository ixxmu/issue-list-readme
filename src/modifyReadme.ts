import * as core from '@actions/core';
import createTableContents from './createTableContents';
import createTitleListContents from './createTitleListContents';
import getContents from './getContents';
import getIndices from './getIndices';

const modifyReadme = async () => {
  try {
    const pattern = core.getInput('pattern');
    /**
     * 显示格式，支持两种，一种是Table布局，还有一种是标题链接列表(默认)
     */
    const layout = core.getInput('layout') as 'list' | 'table';
    const contents = await getContents();

    console.log('Contents has been retrieved.');

    const [firstIndex, lastIndex] = await getIndices(contents.readme, pattern);

    if (firstIndex === -1 || lastIndex === -1) {
      core.setFailed('notValidIndexException');
      throw 'notValidIndexException';
    }

    const beforeContent = contents.readme.substring(0, firstIndex);
    const afterContent = contents.readme.substring(lastIndex);
    let insertContents = '';

    console.log('InsertContents has been identified.');
    if (layout === 'table') {
      insertContents = await createTableContents(contents.issues);
    } else {
      insertContents = await createTitleListContents(contents.issues);
    }
    console.log('InsertContents has been created.');

    return beforeContent + '\n\n' + insertContents + '\n' + afterContent;
  } catch (error) {
    core.setFailed(error.message);
    throw error.message;
  }
};

export default modifyReadme;
