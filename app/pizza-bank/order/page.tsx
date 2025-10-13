'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  size?: string
  category: string
}

interface CartItem extends MenuItem {
  quantity: number
}

interface Pizzeria {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone: string
  acceptsBitcoin: boolean
  acceptsLightning: boolean
  acceptsFiat: boolean
  menu?: MenuItem[]
}

export default function OrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pizzeriaId = searchParams.get('pizzeria')

  const [step, setStep] = useState(1)
  const [pizzeria, setPizzeria] = useState<Pizzeria | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'bitcoin' | 'lightning' | 'fiat' | null>(null)
  const [pickupTime, setPickupTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (pizzeriaId) {
      fetchPizzeria(pizzeriaId)
    } else {
      setError('No pizzeria selected')
      setLoading(false)
    }
  }, [pizzeriaId])

  const fetchPizzeria = async (id: string) => {
    try {
      const response = await fetch(`/api/pizza-bank/pizzerias/${id}`)
      const data = await response.json()

      if (data.success) {
        setPizzeria(data.pizzeria)

        // If no menu in database, use sample menu
        if (!data.pizzeria.menu || data.pizzeria.menu.length === 0) {
          setSampleMenu(data.pizzeria)
        }
      } else {
        setError(data.error || 'Failed to load pizzeria')
      }
    } catch (err) {
      console.error('Error fetching pizzeria:', err)
      setError('Failed to load pizzeria')
    } finally {
      setLoading(false)
    }
  }

  const setSampleMenu = (piz: Pizzeria) => {
    const sampleMenu: MenuItem[] = [
      {
        id: 'item-1',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, basil, tomato sauce',
        price: 14.99,
        size: 'Large',
        category: 'Pizza'
      },
      {
        id: 'item-2',
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with mozzarella',
        price: 16.99,
        size: 'Large',
        category: 'Pizza'
      },
      {
        id: 'item-3',
        name: 'Veggie Supreme',
        description: 'Bell peppers, onions, mushrooms, olives',
        price: 15.99,
        size: 'Large',
        category: 'Pizza'
      },
      {
        id: 'item-4',
        name: 'Garlic Knots',
        description: '6 pieces with marinara sauce',
        price: 6.99,
        category: 'Sides'
      },
      {
        id: 'item-5',
        name: 'Caesar Salad',
        description: 'Romaine, parmesan, croutons, caesar dressing',
        price: 8.99,
        category: 'Salads'
      }
    ]

    setPizzeria({ ...piz, menu: sampleMenu })
  }

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(i => i.id === item.id)

    if (existing) {
      setCart(cart.map(i =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(i => i.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCart(cart.map(i =>
        i.id === itemId
          ? { ...i, quantity }
          : i
      ))
    }
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const handleSubmitOrder = async () => {
    if (!pizzeriaId || !paymentMethod || cart.length === 0) {
      setError('Please complete all required fields')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/pizza-bank/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pizzeriaId,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.quantity
          })),
          paymentMethod,
          pickupTime: pickupTime || null,
          notes: notes || null
        })
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to payment page
        router.push(`/pizza-bank/payment/${data.order.id}`)
      } else {
        setError(data.error || 'Failed to create order')
      }
    } catch (err) {
      console.error('Error creating order:', err)
      setError('Failed to create order')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading pizzeria...</div>
        </div>
      </div>
    )
  }

  if (error && !pizzeria) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Error Loading Pizzeria</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/pizza-bank"
            className="px-6 py-3 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all"
          >
            Back to Pizza Bank
          </Link>
        </div>
      </div>
    )
  }

  const menuItems = pizzeria?.menu || []
  const categories = Array.from(new Set(menuItems.map(item => item.category)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/pizza-bank"
            className="text-bitcoin hover:text-orange transition-colors mb-4 inline-block"
          >
            ← Back to Pizza Bank
          </Link>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange to-bitcoin bg-clip-text text-transparent">
            Order from {pizzeria?.name}
          </h1>
          <p className="text-gray-400">
            {pizzeria?.address}, {pizzeria?.city}, {pizzeria?.state}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-bitcoin' : 'text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? 'border-bitcoin bg-bitcoin/20' : 'border-gray-600'}`}>
                1
              </div>
              <span className="font-bold">Menu</span>
            </div>

            <div className={`h-px w-12 ${step >= 2 ? 'bg-bitcoin' : 'bg-gray-600'}`} />

            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-bitcoin' : 'text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? 'border-bitcoin bg-bitcoin/20' : 'border-gray-600'}`}>
                2
              </div>
              <span className="font-bold">Payment</span>
            </div>

            <div className={`h-px w-12 ${step >= 3 ? 'bg-bitcoin' : 'bg-gray-600'}`} />

            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-bitcoin' : 'text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 3 ? 'border-bitcoin bg-bitcoin/20' : 'border-gray-600'}`}>
                3
              </div>
              <span className="font-bold">Review</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Menu Selection */}
              {step === 1 && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Select Items</h2>

                  {categories.map(category => (
                    <div key={category} className="mb-8">
                      <h3 className="text-xl font-bold text-orange mb-4">{category}</h3>
                      <div className="grid gap-4">
                        {menuItems
                          .filter(item => item.category === category)
                          .map(item => (
                            <div
                              key={item.id}
                              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700 hover:border-orange transition-all"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="text-lg font-bold">{item.name}</h4>
                                  {item.size && (
                                    <span className="text-sm text-gray-400">{item.size}</span>
                                  )}
                                </div>
                                <div className="text-xl font-bold text-bitcoin">
                                  ${item.price.toFixed(2)}
                                </div>
                              </div>
                              <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                              <button
                                onClick={() => addToCart(item)}
                                className="w-full px-4 py-2 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all"
                              >
                                Add to Cart
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}

                  {cart.length > 0 && (
                    <button
                      onClick={() => setStep(2)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-orange/50 transition-all"
                    >
                      Continue to Payment ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                    </button>
                  )}
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>

                  <div className="space-y-4 mb-6">
                    {pizzeria?.acceptsBitcoin && (
                      <button
                        onClick={() => setPaymentMethod('bitcoin')}
                        className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                          paymentMethod === 'bitcoin'
                            ? 'border-bitcoin bg-bitcoin/10'
                            : 'border-gray-700 hover:border-bitcoin/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">₿</div>
                          <div>
                            <h3 className="text-xl font-bold">Bitcoin (On-Chain)</h3>
                            <p className="text-sm text-gray-400">Secure on-chain payment</p>
                          </div>
                        </div>
                      </button>
                    )}

                    {pizzeria?.acceptsLightning && (
                      <button
                        onClick={() => setPaymentMethod('lightning')}
                        className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                          paymentMethod === 'lightning'
                            ? 'border-bitcoin bg-bitcoin/10'
                            : 'border-gray-700 hover:border-bitcoin/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">⚡</div>
                          <div>
                            <h3 className="text-xl font-bold">Lightning Network</h3>
                            <p className="text-sm text-gray-400">Instant, low-fee payment</p>
                          </div>
                        </div>
                      </button>
                    )}

                    {pizzeria?.acceptsFiat && (
                      <button
                        onClick={() => setPaymentMethod('fiat')}
                        className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                          paymentMethod === 'fiat'
                            ? 'border-bitcoin bg-bitcoin/10'
                            : 'border-gray-700 hover:border-bitcoin/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">💳</div>
                          <div>
                            <h3 className="text-xl font-bold">Credit/Debit Card</h3>
                            <p className="text-sm text-gray-400">Traditional payment</p>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">
                      Pickup Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-bitcoin"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Extra cheese, no olives, etc."
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-bitcoin resize-none"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-4 bg-gray-800 rounded-lg font-bold hover:bg-gray-700 transition-all"
                    >
                      Back to Menu
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!paymentMethod}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Submit */}
              {step === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>

                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700 mb-6">
                    <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}x {item.name} {item.size && `(${item.size})`}
                          </span>
                          <span className="text-bitcoin">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700 mb-6">
                    <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                    <p className="text-gray-300">
                      {paymentMethod === 'bitcoin' && '₿ Bitcoin (On-Chain)'}
                      {paymentMethod === 'lightning' && '⚡ Lightning Network'}
                      {paymentMethod === 'fiat' && '💳 Credit/Debit Card'}
                    </p>
                  </div>

                  {pickupTime && (
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700 mb-6">
                      <h3 className="text-lg font-bold mb-4">Pickup Time</h3>
                      <p className="text-gray-300">
                        {new Date(pickupTime).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {notes && (
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700 mb-6">
                      <h3 className="text-lg font-bold mb-4">Special Instructions</h3>
                      <p className="text-gray-300">{notes}</p>
                    </div>
                  )}

                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      disabled={submitting}
                      className="flex-1 px-6 py-4 bg-gray-800 rounded-lg font-bold hover:bg-gray-700 transition-all disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      disabled={submitting}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-orange sticky top-4">
              <h3 className="text-xl font-bold mb-4">Your Cart</h3>

              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="border-b border-gray-700 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-sm">{item.name}</h4>
                            {item.size && (
                              <p className="text-xs text-gray-400">{item.size}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-400 text-xl"
                          >
                            ×
                          </button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-700 rounded hover:bg-gray-600"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-700 rounded hover:bg-gray-600"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-bitcoin font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-orange pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-bitcoin">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
