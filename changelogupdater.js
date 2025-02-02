/* eslint no-console: 0 */
const fs = require('fs');
const semver = require('semver');

// const args = process.argv;

if (process.argv.length < 3) {
  throw new Error(
    'Not enough arguments. You should supply one of: bump || excerpt || back',
  );
}

const command = process.argv[2];
const version = process.argv[3];

// function escapeRegExp(string) {
//   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
// }

try {
  if (command === 'excerpt') {
    const data = fs.readFileSync('CHANGELOG.md', 'utf8');
    const allReleases = data.match(/##\s(.+)\s\((.+)\)/g);
    // const re = new RegExp(escapeRegExp(allReleases[1]), 'g');
    const index = data.indexOf(allReleases[1]);
    let versionExcerpt = data.slice(0, index);
    versionExcerpt = versionExcerpt.replace('# Change Log\n\n', '');
    versionExcerpt = versionExcerpt.slice(
      versionExcerpt.match('\n\n')['index'] + 2,
    );
    process.stdout.write(versionExcerpt);
  }

  if (command === 'bump') {
    const data = fs.readFileSync('CHANGELOG.md', 'utf8');
    const [original, origVersion, orig] = data.match(/##\s(.+)\s\((.+)\)/);
    if (orig !== 'unreleased') {
      console.log('Error, the CHANGELOG file is malformed.');
    }
    const currentDate = new Date();
    const date = `${currentDate.getFullYear()}-${`0${
      currentDate.getMonth() + 1
    }`.slice(-2)}-${`0${currentDate.getDate()}`.slice(-2)}`;

    if (version !== origVersion) {
      console.log(`Updating to the given version ${version}`);
    }
    const newLine = original
      .replace('unreleased', date)
      .replace(origVersion, version);

    const newChangelog = data.replace(original, newLine);

    // Save data to disk if command is bump
    fs.writeFile('CHANGELOG.md', newChangelog, (err) => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      console.log('Updated version on CHANGELOG.md');
    });
  }

  if (command === 'back') {
    const data = fs.readFileSync('CHANGELOG.md', 'utf8');
    const nextversion = semver.inc(process.argv[3], 'patch');
    const backToDevelTemplate = `\n\n## ${nextversion} (unreleased)\n\n### Breaking\n\n### Feature\n\n### Bugfix\n\n### Internal`;

    const insertIndex = data.indexOf('\n\n');
    const back = `${data.slice(
      0,
      insertIndex,
    )}${backToDevelTemplate}${data.slice(insertIndex)}`;
    console.log(back);
    fs.writeFile('CHANGELOG.md', back, (err) => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      console.log('Back to development on CHANGELOG.md');
    });
  }
} catch (e) {
  console.log('Error:', e.stack);
}
