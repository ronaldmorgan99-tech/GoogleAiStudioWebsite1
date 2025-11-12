import safeJson from './safeJson.ts';

async function run() {
  console.log('Running safeJson tests...');

  const emptyRes = { text: async () => '' } as unknown as Response;
  const jsonRes = { text: async () => JSON.stringify({ foo: 'bar' }) } as unknown as Response;
  const invalidRes = { text: async () => 'not-json' } as unknown as Response;

  // Test empty body -> null
  const empty = await safeJson(emptyRes);
  console.assert(empty === null, 'empty response should return null');

  // Test valid JSON
  const parsed = await safeJson(jsonRes);
  console.assert(parsed && (parsed as any).foo === 'bar', 'valid JSON should parse');

  // Test invalid JSON -> should throw
  let threw = false;
  try {
    await safeJson(invalidRes);
  } catch (e) {
    threw = true;
  }
  console.assert(threw, 'invalid JSON should throw');

  console.log('safeJson tests passed');
}

run().catch(err => {
  console.error('safeJson tests failed', err);
  process.exit(1);
});
