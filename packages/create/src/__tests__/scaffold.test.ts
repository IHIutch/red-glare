import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import { expect, it } from 'vitest'

import astroPackageJson from '../../../astro/package.json'

const execFileAsync = promisify(execFile)
const CLI_PATH = join(import.meta.dirname, '../../dist/index.js')

async function runCli(args: string[], cwd: string) {
  try {
    const result = await execFileAsync(process.execPath, [CLI_PATH, ...args], { cwd })
    return { exitCode: 0, stdout: result.stdout, stderr: result.stderr }
  }
  catch (err) {
    const execErr = err as { code?: number, stdout?: string, stderr?: string }
    return { exitCode: execErr.code ?? 1, stdout: execErr.stdout ?? '', stderr: execErr.stderr ?? '' }
  }
}

it('scaffold: happy path creates all expected files', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'red-glare-create-'))
  const { exitCode } = await runCli(['my-docs'], dir)
  expect(exitCode).toBe(0)

  const projectDir = join(dir, 'my-docs')
  const pkgJson = JSON.parse(await readFile(join(projectDir, 'package.json'), 'utf-8'))
  expect(pkgJson.name).toBe('my-docs')

  await readFile(join(projectDir, 'astro.config.mjs'), 'utf-8')
  await readFile(join(projectDir, 'src/content.config.ts'), 'utf-8')
  await readFile(join(projectDir, 'src/content/docs/index.md'), 'utf-8')
  await readFile(join(projectDir, 'src/content/docs/getting-started.md'), 'utf-8')
  await readFile(join(projectDir, 'tsconfig.json'), 'utf-8')
  await readFile(join(projectDir, '.gitignore'), 'utf-8')

  await expect(execFileAsync(process.execPath, ['--check', join(projectDir, 'astro.config.mjs')])).resolves.toBeDefined()
})

it('scaffold: generated @red-glare/astro range matches the current release', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'red-glare-create-'))
  await runCli(['version-sync-test'], dir)

  const pkgJson = JSON.parse(await readFile(join(dir, 'version-sync-test/package.json'), 'utf-8'))
  const generatedRange: string = pkgJson.dependencies['@red-glare/astro']

  const [major, minor] = astroPackageJson.version.split('.')
  const expectedRange = `^${major}.${minor}.0`
  expect(generatedRange).toBe(expectedRange)
})

it('scaffold: rejects a project name containing a quote', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'red-glare-create-'))
  const { exitCode } = await runCli(['bad\'name'], dir)
  expect(exitCode).toBe(1)

  await expect(readFile(join(dir, 'bad\'name', 'package.json'), 'utf-8')).rejects.toThrow()
})

it('scaffold: refuses to write into a non-empty directory', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'red-glare-create-'))
  await mkdir(join(dir, 'taken'))
  await writeFile(join(dir, 'taken/file.txt'), 'x')

  const { exitCode } = await runCli(['taken'], dir)
  expect(exitCode).toBe(1)
  expect(await readFile(join(dir, 'taken/file.txt'), 'utf-8')).toBe('x')
})

it('scaffold: --help exits 0', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'red-glare-create-'))
  const { exitCode } = await runCli(['--help'], dir)
  expect(exitCode).toBe(0)
})
