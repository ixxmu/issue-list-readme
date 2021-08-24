import * as github from '@actions/github';
import * as core from '@actions/core';
import { readFileSync } from 'fs';
import { Octokit } from '@octokit/rest';

const getContents = async () => {
  try {
    const token = core.getInput('GITHUB_TOKEN');

    const queryArr = [
      'milestone',
      'state',
      'assignee',
      'creator',
      'mentioned',
      'labels',
      'sort',
      'direction',
      'since',
      'per_page',
      'page'
    ];
    const query: Omit<Octokit.IssuesListForRepoParams, 'owner' | 'repo'> = {};
    for (const key of queryArr) {
      let value: unknown = core.getInput(key);
      if (!value) continue;

      if (['per_page', 'page'].includes(key) && value) {
        value = parseInt(value as string, 10);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      query[key] = value;
    }

    const octokit = new github.GitHub(token);

    console.log('GitHub client has been initialized.');

    // https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context

    // https://github.com/actions/toolkit/blob/main/packages/github/src/context.ts
    let repository = github.context.repo;

    const repo = core.getInput('repo');
    if (repo) {
      const parts = repo.split('/');
      if (parts.length === 2) {
        repository = {
          owner: parts[0],
          repo: parts[1]
        };
      }
    }

    const list = await octokit.issues.listForRepo({
      ...repository,
      ...query
    });
    const readme = readFileSync('./README.md');

    return {
      issues: list.data,
      readme: readme.toString()
    };
  } catch (error) {
    core.setFailed(error.message);
    throw error.message;
  }
};

export default getContents;
