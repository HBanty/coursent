
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
    "pk_test_51RAzn5G6jAqOuRqjA3sCA98MOS5BXYazeZSauTTrwCosgRGtYb0P3IBUYNYgXcMEFHlRUKDw0vySLv1AA9CZ2j1F00swbRDvN5");


createRoot(document.getElementById('root')).render(


    <Elements stripe={stripePromise}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Elements>

);
