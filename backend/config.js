import dotenv from "dotenv";
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD ;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD ;
const STRIPE_SECRET_KEY = "sk_test_51RAzn5G6jAqOuRqj6yImH6RxWBTzFIquaK5M35Z1rOX7Hm78IqqZnM12KaaO1Qknr21Dhxxr6kbKUa8TUKDBEEak00ZtSxBX4q";

export default {
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD,
    STRIPE_SECRET_KEY,
};