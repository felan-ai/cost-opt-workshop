import { afterEach, describe, expect, it, vi } from "vitest"

const logger = vi.hoisted(() => ({
  emitOperationalLog: vi.fn(),
  flushOperationalLogs: vi.fn(async () => {}),
}))

vi.mock("@/lib/app-logger", () => logger)

import { GET } from "@/app/api/products/route"
import { PRODUCTS } from "@/lib/products"

afterEach(() => vi.clearAllMocks())

function loggedText() {
  return JSON.stringify(logger.emitOperationalLog.mock.calls)
}

describe("catalog API guardrails", () => {
  it.each([
    ["an unsupported parameter", "http://localhost/api/products?category=clothing"],
    ["a repeated search parameter", "http://localhost/api/products?search=jacket&search=backpack"],
    ["unbounded search input", `http://localhost/api/products?search=${"a".repeat(1000)}`],
  ])("rejects %s with a sanitized 400 response", async (_case, url) => {
    const response = await GET(new Request(url))

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body).toEqual({ ok: false, requestId: expect.any(String), error: expect.any(String) })
    expect(response.headers.get("x-request-id")).toBe(body.requestId)
    expect(logger.emitOperationalLog).toHaveBeenCalledWith(expect.objectContaining({
      eventName: "catalog.retrieval.completed",
      route: "/api/products",
      method: "GET",
      status: 400,
      outcome: "invalid_request",
    }))
    expect(logger.emitOperationalLog).not.toHaveBeenCalledWith(expect.objectContaining({ itemCount: expect.anything() }))
    expect(logger.flushOperationalLogs).toHaveBeenCalledOnce()
  })

  it("never echoes customer search text in invalid-request responses or logs", async () => {
    const privateQuery = "private-customer-query"
    const response = await GET(new Request(`http://localhost/api/products?search=${privateQuery}&category=x`))

    expect(response.status).toBe(400)
    expect(await response.text()).not.toContain(privateQuery)
    expect(loggedText()).not.toContain(privateQuery)
  })

  it.each(["Explorer Backpack", "migraine", "not-a-product"])(
    "never logs search text or product content for search %j",
    async (search) => {
      await GET(new Request(`http://localhost/api/products?search=${encodeURIComponent(search)}`))

      const logText = loggedText().toLocaleLowerCase()
      expect(logText).not.toContain(search.toLocaleLowerCase())
      for (const product of PRODUCTS) {
        expect(logText).not.toContain(product.name.toLocaleLowerCase())
        expect(logText).not.toContain(product.description.toLocaleLowerCase())
      }
      expect(logger.flushOperationalLogs).toHaveBeenCalledOnce()
    },
  )
})
