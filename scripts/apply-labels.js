const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
const minimatch = require('minimatch');

async function run() {
  try {
    // Get input values from environment variables
    const token = process.env.GITHUB_TOKEN;
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const prNumber = process.env.PR_NUMBER;

    const octokit = new Octokit({ auth: token });

    // Load label rules
    const rulesPath = path.join(__dirname, '../label-rules.json');
    const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8')).rules;

    // Get changed files in the PR
    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber
    });

    const labels = new Set();

    // Determine labels based on changed files
    for (const file of files) {
      for (const rule of rules) {
        for (const pattern of rule.patterns) {
          if (minimatch(file.filename, pattern)) {
            labels.add(rule.label);
          }
        }
      }
    }

    // Apply labels to the PR
    if (labels.size > 0) {
      await octokit.issues.addLabels({
        owner,
        repo,
        issue_number: prNumber,
        labels: Array.from(labels)
      });
    }
  } catch (error) {
    console.error(`Failed to apply labels: ${error.message}`);
    process.exit(1);
  }
}

run();
