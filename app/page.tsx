"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, ShoppingCart, ArrowLeft, User, Receipt } from "lucide-react"

type Language = "es" | "en"
type OrderType = "takeaway" | "dine-in"

interface Product {
  id: number
  name: { es: string; en: string }
  description: { es: string; en: string }
  price: number
  image: string
  category: string
  ingredients: { es: string; en: string }[]
}

interface CartItem extends Product {
  quantity: number
  removedIngredients: number[]
}

type Screen = "language" | "order-type" | "menu" | "product-detail" | "cart" | "payment"

const products: Product[] = [
  {
    id: 1,
    name: { es: "Hamburguesa Clásica", en: "Classic Burger" },
    description: { es: "Jugosa hamburguesa con todos los ingredientes", en: "Juicy burger with all ingredients" },
    price: 8.99,
    image: "/classic-hamburger.png",
    category: "burgers",
    ingredients: [
      { es: "Lechuga", en: "Lettuce" },
      { es: "Tomate", en: "Tomato" },
      { es: "Cebolla", en: "Onion" },
      { es: "Pepinillos", en: "Pickles" },
      { es: "Salsa especial", en: "Special sauce" },
    ],
  },
  {
    id: 2,
    name: { es: "Hamburguesa BBQ", en: "BBQ Burger" },
    description: { es: "Con salsa BBQ y cebolla caramelizada", en: "With BBQ sauce and caramelized onion" },
    price: 10.99,
    image: "/bbq-burger-with-sauce.png",
    category: "burgers",
    ingredients: [

      { es: "Salsa BBQ", en: "BBQ sauce" },
      { es: "Cebolla caramelizada", en: "Caramelized onion" },
      { es: "Queso cheddar", en: "Cheddar cheese" },
      { es: "Lechuga", en: "Lettuce" },
    ],
  },
  {
    id: 3,
    name: { es: "Papas Fritas", en: "French Fries" },
    description: { es: "Crujientes papas doradas", en: "Crispy golden fries" },
    price: 3.99,
    image: "/golden-french-fries.png",
    category: "sides",
    ingredients: [
      { es: "Sal", en: "Salt" },
    ],
  },
  {
    id: 4,
    name: { es: "Refresco", en: "Soft Drink" },
    description: { es: "Bebida refrescante", en: "Refreshing beverage" },
    price: 2.99,
    image: "/soft-drink-cola.png",
    category: "drinks",
    ingredients: [],
  },
]

const translations = {
  es: {
    selectLanguage: "Selecciona tu idioma",
    orderType: "Tipo de pedido",
    takeaway: "Para llevar",
    dineIn: "Comer en el local",
    menu: "Menú",
    addToCart: "Agregar al carrito",
    cart: "Carrito",
    total: "Total",
    quantity: "Cantidad",
    removeIngredient: "Quitar ingrediente",
    ingredients: "Ingredientes",
    orderSummary: "Resumen del pedido",
    backToMenu: "Volver al menú",
    checkout: "Pagar",
    customerName: "Nombre para retirar",
    enterName: "Ingresa tu nombre",
    orderTicket: "Ticket de pedido",
    orderNumber: "Número de pedido",
    estimatedTime: "Tiempo estimado",
    minutes: "minutos",
    thankYou: "¡Gracias por tu pedido!",
    newOrder: "Nuevo pedido",
    namePlaceholder: "Tu nombre aquí...",
    confirmOrder: "Confirmar pedido",
    emptyCart: "Tu carrito está vacío",
    ingredientRemoved: "Quitado",
    without: "Sin",
  },
  en: {
    selectLanguage: "Select your language",
    orderType: "Order type",
    takeaway: "Takeaway",
    dineIn: "Dine in",
    menu: "Menu",
    addToCart: "Add to cart",
    cart: "Cart",
    total: "Total",
    quantity: "Quantity",
    removeIngredient: "Remove ingredient",
    ingredients: "Ingredients",
    orderSummary: "Order summary",
    backToMenu: "Back to menu",
    checkout: "Pay",
    customerName: "Name for pickup",
    enterName: "Enter your name",
    orderTicket: "Order ticket",
    orderNumber: "Order number",
    estimatedTime: "Estimated time",
    minutes: "minutes",
    thankYou: "Thank you for your order!",
    newOrder: "New order",
    namePlaceholder: "Your name here...",
    confirmOrder: "Confirm order",
    emptyCart: "Your cart is empty",
    ingredientRemoved: "Removed",
    without: "Without",
  },
}

