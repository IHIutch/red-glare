import { expect, it } from 'vitest'

import { parseContent } from '../comark'
import { renderComark } from './test-utils/comark'

it('body-slot: #body alias becomes default slot at parse time', async () => {
  const tree = await parseContent(`
::alert{type="info"}
#heading
### Filing deadline

#body
All responses must be received by 11:59 PM ET.
::
`)
  // After the body-slot plugin runs there should be a template[name=default]
  // (not template[name=body]) inside the alert.
  const alert = tree.nodes.find(n => Array.isArray(n) && n[0] === 'alert') as any
  const slots = alert.slice(2).filter((c: any) => Array.isArray(c) && c[0] === 'template').map((c: any) => c[1].name)
  expect(slots).toEqual(['heading', 'default'])
})

it('body-slot: #body content lands in `children` so the alert renders body text', async () => {
  await renderComark(`
::alert{type="info"}
#heading
### Filing deadline

#body
All responses must be received by 11:59 PM ET.
::
`)
  const alert = document.querySelector('.usa-alert')!
  const body = alert.querySelector('.usa-alert__text')!
  expect(body.textContent).toContain('All responses must be received')
})
