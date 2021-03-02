import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

const createTitleListContents = async (
  issues: Octokit.IssuesListForRepoResponse
) => {
  try {
    const array = issues.map((item, index: number) => {
      return `${index + 1}. [${item.title}](${item.html_url})`;
    });
    const markDownText = array.join('\n');

    return markDownText;
  } catch (error) {
    core.setFailed(error.message);
    throw error.message;
  }
};
export default createTitleListContents;
