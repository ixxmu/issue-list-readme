import tablemark from 'tablemark';
import * as core from '@actions/core';
import extractBody from './extractBody';

const createTableContents = async (issues: any[]) => {
  try {
    /* 
    const array = issues.map(async (item: any) => ({
      title: `<a href="${item.html_url}">${item.title}</a>`,
      status: item.state === 'open' ? ':eight_spoked_asterisk:' : ':no_entry:',
      assignee: item.assignees.map(
        (assignee: any) =>
          `<a href="${assignee.html_url}"><img src="${assignee.avatar_url}" width="20" /></a>`
      ),
      body: await extractBody(item.body)
    }));

    const markDownText: string = tablemark(await Promise.all(array), {
      columns: [
        { align: 'left' },
        { align: 'center' },
        { align: 'center' },
        { align: 'left' }
      ]
    });
    */
   const array = issues.map(async (item: any, index: number) => {
     return `${index+1}. [${item.title}](${item.html_url})`;
   });
   const markDownText = array.join("\n");


    return markDownText;
  } catch (error) {
    core.setFailed(error.message);
    throw error.message;
  }
};
export default createTableContents;
