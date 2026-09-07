"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { ChevronLeft, Package, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { getProduct, formatPrice, mapApiProductToShopProduct, setDynamicProducts } from "@/lib/shop";
import { apiClient, getApiErrorMessage } from "@/lib/api/axios-client";
import { useCart, lineKey, type CartLine } from "@/app/components/shop/CartProvider";
import { apiSlice, useGetMyRewardProgressQuery, useListShopProductsQuery } from "@/features/api/apiSlice";

function CartRow({
  line,
  onQty,
  onRemove,
}: {
  line: CartLine;
  onQty: (key: string, qty: number) => void;
  onRemove: (key: string) => void;
}) {
  const product = getProduct(line.productId);
  if (!product) return null;
  const key = lineKey(line);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-neutral-200/50 last:border-0">
      <Link
        href={`/dashboard/shop/${product.id}`}
        className="w-20 h-20 rounded-[10px] bg-[#f6f3ef] border border-neutral-200/50 flex items-center justify-center p-2 shrink-0"
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
        ) : (
          <Package className="w-7 h-7 text-neutral-300" strokeWidth={1.5} />
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/dashboard/shop/${product.id}`} className="font-lato text-[14px] md:text-[15px] font-bold text-neutral-900 hover:text-black truncate block">
          {product.name}
        </Link>
        <p className="font-lato text-[12px] font-medium text-neutral-500 mt-0.5">
          {[line.color, line.size].filter(Boolean).join(" · ") || "One size"}
        </p>
        <p className="font-lato text-[13px] font-bold text-neutral-800 mt-1 md:hidden">{formatPrice(product.price)}</p>

        <div className="flex items-center gap-3 mt-2">
          <div className="inline-flex items-center border border-neutral-200/80 rounded-[8px] bg-white">
            <button
              type="button"
              onClick={() => onQty(key, line.qty - 1)}
              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" strokeWidth={2.2} />
            </button>
            <span className="w-8 text-center font-lato text-[13px] font-bold text-neutral-900">{line.qty}</span>
            <button
              type="button"
              onClick={() => onQty(key, line.qty + 1)}
              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onRemove(key)}
            className="inline-flex items-center gap-1 font-lato text-[12px] font-semibold text-neutral-400 hover:text-[#b0453a] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
            Remove
          </button>
        </div>
      </div>

      <div className="hidden md:block text-right shrink-0">
        <p className="font-lato text-[15px] font-bold text-neutral-900">{formatPrice(product.price * line.qty)}</p>
        {line.qty > 1 && <p className="font-lato text-[11px] font-medium text-neutral-400 mt-0.5">{formatPrice(product.price)} each</p>}
      </div>
    </div>
  );
}

type ShippingDetails = {
  shippingName: string;
  shippingLine1: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  notes: string;
};

type CheckoutStep = "shipping" | "payment";

function OrderPaymentForm({
  clientSecret,
  returnUrl,
  onBack,
}: {
  clientSecret: string;
  returnUrl: string;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaymentError(null);

    if (!stripe || !elements) {
      setPaymentError("Stripe is still loading. Please wait a moment.");
      return;
    }

    setSubmitting(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (result.error) {
      setPaymentError(result.error.message || "Unable to complete payment.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-[12px] border border-neutral-200/70 bg-white p-4">
        <PaymentElement />
      </div>
      {paymentError && <p className="font-lato text-[12px] text-[#b0453a]">{paymentError}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-[8px] border border-neutral-300 bg-white px-4 py-3 font-lato text-[13px] font-bold text-neutral-800 hover:border-neutral-400 transition-colors"
        >
          Back to shipping
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-neutral-900 px-4 py-3 font-lato text-[13px] font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-60"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? "Processing…" : "Pay now"}
        </button>
      </div>
    </form>
  );
}

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { lines, count, subtotal, pointsTotal, updateQty, removeItem, clear } = useCart();
  const [shipping, setShipping] = useState<ShippingDetails>({
    shippingName: "",
    shippingLine1: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    notes: "",
  });
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [loading, setLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [returnUrl, setReturnUrl] = useState<string>("/dashboard/shop/success");
  const [payWithPoints, setPayWithPoints] = useState<boolean | null>(null);

  const { data: productsData } = useListShopProductsQuery({ limit: 100 });
  const { data: rewardProgress } = useGetMyRewardProgressQuery();

  const pointsBalance = rewardProgress?.totalPoints ?? 0;
  const pointsPriced = pointsTotal > 0;
  /* Points cover whole units only; the API applies as many as the balance
     reaches and bills the rest to the card. Mirrored here so the summary can
     show the split before the order is placed. */
  const pointsApplied = pointsPriced ? Math.min(pointsBalance, pointsTotal) : 0;
  const coversEverything = pointsPriced && pointsApplied >= pointsTotal;
  const canUsePoints = pointsPriced && pointsApplied > 0;
  /* Points are preselected whenever any can be applied; the choice stays the
     shopper's the moment they touch the toggle. */
  const usePoints = payWithPoints ?? canUsePoints;

  useMemo(() => {
    if (productsData?.items) {
      const mapped = productsData.items.map(mapApiProductToShopProduct);
      setDynamicProducts(mapped);
    }
  }, [productsData]);

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  const validateShipping = () => {
    if (!shipping.shippingName.trim()) return "Name is required.";
    if (!shipping.shippingLine1.trim()) return "Address line 1 is required.";
    if (!shipping.shippingCity.trim()) return "City is required.";
    if (!shipping.shippingState.trim()) return "State is required.";
    if (!shipping.shippingZip.trim()) return "ZIP code is required.";
    return null;
  };

  const handleShippingChange = (field: keyof ShippingDetails, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const createOrder = async () => {
    setShippingError(null);
    setCheckoutError(null);

    const errorMessage = validateShipping();
    if (errorMessage) {
      setShippingError(errorMessage);
      return;
    }

    /* A points order still needs Stripe unless the balance covers the whole bag. */
    if ((!usePoints || !coversEverything) && !publishableKey) {
      setCheckoutError("Stripe publishable key is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.");
      return;
    }

    setLoading(true);
    try {
      /* apiClient carries the session: bearer token from storage, the auth
         cookie via withCredentials, and the CSRF header on writes. A bare
         fetch() sends none of those, so the API answers 401. */
      const res = await apiClient.post("/orders", {
        /* Products whose metadata declares options (size, color) reject the
           order unless the chosen value travels with the line. */
        items: lines.map((line) => {
          const selectedOptions: Record<string, string> = {};
          if (line.color) selectedOptions.color = line.color;
          if (line.size) selectedOptions.size = line.size;
          return {
            productId: line.productId,
            quantity: line.qty,
            ...(Object.keys(selectedOptions).length ? { selectedOptions } : {}),
          };
        }),
        shippingName: shipping.shippingName,
        shippingLine1: shipping.shippingLine1,
        shippingCity: shipping.shippingCity,
        shippingState: shipping.shippingState,
        shippingZip: shipping.shippingZip,
        notes: shipping.notes,
        paymentMethod: usePoints ? "points" : "stripe",
      });

      const payload = (res.data ?? {}) as { clientSecret?: string; returnUrl?: string; orderNumber?: string };

      /* The order was placed through apiClient, so RTK Query has no idea the
         points balance moved - drop the cached balance and ledger. */
      dispatch(apiSlice.util.invalidateTags(["RewardProgress", "PointsHistory", "Leaderboard"]));

      /* No clientSecret means points covered the whole bag and the API already
         confirmed the order - there is no card step to move on to. */
      if (!payload.clientSecret) {
        clear();
        router.push(`/dashboard/shop/success${payload.orderNumber ? `?order=${payload.orderNumber}` : ""}`);
        return;
      }

      setClientSecret(payload.clientSecret);
      setReturnUrl(payload.returnUrl ?? "/dashboard/shop/success");
      setStep("payment");
    } catch (err) {
      setCheckoutError(getApiErrorMessage(err, "Could not create order."));
    } finally {
      setLoading(false);
    }
  };

  const hasItems = lines.length > 0;
  /* Stripe rejects a relative return_url ("url_invalid"), so whatever we hold -
     our own default or a value the API returned - is resolved to an absolute
     URL against the current origin. */
  const paymentPageUrl = useMemo(() => {
    const target = returnUrl || "/dashboard/shop/success";
    if (typeof window === "undefined") return target;
    try {
      return new URL(target, window.location.origin).toString();
    } catch {
      return `${window.location.origin}/dashboard/shop/success`;
    }
  }, [returnUrl]);

  return (
    <main className="flex-1 flex flex-col gap-5 min-w-0">
      <title>Your bag - Bea Shop</title>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/shop"
          className="flex items-center justify-center w-9 h-9 rounded-[8px] border border-neutral-200 bg-[#faf9f6] text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-all shrink-0"
          aria-label="Back to shop"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
        </Link>
        <div>
          <h1 className="text-[22px] md:text-[36px] font-canela font-medium tracking-tight text-neutral-900 leading-tight">
            Your bag
          </h1>
          <p className="text-[12px] md:text-[18px] font-lato font-medium text-neutral-500 mt-0.5">
            {count} {count === 1 ? "item" : "items"} in your bag
          </p>
        </div>
      </div>

      {!hasItems ? (
        <div className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] py-20 flex flex-col items-center justify-center text-center gap-3">
          <Package className="w-10 h-10 text-neutral-300" strokeWidth={1.5} />
          <p className="font-lato text-[15px] font-bold text-neutral-700">Your bag is empty</p>
          <Link href="/dashboard/shop" className="font-lato text-[14px] font-semibold text-[#584939] underline underline-offset-2">
            Browse the shop
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_360px] gap-5 md:gap-6 items-start">
            <div className="bg-white border border-neutral-200/50 rounded-[12px] px-4 sm:px-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
              {lines.map((line) => (
                <CartRow key={lineKey(line)} line={line} onQty={updateQty} onRemove={removeItem} />
              ))}
            </div>

            <div className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-sfpro text-[12px] font-bold uppercase tracking-widest text-[#402b23]">Order summary</h2>
                  <p className="font-lato text-[13px] text-neutral-500 mt-1">Review your order before entering shipping details.</p>
                </div>
                <span className="font-lato text-[12px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="rounded-[12px] border border-neutral-200/70 bg-white p-4 mt-5 space-y-4">
                <div className="flex items-center justify-between text-[13px] font-bold text-neutral-700">
                  <span>Order total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="grid gap-2 text-[13px] text-neutral-500">
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span>{count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Points available</span>
                    <span>{pointsTotal.toLocaleString()} pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] mt-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-sfpro text-[12px] font-bold uppercase tracking-widest text-[#402b23]">Checkout</h2>
                <p className="font-lato text-[13px] text-neutral-500 mt-1">
                  {step === "shipping" ? "Enter shipping details and continue to payment." : "Complete payment to place your order."}
                </p>
              </div>
              <span className="font-lato text-[12px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                Step {step === "shipping" ? 1 : 2} of 2
              </span>
            </div>

            <div className="rounded-[12px] border border-neutral-200/70 bg-white p-4 mt-4">
              {step === "shipping" ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-[13px] font-bold text-neutral-800">
                      Name
                      <input
                        value={shipping.shippingName}
                        onChange={(event) => handleShippingChange("shippingName", event.target.value)}
                        placeholder="Full name"
                        className="mt-2 w-full rounded-[10px] border border-neutral-200 bg-white px-3.5 py-3 text-[16px] md:text-[14px] text-neutral-900 outline-none focus:border-neutral-400"
                      />
                    </label>
                    <label className="block text-[13px] font-bold text-neutral-800">
                      Address line 1
                      <input
                        value={shipping.shippingLine1}
                        onChange={(event) => handleShippingChange("shippingLine1", event.target.value)}
                        placeholder="Street address"
                        className="mt-2 w-full rounded-[10px] border border-neutral-200 bg-white px-3.5 py-3 text-[16px] md:text-[14px] text-neutral-900 outline-none focus:border-neutral-400"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="block text-[13px] font-bold text-neutral-800">
                      City
                      <input
                        value={shipping.shippingCity}
                        onChange={(event) => handleShippingChange("shippingCity", event.target.value)}
                        placeholder="City"
                        className="mt-2 w-full rounded-[10px] border border-neutral-200 bg-white px-3.5 py-3 text-[16px] md:text-[14px] text-neutral-900 outline-none focus:border-neutral-400"
                      />
                    </label>
                    <label className="block text-[13px] font-bold text-neutral-800">
                      State
                      <input
                        value={shipping.shippingState}
                        onChange={(event) => handleShippingChange("shippingState", event.target.value)}
                        placeholder="State"
                        className="mt-2 w-full rounded-[10px] border border-neutral-200 bg-white px-3.5 py-3 text-[16px] md:text-[14px] text-neutral-900 outline-none focus:border-neutral-400"
                      />
                    </label>
                    <label className="block text-[13px] font-bold text-neutral-800">
                      ZIP code
                      <input
                        value={shipping.shippingZip}
                        onChange={(event) => handleShippingChange("shippingZip", event.target.value)}
                        placeholder="ZIP code"
                        className="mt-2 w-full rounded-[10px] border border-neutral-200 bg-white px-3.5 py-3 text-[16px] md:text-[14px] text-neutral-900 outline-none focus:border-neutral-400"
                      />
                    </label>
                  </div>

                  <label className="block text-[13px] font-bold text-neutral-800">
                    Notes
                    <textarea
                      value={shipping.notes}
                      onChange={(event) => handleShippingChange("notes", event.target.value)}
                      placeholder="Order notes or special instructions"
                      rows={4}
                      className="mt-2 w-full rounded-[10px] border border-neutral-200 bg-white px-3.5 py-3 text-[16px] md:text-[14px] text-neutral-900 outline-none focus:border-neutral-400"
                    />
                  </label>

                  {pointsPriced ? (
                    <div className="rounded-[10px] border border-neutral-200 bg-[#fbfbf9] p-3.5">
                      <p className="font-sfpro text-[11px] font-bold uppercase tracking-[0.14em] text-[#402b23]">
                        Payment method
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setPayWithPoints(true)}
                          disabled={!canUsePoints}
                          className={`rounded-[8px] border px-3.5 py-3 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            usePoints ? "border-neutral-900 bg-white" : "border-neutral-200 bg-white hover:border-neutral-400"
                          }`}
                        >
                          <span className="block font-lato text-[13px] font-bold text-neutral-900">
                            {coversEverything ? "Pay with points" : "Points + card"}
                          </span>
                          <span className="block font-lato text-[12px] text-neutral-500 mt-0.5">
                            {coversEverything
                              ? `${pointsTotal.toLocaleString()} pts / you have ${pointsBalance.toLocaleString()}`
                              : `${pointsApplied.toLocaleString()} pts + the rest on card`}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayWithPoints(false)}
                          className={`rounded-[8px] border px-3.5 py-3 text-left transition-colors ${
                            !usePoints ? "border-neutral-900 bg-white" : "border-neutral-200 bg-white hover:border-neutral-400"
                          }`}
                        >
                          <span className="block font-lato text-[13px] font-bold text-neutral-900">Pay with card</span>
                          <span className="block font-lato text-[12px] text-neutral-500 mt-0.5">
                            {formatPrice(subtotal)}
                          </span>
                        </button>
                      </div>
                      {usePoints && !coversEverything ? (
                        <p className="mt-2 font-lato text-[12px] text-neutral-500">
                          Your {pointsApplied.toLocaleString()} pts cover part of this bag - the remaining items are
                          charged to your card on the next step.
                        </p>
                      ) : null}
                      {!canUsePoints ? (
                        <p className="mt-2 font-lato text-[12px] text-neutral-500">
                          You have no points to apply to this bag yet.
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {shippingError && <p className="font-lato text-[12px] text-[#b0453a]">{shippingError}</p>}
                  {checkoutError && <p className="font-lato text-[12px] text-[#b0453a]">{checkoutError}</p>}
                  <button
                    type="button"
                    onClick={createOrder}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-[8px] bg-neutral-900 px-5 py-3 font-lato text-[14px] font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-60"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? "Creating order…" : usePoints && coversEverything ? "Place order with points" : "Continue to payment"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-[12px] border border-neutral-200/70 bg-white p-4">
                    <p className="font-lato text-[13px] font-bold text-neutral-900 mb-3">Pay with card</p>
                    {clientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <OrderPaymentForm onBack={() => setStep("shipping")} clientSecret={clientSecret} returnUrl={paymentPageUrl} />
                      </Elements>
                    ) : (
                      <p className="font-lato text-[13px] text-neutral-500">Loading payment details…</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="w-full inline-flex items-center justify-center rounded-[8px] border border-neutral-300 bg-white px-5 py-3 font-lato text-[14px] font-bold text-neutral-800 hover:border-neutral-400 transition-colors"
                  >
                    Edit shipping information
                  </button>
                  {checkoutError && <p className="font-lato text-[12px] text-[#b0453a]">{checkoutError}</p>}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
