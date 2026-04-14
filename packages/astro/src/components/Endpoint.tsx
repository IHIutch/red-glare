import type { ReactNode } from 'react'

import { isValidElement } from 'react'

import type { EndpointAttrs, Parameter, Response } from '../comark-plugins/endpoint'

const HEADING_TAG_RE = /^h[1-6]$/

interface EndpointProps extends EndpointAttrs {
  children?: ReactNode
  /**
   * Named-slot content from inside the directive. `@comark/react` renders
   * MDC slots as props prefixed with `slot` + PascalCase, so author lines
   * like `#request` and `#response` arrive here rather than as child
   * elements. Both render in the right column — `request` for the request
   * code samples, `response` for response payload examples.
   */
  slotRequest?: ReactNode
  slotResponse?: ReactNode
}

function ParameterList({ items }: { items: Parameter[] }) {
  return (
    <dl className="ss-parameters">
      {items.map(item => (
        <div key={item.name} className="ss-parameters__row">
          <dt className="ss-parameters__term">
            <code className="ss-parameters__name">{item.name}</code>
            <span className="ss-parameters__type">{item.type}</span>
            {item.required && (
              <span className="ss-parameters__pill ss-parameters__pill--required">
                Required
              </span>
            )}
          </dt>
          {(item.description || item.enum || item.default) && (
            <dd className="ss-parameters__description">
              <div class="margin-bottom-05">{item.description}</div>
              {item.enum && (
                <div className="ss-parameters__enum">
                  Allowed values:
                  {' '}
                  {item.enum.map((v, i) => (
                    <span key={String(v)}>
                      {i > 0 && ', '}
                      <code>{String(v)}</code>
                    </span>
                  ))}
                </div>
              )}
              {item.default && (
                <div>
                  <span className="ss-parameters__meta">
                    Default:
                    {' '}
                    <code>{String(item.default)}</code>
                  </span>
                </div>
              )}
            </dd>
          )}
        </div>
      ))}
    </dl>
  )
}

function ParameterSection({ title, items }: { title: string, items?: Parameter[] }) {
  if (!items || items.length === 0)
    return null
  return (
    <>
      <h3>{title}</h3>
      <ParameterList items={items} />
    </>
  )
}

function ResponseSection({ items }: { items?: Response[] }) {
  if (!items || items.length === 0)
    return null
  return (
    <>
      <h3>Responses</h3>
      <table className="ss-responses">
        <thead>
          <tr>
            <th scope="col">Status code</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map(r => (
            <tr key={String(r.status)}>
              <td>
                <code>{r.status}</code>
              </td>
              <td>{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

/**
 * REST endpoint reference block. Authors write a `:::endpoint` directive
 * with a YAML frontmatter block for structured fields (method, path,
 * pathParameters, queryParameters, responses, …) and an optional
 * markdown body for the operation's narrative description:
 *
 *     :::endpoint
 *     ---
 *     method: GET
 *     path: /repos/{owner}/{repo}/branches
 *     pathParameters:
 *       - name: owner
 *         type: string
 *         required: true
 *     responses:
 *       - status: 200
 *         description: Returns an array of branches.
 *     ---
 *
 *     ## List branches
 *
 *     Lists branches for the specified repository.
 *     :::
 *
 * Layout: author's h2 first (matches GitHub), method/path signature
 * strip, narrative body, then auto-rendered parameter sections and the
 * response list. Parameter shape is locked down by the zod schema in
 * `comark-plugins/endpoint.ts`, so this component trusts every field.
 */
export default function Endpoint({
  method,
  path,
  id,
  deprecated,
  pathParameters,
  queryParameters,
  headerParameters,
  bodyParameters,
  responses,
  children,
  slotRequest,
  slotResponse,
}: EndpointProps) {
  const methodUpper = method.toUpperCase()
  const methodClass = `ss-endpoint__method ss-endpoint__method--${method.toLowerCase()}`
  const isDeprecated = deprecated === true || deprecated === 'true' || deprecated === ''

  const array = Array.isArray(children) ? children : [children]
  const heading = array.find(
    c => isValidElement(c) && typeof c.type === 'string' && HEADING_TAG_RE.test(c.type),
  )
  const leftBody = array.filter(c => c !== heading)

  return (
    <section className="ss-endpoint" id={id}>
      <div class="display-flex flex-align-center">
        {heading}
        {isDeprecated && (
          <span className="ss-endpoint__pill ss-endpoint__pill--deprecated margin-left-2">
            Deprecated
          </span>
        )}
      </div>
      <div className="ss-endpoint__signature">
        <span className={methodClass}>{methodUpper}</span>
        <code className="ss-endpoint__path">{path}</code>
      </div>
      <div className="ss-endpoint__grid grid-row grid-gap">
        <div className="ss-endpoint__col tablet:grid-col-6">
          {leftBody}
          <ParameterSection title="Path parameters" items={pathParameters} />
          <ParameterSection title="Query parameters" items={queryParameters} />
          <ParameterSection title="Header parameters" items={headerParameters} />
          <ParameterSection title="Body parameters" items={bodyParameters} />
          <ResponseSection items={responses} />
        </div>
        <div className="ss-endpoint__col tablet:grid-col-6">
          <div className="position-sticky top-3">
            {slotRequest && (
              <>
                <h3>Request example</h3>
                {slotRequest}
              </>
            )}
            {slotResponse && (
              <>
                <h3>Response example</h3>
                {slotResponse}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
