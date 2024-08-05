"use client"
import { useCartStore } from "@/store/CartProvider"
import { formatPrice,priceTotal } from "@/utils/helpers"
import { PaymentElement,useElements,useStripe } from "@stripe/react-stripe-js" 
import { FormEvent, useEffect, useState } from "react"
interface Props {
    clientSecret:string
}

const CheckoutForm = ({clientSecret}:Props) => {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading,setIsLoading] = useState(false)
    const {cart,setCheckout} = useCartStore()
    useEffect(() =>{
        if(!stripe){
            return
        }
        if(!clientSecret){
            return
        }
    },[stripe])
    const handleSubmit = async(e:FormEvent) => {
        e.preventDefault()
        if(!stripe || !elements) {
            return
        }
        setIsLoading(true)
        const res = await stripe.confirmPayment({
            elements:elements,
            redirect:"if_required"
        })
        if(!res.error){
            setCheckout("success")
            setIsLoading(false)
        }else{
            console.log(res.error)
        }

    }
  return (
    <form onSubmit={handleSubmit} id="payment-form">
        <PaymentElement id="payment-element" />
        <h1 className="mt-4 font-bold">Total:{formatPrice(priceTotal(cart))}</h1>
        <button className="bg-cyan-400 text-white w-full rounded-lg px-4 py-2 mt-4" type="submit" disabled={!stripe || isLoading || !elements}>
<span id="button-text">
    {isLoading ? "Processing...":"Pay Now"}
</span>
        </button>
      
    </form>
  )
}

export default CheckoutForm
