const path = require('path')
const shell = require('shelljs')
const shellQuote = require('shell-quote')
const fs = require('fs')

const REPO_PATH = '/repo'
const TESTING = (process.env.DEPENDENCIES_ENV || 'production') == 'test'
const ACTOR_ID = process.env.ACTOR_ID
const GIT_SHA = process.env.GIT_SHA
const NPMRC = process.env.SETTING_NPMRC
const dependencies = JSON.parse(process.env.DEPENDENCIES)['dependencies']

shell.set('-e')  // any failing shell commands will fail

function bootstrap() {
    shell.exec('lerna clean --yes')
    shell.exec(process.env.SETTING_BOOTSTRAP_COMMAND || 'lerna bootstrap --concurrency 1')
}

if (NPMRC) {
    console.log('.npmrc contents found in settings, writing to /home/app/.npmrc...')
    fs.writeFileSync('/home/app/.npmrc', NPMRC)
    console.log(NPMRC)
}

dependencies.forEach(function(dependency) {
  console.log(dependency)

  const name = dependency.name
  const installed = dependency.installed.version
  const dependencyPath = path.join(REPO_PATH, dependency.path)

  const packageJsonPath = path.join(dependencyPath, 'package.json')
  const packageJson = require(packageJsonPath)
  const isDevDependency = packageJson.hasOwnProperty('devDependencies') && packageJson.devDependencies.hasOwnProperty(name)

  const version = dependency.available[0].version
  let branchName = `${name}-${version}-${ACTOR_ID}`
  if (dependency.path !== '/') {
      branchName = branchName + '-' + dependency.path.replace('/', '--')
  }
  const msg = `Update ${name} from ${installed} to ${version} in ${dependency.path}`

  let prBody = `${name} has been updated to ${version} in ${dependency.path} by dependencies.io`
  dependency.available.forEach(function(available) {
      const content = available.hasOwnProperty('content') ? available.content : '_No content found._'
      prBody += `\n\n## ${available.version}\n\n${content}`
  })

  // branch off of the original commit that this build is on
  shell.exec(`git checkout ${GIT_SHA}`)
  shell.exec(`git checkout -b ${branchName}`)

  let packageJsonVersionSpecifier
  if (isDevDependency) {
    packageJsonVersionSpecifier = packageJson.devDependencies[name]
  } else {
    packageJsonVersionSpecifier = packageJson.dependencies[name]
  }

  let packageJsonVersionRangeSpecifier = ''
  if (packageJsonVersionSpecifier.startsWith('^')) {
    packageJsonVersionRangeSpecifier = '^'
  } else if (packageJsonVersionSpecifier.startsWith('~')) {
    packageJsonVersionRangeSpecifier = '~'
  }

  const versionWithRangeSpecifier = packageJsonVersionRangeSpecifier + version

  let npmInstallOpts = '--ignore-scripts --quiet --no-package-lock'
  if (packageJsonVersionRangeSpecifier === '') {
      npmInstallOpts += ' --save-exact'
  }

  // update package.json and then re-run lerna bootstrap
  shell.exec(`cd ${dependencyPath} && npm install ${npmInstallOpts} ${name}@${versionWithRangeSpecifier}`)
  bootstrap()

  console.log('This is the git status after performing the update:')
  shell.exec('git status')

  shell.exec('git add .')
  shell.exec(`git commit -m "${msg}"`)

  if (!TESTING) {
    shell.exec(`git push --set-upstream origin ${branchName}`)
    shell.exec(shellQuote.quote(['pullrequest', '--branch', branchName, '--title', msg, '--body', prBody]))
  }

  dependencyJSON = JSON.stringify({'dependencies': [dependency]})
  console.log(`BEGIN_DEPENDENCIES_SCHEMA_OUTPUT>${dependencyJSON}<END_DEPENDENCIES_SCHEMA_OUTPUT`)
})
