import { readFileSync } from 'node:fs';

const [dataFile, reportFile, ...projects] = process.argv.slice(2);

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
}

function* allSpecs(suites) {
  for (const suite of suites) {
    yield* suite.specs ?? [];
    yield* allSpecs(suite.suites ?? []);
  }
}

try {
  if (!dataFile || !reportFile || projects.length === 0) {
    throw new Error('Usage: node check-discovery.mjs <cases.json> <discovery.json> <project>...');
  }
  if (new Set(projects).size !== projects.length) {
    throw new Error('Project names must be unique.');
  }

  const cases = readJson(dataFile);
  if (!Array.isArray(cases) || cases.length === 0) {
    throw new Error('Expected a nonempty JSON array of test cases.');
  }
  const expected = new Set();
  for (const entry of cases) {
    const id = entry?.id;
    if (typeof id !== 'string' || !/^[\w.-]+$/.test(id)) {
      throw new Error('Every case must have a nonempty ID using letters, numbers, _, . or -.');
    }
    if (expected.has(id)) throw new Error(`Duplicate ID in test data: ${id}`);
    expected.add(id);
  }

  const report = readJson(reportFile);
  if (!Array.isArray(report?.suites) || !Array.isArray(report.errors) || report.errors.length) {
    throw new Error('Expected a Playwright JSON discovery report without collection errors.');
  }

  const discovered = new Map(projects.map(project => [project, new Set()]));
  const problems = [];
  for (const spec of allSpecs(report.suites)) {
    const id = /^\[([\w.-]+)\](?:\s|$)/.exec(spec.title)?.[1];
    for (const test of spec.tests) {
      const seen = discovered.get(test.projectName);
      if (!seen) continue;
      if (!expected.has(id)) {
        problems.push(`${test.projectName}: unexpected test title "${spec.title}"`);
      } else if (seen.has(id)) {
        problems.push(`${test.projectName}: duplicate test for ${id}`);
      } else {
        seen.add(id);
      }
    }
  }
  for (const [project, seen] of discovered) {
    const missing = [...expected].filter(id => !seen.has(id));
    if (missing.length) problems.push(`${project}: missing ${missing.join(', ')}`);
  }
  if (problems.length) throw new Error(problems.join('\n'));

  console.log(`Discovered ${expected.size} unique case IDs in each project: ${projects.join(', ')}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
