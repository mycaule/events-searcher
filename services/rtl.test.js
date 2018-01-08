import test from 'ava'

import rtl from './rtl'

test('Le Grand Studio RTL', async t => {
  const result = await rtl.grandStudio()
  console.log(result)
  t.true(result.length > 1)
})