export default function RestaurantKiosk() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("language")
  const [language, setLanguage] = useState<Language>("es")
  const [orderType, setOrderType] = useState<OrderType>("takeaway")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [removedIngredients, setRemovedIngredients] = useState<number[]>([])
  const [customerName, setCustomerName] = useState<string>("")

  const t = translations[language]

  const addToCart = (product: Product, removedIngredients: number[] = []) => {
    const existingItem = cart.find(
      (item) =>
        item.id === product.id &&
        JSON.stringify(item.removedIngredients.sort()) === JSON.stringify(removedIngredients.sort()),
    )

    if (existingItem) {
      setCart(cart.map((item) => (item === existingItem ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1, removedIngredients }])
    }
  }

  const updateQuantity = (index: number, change: number) => {
    const newCart = [...cart]
    newCart[index].quantity += change
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1)
    }
    setCart(newCart)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const generateOrderNumber = () => {
    return Math.floor(Math.random() * 9000) + 1000
  }

  const getEstimatedTime = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    return Math.max(5, Math.min(20, totalItems * 2 + Math.floor(Math.random() * 5)))
  }

  // Language Selection Screen
  if (currentScreen === "language") {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">{t.selectLanguage}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-white">
            <Button
              onClick={() => {
                setLanguage("es")
                setCurrentScreen("order-type")
              }}
              className="w-full h-16 text-lg bg-red-600 hover:bg-red-700"
            >
              🇪🇸 Español
            </Button>
            <Button
              onClick={() => {
                setLanguage("en")
                setCurrentScreen("order-type")
              }}
              className="w-full h-16 text-lg bg-red-600 hover:bg-red-700"
            >
              🇺🇸 English
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Order Type Selection Screen
  if (currentScreen === "order-type") {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">{t.orderType}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-white">
            <Button
              onClick={() => {
                setOrderType("takeaway")
                setCurrentScreen("menu")
              }}
              className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
            >
              📦 {t.takeaway}
            </Button>
            <Button
              onClick={() => {
                setOrderType("dine-in")
                setCurrentScreen("menu")
              }}
              className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-700"
            >
              🍽️ {t.dineIn}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Menu Screen
  if (currentScreen === "menu") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{t.menu}</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {orderType === "takeaway" ? t.takeaway : t.dineIn}
              </Badge>
              <Button onClick={() => setCurrentScreen("cart")} className="bg-red-600 hover:bg-red-700 text-white">
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t.cart} ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name[language]}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{product.name[language]}</h3>
                  <p className="text-gray-600 mb-4">{product.description[language]}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-600">${product.price}</span>
                    <Button
                      onClick={() => {
                        setSelectedProduct(product)
                        setRemovedIngredients([])
                        setCurrentScreen("product-detail")
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {t.addToCart}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Product Detail Screen
  if (currentScreen === "product-detail" && selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => setCurrentScreen("menu")} className="mb-6 bg-gray-600 hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t.backToMenu}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={selectedProduct.image || "/placeholder.svg"}
                alt={selectedProduct.name[language]}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{selectedProduct.name[language]}</h1>
              <p className="text-gray-600 mb-4">{selectedProduct.description[language]}</p>
              <p className="text-3xl font-bold text-red-600 mb-6">${selectedProduct.price}</p>

              {selectedProduct.ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">{t.ingredients}</h3>
                  <div className="space-y-2">
                    {selectedProduct.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg text-black shadow">
                        <span>{ingredient[language]}</span>
                        <Button
                          variant={removedIngredients.includes(index) ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (removedIngredients.includes(index)) {
                              setRemovedIngredients(removedIngredients.filter((i) => i !== index))
                            } else {
                              setRemovedIngredients([...removedIngredients, index])
                            }
                          }}
                        >
                          {removedIngredients.includes(index) ? "✓ " + t.ingredientRemoved : t.removeIngredient}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => {
                  addToCart(selectedProduct, removedIngredients)
                  setCurrentScreen("menu")
                }}
                className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 text-white"
              >
                {t.addToCart}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Cart Screen
  if (currentScreen === "cart") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{t.orderSummary}</h1>
            <Button onClick={() => setCurrentScreen("menu")} className="bg-gray-600 hover:bg-gray-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t.backToMenu}
            </Button>
          </div>

          {cart.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-xl text-gray-600">{t.emptyCart}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name[language]}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name[language]}</h3>
                          {item.removedIngredients.length > 0 && (
                            <p className="text-sm text-gray-600">
                              {t.without}: {item.removedIngredients.map((i) => item.ingredients[i][language]).join(", ")}
                            </p>
                          )}
                          <p className="text-red-600 font-bold">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => updateQuantity(index, -1)}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button size="sm" variant="outline" onClick={() => updateQuantity(index, 1)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-red-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>{t.total}:</span>
                    <span className="text-red-600">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full mt-4 h-12 text-lg bg-green-600 hover:bg-green-700"
                    onClick={() => setCurrentScreen("payment")}
                  >
                    {t.checkout}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    )
  }

  if (currentScreen === "payment") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{t.orderTicket}</h1>
            <Button onClick={() => setCurrentScreen("cart")} className="bg-gray-600 hover:bg-gray-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t.cart}
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t.customerName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="customerName" className="text-base">
                {t.enterName}
              </Label>
              <Input
                id="customerName"
                type="text"
                placeholder={t.namePlaceholder}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-2 h-12 text-lg"
              />
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                {t.orderSummary}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div className="flex-1">
                      <span className="font-medium">{item.name[language]}</span>
                      <span className="text-gray-600 ml-2">x{item.quantity}</span>
                      {item.removedIngredients.length > 0 && (
                        <p className="text-sm text-gray-500">
                          Sin: {item.removedIngredients.map((i) => item.ingredients[i][language]).join(", ")}
                        </p>
                      )}
                    </div>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 text-xl font-bold border-t-2">
                  <span>{t.total}:</span>
                  <span className="text-red-600">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <p className="text-lg font-semibold text-green-800">
                  {t.orderNumber}: #{generateOrderNumber()}
                </p>
                <p className="text-gray-600">
                  {t.estimatedTime}: {getEstimatedTime()} {t.minutes}
                </p>
                <Badge variant="outline" className="mt-2">
                  {orderType === "takeaway" ? t.takeaway : t.dineIn}
                </Badge>
              </div>

              <Button
                className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 mb-4"
                disabled={!customerName.trim()}
                onClick={() => {
                  // Reset all states for new order
                  setCart([])
                  setCustomerName("")
                  setCurrentScreen("language")
                }}
              >
                {t.confirmOrder}
              </Button>

              <p className="text-green-800 font-semibold">{t.thankYou}</p>
              <p className="text-sm text-gray-600 mt-2">
                {customerName && `${customerName}, tu pedido está siendo preparado`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
