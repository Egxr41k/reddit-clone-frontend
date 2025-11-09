import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: 'src/graphql/**/*.graphql',
  generates: {
    'src/graphql/generated/client.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-urql'],
    },
    'src/graphql/generated/server.ts': {
      documents: 'src/graphql/**/*.graphql',
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: { useTypeImports: true },
    },
  },
};

export default config;
