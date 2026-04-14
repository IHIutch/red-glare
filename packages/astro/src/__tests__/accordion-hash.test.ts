import { expect, it } from 'vitest'

import { expandAccordionForHash } from '../utils/accordion-hash'
import { md, renderComark } from './test-utils/comark'

it('accordion-hash: expands accordion panel when hash targets the item heading slug itself', async () => {
  await renderComark(md`
::accordion
  :::accordion-item
    #heading
    ## Fees and billing

    #default
    Details about fees go here.
  :::
  :::accordion-item
    #heading
    ## Payment methods

    #default
    Check, money order, or EFT.
  :::
::
`)

  const heading = document.getElementById('fees-and-billing')!
  expect(heading.tagName).toBe('H2')
  const panel = heading.closest('.usa-accordion__heading')!.nextElementSibling!
  expect(panel.classList.contains('usa-accordion__content')).toBe(true)
  expect(panel.hasAttribute('hidden')).toBe(true)

  window.location.hash = '#fees-and-billing'
  expandAccordionForHash()

  expect(panel.hasAttribute('hidden')).toBe(false)

  // Second item stays closed — unrelated panels aren't touched.
  const otherHeading = document.getElementById('payment-methods')!
  const otherPanel = otherHeading.closest('.usa-accordion__heading')!.nextElementSibling!
  expect(otherPanel.hasAttribute('hidden')).toBe(true)
})

it('accordion-hash: expands accordion panel when hash targets a heading inside it', async () => {
  await renderComark(md`
::accordion
  :::accordion-item
    #heading
    ## Fees and billing

    #default
    ### Fee schedule

    Details about fees.

    ### Expedited processing

    Details about expedited processing.
  :::
  :::accordion-item
    #heading
    ## Payment methods

    #default
    Check, money order, or EFT.
  :::
::
`)

  const target = document.getElementById('fee-schedule')!
  const panel = target.closest('.usa-accordion__content')!
  expect(panel.hasAttribute('hidden')).toBe(true)

  window.location.hash = '#fee-schedule'
  expandAccordionForHash()

  expect(panel.hasAttribute('hidden')).toBe(false)
})

it('accordion-hash: expands the correct panel for a different heading in the same panel', async () => {
  await renderComark(md`
::accordion
  :::accordion-item
    #heading
    ## Fees and billing

    #default
    ### Fee schedule

    Details about fees.

    ### Expedited processing

    Details about expedited processing.
  :::
::
`)

  window.location.hash = '#expedited-processing'
  expandAccordionForHash()

  const panel = document.getElementById('expedited-processing')!.closest('.usa-accordion__content')!
  expect(panel.hasAttribute('hidden')).toBe(false)
})

it('accordion-hash: does not expand unrelated panels', async () => {
  await renderComark(md`
::accordion
  :::accordion-item
    #heading
    ## Fees and billing

    #default
    ### Fee schedule
  :::
  :::accordion-item
    #heading
    ## Payment methods

    #default
    ### Payment options
  :::
::
`)

  window.location.hash = '#fee-schedule'
  expandAccordionForHash()

  const unrelated = document.getElementById('payment-options')!.closest('.usa-accordion__content')!
  expect(unrelated.hasAttribute('hidden')).toBe(true)
})

it('accordion-hash: does nothing when hash targets an element outside any accordion', async () => {
  await renderComark(md`
## Alerts

Content outside any accordion.

::accordion
  :::accordion-item
    #heading
    ## FAQ

    #default
    ### A question
  :::
::
`)

  window.location.hash = '#alerts'
  expandAccordionForHash()

  const panel = document.getElementById('a-question')!
    .closest('.usa-accordion__content')!
  expect(panel.hasAttribute('hidden')).toBe(true)
})

it('accordion-hash: does nothing when hash is empty', async () => {
  await renderComark(md`
::accordion
  :::accordion-item
    #heading
    ## Q

    #default
    ### A heading
  :::
::
`)

  expandAccordionForHash()

  const panel = document.getElementById('a-heading')!.closest('.usa-accordion__content')!
  expect(panel.hasAttribute('hidden')).toBe(true)
})

it('accordion-hash: does nothing when hash targets a nonexistent element', async () => {
  await renderComark(md`
::accordion
  :::accordion-item
    #heading
    ## Q

    #default
    ### A heading
  :::
::
`)

  window.location.hash = '#does-not-exist'
  expandAccordionForHash()

  const panel = document.getElementById('a-heading')!.closest('.usa-accordion__content')!
  expect(panel.hasAttribute('hidden')).toBe(true)
})

it('accordion-hash: re-expands panel after it was closed (same-hash edge case)', async () => {
  await renderComark(md`
::accordion
  :::accordion-item
    #heading
    ## Fees

    #default
    ### Fee schedule

    Details.
  :::
::
`)

  const target = document.getElementById('fee-schedule')!
  const panel = target.closest('.usa-accordion__content')!
  const button = panel.previousElementSibling!.querySelector<HTMLButtonElement>('.usa-accordion__button')!

  // First: expand via hash
  window.location.hash = '#fee-schedule'
  expandAccordionForHash()
  expect(panel.hasAttribute('hidden')).toBe(false)

  // Close the accordion
  button.click()
  expect(panel.hasAttribute('hidden')).toBe(true)

  // Re-expand with same hash
  expandAccordionForHash()
  expect(panel.hasAttribute('hidden')).toBe(false)
})
