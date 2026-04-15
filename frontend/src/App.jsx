import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";

import CancellationRefund from "./CancellationRefund";
import QuizzySEO from "./QuizzySEO";
import ShippingPage from "./ShippingPage";
import Event from "./component/Event.jsx";
import EventPage from "./component/EventPage.jsx";
import ContactUs from "./component/ContactUs";
import Contest from "./component/Contest";
import ContestCreation from "./component/ContestCreation";
import ContestQuestion from "./component/ContestQuestion";
import Home from "./component/Home";
import LoginForm from "./component/Login";
import Mycontest from "./component/Mycontest";
import NotFound from "./component/NotFound";
import PollCreator from "./component/PollCreator";
import Portfolio from "./component/Portfolio";
import PricingPage from "./component/PricingPage";
import PrivacyPage from "./component/PrivacyPage";
import Profile from "./component/Profile";
import QuestionForm from "./component/Question";
import Questionview from "./component/Questionview";
import QuizResults from "./component/QuizResults";
import RegistrationForm from "./component/Register";
import Resetpassword from "./component/Resetpassword";
import TermsPage from "./component/TermsPage";
import Club from "./component/club/Club.jsx";
import Createevent from "./component/club/Createevent.jsx";
import Galleryedit from "./component/club/Galleryedit.jsx";
import Member from "./component/club/Member.jsx";
import ProtectedRouteAdmin from "./hook/adminCheck";
import ProtectedRoute from "./hook/loginCheck";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <RegistrationForm />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/question",
    element: <QuestionForm />,
  },
  {
    path: "/Question",
    element: <QuestionForm />,
  },
  {
    path: "/contest",
    element: (
      <ProtectedRoute>
        <Contest />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ContestQuestion",
    element: <ContestQuestion />,
  },
  {
    path: "/result",
    element: <QuizResults />,
  },
  {
    path: "/createcontest",
    element: (
      <ProtectedRouteAdmin>
        <ContestCreation />
      </ProtectedRouteAdmin>
    ),
  },
  {
    path: "/about",
    element: <Portfolio />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
  },
  {
    path: "/contactus",
    element: <ContactUs />,
  },
  {
    path: "/refunds",
    element: <CancellationRefund />,
  },
  {
    path: "/shipping",
    element: <ShippingPage />,
  },
  {
    path: "/polls",
    element: (
      <ProtectedRoute>
        <PollCreator />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-contests",
    element: <Mycontest />,
  },
  {
    path: "/resetpassword",
    element: <Resetpassword />,
  },
  {
    path: "/questionview/:contestId",
    element: <Questionview />,
  },
  {
    path: "/event",
    element: <Event />,
  },
  {
    path: "/event/:eventId",
    element: <EventPage />,
  },
  {
    path: "/club/:clubId",
    element: <Club />,
  },
  {
    path: "/createevent",
    element: <Createevent />,
  },
  {
    path: "/member",
    element: <Member />,
  },
  {
    path: "/gallery/:club/:id",
    element: <Galleryedit />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <div className="app-shell min-h-screen bg-slate-950 text-slate-100">
      <QuizzySEO />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
        toastClassName="!rounded-2xl !border !border-white/10 !bg-slate-900 !text-slate-100"
        bodyClassName="!text-sm !font-medium"
      />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
