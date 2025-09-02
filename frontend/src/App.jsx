import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import './App.css'
import LoginForm from './component/Login'
import QuestionForm from './component/Question'
import RegistrationForm from './component/Register'
import Contest from "./component/Contest";
import ContestQuestion from "./component/ContestQuestion";
import Home from "./component/Home";

import QuizResults from "./component/QuizResults";
import ContestCreation from "./component/ContestCreation";
import { ToastContainer } from "react-toastify";
import About from "./component/Portfolio";
import Portfolio from "./component/Portfolio";
import PricingPage from "./component/PricingPage";
import PrivacyPage from "./component/PrivacyPage";
import Profile from "./component/Profile";
import TermsPage from "./component/TermsPage";
import ContactUs from "./component/ContactUs";
import CancellationRefund from "./CancellationRefund";
import ShippingPage from "./ShippingPage";
import PollCreator from "./component/PollCreator";
import ProtectedRoute from "./hook/loginCheck";
import ProtectedRouteAdmin from "./hook/adminCheck";
import QuizzySEO from "./QuizzySEO";
import Mycontest from "./component/Mycontest";
import Resetpassword from "./component/Resetpassword";
import Questionview from "./component/Questionview";

import { useEffect } from "react";
import axios from "axios";
import { Baseurl } from "./main.jsx";
import Event from "./component/Event.jsx";
import EventPage from "./component/EventPage.jsx";


const router=createBrowserRouter([
  {
    path:"/register",
    element:<RegistrationForm/>
  },
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/login",
    element:<LoginForm/>
  },
  {
    path:"/Question",
    element:<QuestionForm/>
  },{
    path:"/contest",
    element:<ProtectedRoute><Contest/></ProtectedRoute>
  },{
    path:"/ContestQuestion",
    element:<ContestQuestion/>
  },{
    path:"/result",
    element:<QuizResults/>
  },{
    path:"/createcontest",
    element:<ProtectedRouteAdmin><ContestCreation/></ProtectedRouteAdmin>
  },{
    path:"/about",
    element:<Portfolio/>
  },{
    path:"/pricing",
    element:<PricingPage/>
  },{
    path:"/privacy",
    element:<PrivacyPage/>
  },{
    path:"/profile",
    element:<Profile/>
  },{
    path:"terms",
    element:<TermsPage/>
  },{path:"contactus",
    element:<ContactUs/>
  },{
    path:"refunds",
    element:<CancellationRefund/>

  },{
    path:"shipping",
    element:<ShippingPage/>
  },{
    path:"polls",
    element:<PollCreator/>
  },{
    path:"my-contests",
    element:<Mycontest/>
  },{
    path:"/resetpassword",
    element:<Resetpassword/>
  },{
      path:"/questionview/:contestId",
      element:<Questionview/>
  },{
    path:"/event",
    element:<Event/>
  },{
    path:"/event/:eventId",
    element:<EventPage/>
  }
]);


function App() {
  //  this to convert url


  return (
    
    <div className='w-lg h-screen  bg-cyan-200'>
       <QuizzySEO/>
     <ToastContainer/>
      <RouterProvider router={router}/>
      
      
       
    </div>
  )
}

export default App
