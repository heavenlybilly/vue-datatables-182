import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const documents = [
  'readme.md',
  'docs/data-table.md',
  'docs/data-table-column.md',
  'docs/migration-guide.md',
  'docs/typed-table.md',
  'docs/customization.md',
]

export const copyDocumentationExamples = async (root, directory) => {
  const contents = await Promise.all(documents.map((name) => readFile(join(root, name), 'utf8')))
  const examples = contents.flatMap((content) =>
    [...content.matchAll(/```(vue|ts|typescript)\n([\s\S]*?)```/g)].map((match) => ({
      extension: match[1] === 'vue' ? 'vue' : 'ts',
      code: match[2],
    })),
  )

  if (!examples.length) {
    throw new Error('Documentation examples are missing')
  }

  await Promise.all(
    examples.map(({ extension, code }, index) =>
      writeFile(join(directory, `documentation-${index + 1}.${extension}`), code),
    ),
  )

  const imports = examples.map(
    ({ extension }, index) =>
      `import * as example${index + 1} from './documentation-${index + 1}${extension === 'vue' ? '.vue' : ''}'`,
  )
  const names = examples.map((_example, index) => `example${index + 1}`)

  await writeFile(
    join(directory, 'documentation-entry.ts'),
    `${imports.join('\n')}\nexport const examples = [${names.join(', ')}]\n`,
  )
  process.stdout.write(`Checking ${examples.length} documentation examples\n`)
}
