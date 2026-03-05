import {beforeEach, describe, expect, test, vi} from "vitest";

const {
    fetchProductByIdMock,
    fetchPriceByIdMock,
    findOrCreateCustomerMock,
    checkoutCreateMock
} = vi.hoisted(() => {
    return {
        fetchProductByIdMock: vi.fn(),
        fetchPriceByIdMock: vi.fn(),
        findOrCreateCustomerMock: vi.fn(),
        checkoutCreateMock: vi.fn()
    };
});

vi.mock("$lib/fluti/pages/subscription/api/_common", () => ({
    fetchProductById: fetchProductByIdMock,
    fetchPriceById: fetchPriceByIdMock,
    findOrCreateCustomer: findOrCreateCustomerMock
}));

vi.mock("$lib/fluti/pages/subscription/api/stripe-client", () => ({
    stripeClient: vi.fn(() => ({
        checkout: {
            sessions: {
                create: checkoutCreateMock
            }
        }
    }))
}));

function createContext(data: { productId: string; priceId: string }, user: any = {
    id: "u1",
    email: "john@example.com",
    login: "john"
}) {
    return {
        req: {
            json: vi.fn(async () => data),
            url: "https://example.com/api/v1/payment/create"
        },
        get: vi.fn(() => user),
        json: vi.fn((body: any, init?: any) => {
            return new Response(JSON.stringify(body), {
                status: init?.status ?? 200,
                headers: {"Content-Type": "application/json"}
            });
        })
    } as any;
}

describe("createPaymentSession", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        findOrCreateCustomerMock.mockResolvedValue({id: "cus_1"});
    });

    test("returns 400 when price does not belong to selected product", async () => {
        const {createPaymentSession} = await import("$lib/fluti/pages/subscription/api/paymentHandler");
        fetchProductByIdMock.mockResolvedValue({id: "prod_1", name: "Plan 1"});
        fetchPriceByIdMock.mockResolvedValue({id: "price_1", product: "prod_2"});

        const response = await createPaymentSession(createContext({productId: "prod_1", priceId: "price_1"}));
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.error).toBe("Price does not belong to selected product");
        expect(checkoutCreateMock).not.toHaveBeenCalled();
    });

    test("uses stripe price id directly for checkout line item", async () => {
        const {createPaymentSession} = await import("$lib/fluti/pages/subscription/api/paymentHandler");
        fetchProductByIdMock.mockResolvedValue({id: "prod_1", name: "Plan 1"});
        fetchPriceByIdMock.mockResolvedValue({
            id: "price_1",
            product: "prod_1"
        });
        checkoutCreateMock.mockResolvedValue({client_secret: "sec_123"});

        const response = await createPaymentSession(createContext({productId: "prod_1", priceId: "price_1"}));
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({secret: "sec_123"});
        expect(checkoutCreateMock).toHaveBeenCalledWith(expect.objectContaining({
            line_items: [
                {
                    price: "price_1",
                    quantity: 1
                }
            ]
        }));
    });
});
