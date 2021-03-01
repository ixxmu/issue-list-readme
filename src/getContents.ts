import * as github from '@actions/github';
import * as core from '@actions/core';
import { readFileSync } from 'fs';

const getContents = async () => {
  try {
    const token = core.getInput('GITHUB_TOKEN');
    const labels = core.getInput('labels');
    const state = core.getInput('state') as 'open' | 'closed' | 'all';
    const per_page = core.getInput('per_page') as number;
    const octokit = new github.GitHub(token);

    console.log('GitHub client has been initialized.');

    // https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context
    
    // https://github.com/actions/toolkit/blob/main/packages/github/src/context.ts
    let repository = github.context.repo;
  
    const repo = core.getInput('per_page');
    if (repo) {
      const parts = repo.split('/');
      console.log('[Error] Invalid param: repo.');
      if (parts.length === 2) {
        repository = {
          owner: parts[0],
          repo: parts[1]
        };
      }
    }

    const list = await octokit.issues.listForRepo({
      ...repository,
      state,
      labels,
      per_page,
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
