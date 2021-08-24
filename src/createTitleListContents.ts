import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';

type TitleListContentsOptions = {
  // 是否显示除指定生成列表的label以外的label，默认true
  showExtraLable?: boolean;
};

const createTitleListContents = async (
  issues: Octokit.IssuesListForRepoResponse,
  options?: TitleListContentsOptions
) => {
  try {
    const array = issues.map((item, index: number) => {
      let mdStr = `${index + 1}. [${item.title}](${item.html_url})`;

      if (options?.showExtraLable !== false) {
        const commonLabels = (core.getInput('labels') || '').split(',');
        const labels = item.labels.filter(
          label => !commonLabels.includes(label.name)
        );
        const repo = github.context.repo;
        const labelsMd = labels
          .map(label => {
            // https://github.com/atom/atom/labels/help-wanted
            const labelUrl = `https://github.com/${repo.owner}/${repo.repo}/labels/${label.name}`;
            // ![GitHub labels](https://img.shields.io/github/labels/atom/atom/help-wanted)
            return `[![${label.name}](https://img.shields.io/github/labels/${repo.owner}/${repo.repo}/${label.name})](${labelUrl})`;
          })
          .join(' ');

        mdStr += ' ' + labelsMd;
      }
      return mdStr;
    });
    const markDownText = array.join('\n');

    return markDownText;
  } catch (error) {
    core.setFailed(error.message);
    throw error.message;
  }
};
export default createTitleListContents;
