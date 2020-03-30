import * as core from '@actions/core';
import getIssues from './github';

async function run(): Promise<void> {
  try {
    const issueList = await getIssues();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
