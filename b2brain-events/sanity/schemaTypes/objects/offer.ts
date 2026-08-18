import { defineType, defineField } from 'sanity'

/**
 * EVENT OFFER  ->  .offer__box
 *
 * New in Template V2 (2026-07-22). Sits right after the Playbook: a single,
 * self-contained promo box for a per-event exhibitor offer (e.g. a free trial
 * through the show). Unlike every other section it has no eyebrow/H2 — it is
 * one bordered orange box, badge + headline + body + fine print + a button.
 *
 * When this is filled in, the Hero also grows a "Claim the event offer" link
 * pointing down to #offer (see Hero.tsx) — so wire this before the hero looks
 * incomplete, not after.
 */
export const offerBlock = defineType({
  name: 'offerBlock',
  title: 'Event offer',
  type: 'object',
  fields: [
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Small black tag above the headline. e.g. "Dreamforce 2026 exhibitor offer".',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'text',
      rows: 2,
      description: 'The offer, stated plainly. Required — this is what decides whether the section renders at all.',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(400),
    }),
    defineField({
      name: 'fineprint',
      title: 'Fine print',
      type: 'string',
      description: 'Terms, expiry, or an internal note that terms are pending confirmation before publish.',
      validation: (r) => r.max(200),
    }),
    defineField({
      name: 'cta',
      title: 'Button label',
      type: 'string',
      description: 'Links to the closing demo CTA (#cta). Leave blank to hide the button.',
      validation: (r) => r.max(40),
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'badge' },
  },
})
