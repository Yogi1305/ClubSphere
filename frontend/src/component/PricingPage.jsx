import React, { useState } from "react";
import { Check, Zap, Crown, Rocket, Users, Trophy, Star } from "lucide-react";
import Navbar from "./Navbar";
import axios from "axios";
import { Baseurl } from "../main";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";



export default function PricingPage() {
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);
 
 const navigate=useNavigate();
  const plans = [
    {
      id: "starter",
      name: "Starter",
      icon: Zap,
      contests: 1,
      price: 9,
      popular: false,
      color: "from-blue-500 to-cyan-500",
      features: [
       
        "Basic quiz templates",
        "Real-time results",
        "Email support",
        "Basic analytics",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      icon: Crown,
      contests: 3,
      price: 19,
      popular: true,
      color: "from-purple-500 to-pink-500",
      features: [
      
        "Premium quiz templates",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "Export results",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: Rocket,
      contests: 5,
      price: 39,
      popular: false,
      color: "from-orange-500 to-red-500",
      features: [
       
        "All premium features",
        "White-label solution",
        "API access",
        "Dedicated support",
        "Advanced integrations",
        "Custom development",
      ],
    },
  ];

  // this is to handle verifcation
//  useEffect(() => {
//   const verifyPayment = async () => {
//     try {
//       const { data } = await axios.post(`${Baseurl}/payment/verification`, {
//         razorpay_payment_id: localStorage.getItem("response.razorpay_payment_id"),
//         razorpay_order_id: localStorage.getItem("response.razorpay_order_id"),
//         razorpay_signature: localStorage.getItem("response.razorpay_signature"),
//         userId: localStorage.getItem("userId1"),
//         contestnumber: localStorage.getItem("cn"),
//       });

//       if (data.success) {
//         localStorage.removeItem("response.razorpay_payment_id");
//         localStorage.removeItem("response.razorpay_order_id");
//         localStorage.removeItem("response.razorpay_signature");
//         localStorage.removeItem("cn");
//         navigate("/contest");
//       } else {
//         // toast.error("Payment failed");
//         console.log("Payment verification failed", data.message);
//       }
//     } catch (error) {
//       // toast.error("Verification error");
//       console.error(error);
//     }
//   };

//   verifyPayment(); // call it
// }, []);

 
  const handlepayment = async (amount,contestnumber) => {
    //  console.log(contestnumber)
     const userId= localStorage.getItem("userId1");
     localStorage.setItem("cn",contestnumber);
    //  console.log(userId)
   try {
     const { data } = await axios.get(`${Baseurl}/payment/getkey`,{headers:{"Content-Type":"application/json" ,"x-user-id":userId,}, withCredentials:true,});
    // console.log(data);
    const key = data.key;
    const response = await axios.post(`${Baseurl}/payment/order`, { amount },{headers:{"Content-Type":"application/json" ,"x-user-id":userId,}, withCredentials:true,});
    // console.log(response.data.response);
   
    
    const order = response.data.response;
    var options = {
      key: key, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Clubsphere", //your business name
      description: "This is for paid subscription",
      image: "",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      // callback_url: `${Baseurl}/payment/verification`,

      handler:async function (response)
      {
         const {data}= await axios.post(`${Baseurl}/payment/verification`,{
          razorpay_payment_id:response.razorpay_payment_id,
           razorpay_order_id:response.razorpay_order_id,
            razorpay_signature:response.razorpay_signature,
            userId:userId,
            contestnumber:contestnumber,
         },{headers:{"Content-Type":"application/json" ,"x-user-id":userId,}, withCredentials:true,})
         if(data.success)
         {
              
          
              navigate("/contest");

         }
         else
          console.log("Payment verification failed", data.message);
        //  toast.error("payment failed")
        //   localStorage.setItem("response.razorpay_payment_id", response.razorpay_payment_id);
        //  localStorage.setItem("response.razorpay_order_id", response.razorpay_order_id);
        //   localStorage.setItem("response.razorpay_signature", response.razorpay_signature);
        //  toast.success("Payment successful! 🎉");
        //  window.location.reload();
      },
      // prefill: {
      //   //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
      //   name: userdata.fullName, //your customer's name
      //   email: userdata.email,
      //   contact: userdata.contact,
      // },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new Razorpay(options);
   
      rzp1.open();
   } catch (error) {
     console.log("payment error",error)
     toast.error("payment error ")
   }
      
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-4">
              <Trophy className="w-12 h-12 text-yellow-400 mr-3" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Quizy Pro
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Choose the perfect plan to power your quiz contests and engage
              your audience like never before
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-800 p-1 rounded-full border border-slate-700">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  !isAnnual
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  isAnnual
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const finalPrice = isAnnual
                ? Math.round(plan.price * 0.8 * 12)
                : plan.price;

              return (
                <div
                  key={plan.id}
                  className={`relative transform transition-all duration-300 ${
                    hoveredPlan === plan.id ? "scale-105" : "hover:scale-105"
                  }`}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div
                    className={`relative h-full bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700 overflow-hidden ${
                      plan.popular ? "ring-2 ring-yellow-400" : ""
                    }`}
                  >
                    {/* Gradient Background */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${plan.color} opacity-20`}
                    ></div>

                    <div className="relative p-8">
                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} mb-4`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <div className="flex items-center justify-center mb-4">
                          <span className="text-4xl font-bold">
                            ₹{finalPrice}
                          </span>
                          <span className="text-gray-400 ml-2">
                            /{isAnnual ? "year" : "month"}
                          </span>
                        </div>
                        {isAnnual && (
                          <p className="text-sm text-green-400">
                            Save ₹{plan.price * 12 - finalPrice * 12} annually
                          </p>
                        )}
                      </div>

                      {/* Contest Count */}
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center text-lg font-semibold">
                          <Users className="w-5 h-5 mr-2 text-cyan-400" />
                         {isAnnual ? plan.contests *12 : plan.contests} Contest Creations
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-4 mb-8">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <button
                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                          plan.popular
                            ? `bg-gradient-to-r ${plan.color} hover:shadow-lg hover:shadow-purple-500/25 text-white`
                            : "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                        } transform hover:-translate-y-1`}
                        onClick={() => handlepayment(finalPrice,plan.contests)}
                      >
                        {plan.popular ? "Get Started" : "Choose Plan"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-8">Why Choose Quizy?</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-400">
                  Create engaging quizzes in minutes with our intuitive builder
                </p>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Engage Audiences</h3>
                <p className="text-gray-400">
                  Real-time participation and instant results keep users hooked
                </p>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                <Trophy className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Track Success</h3>
                <p className="text-gray-400">
                  Detailed analytics help you understand and improve performance
                </p>
              </div>
            </div>
          </div>

          {/* FAQ or Contact */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">Need a custom solution?</p>
            <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
