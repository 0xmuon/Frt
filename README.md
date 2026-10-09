# SwiftShop

SwiftShop is the online counter for ABC's store. It is a Vite app written in React and JavaScript. Shoppers can register, sign in, search the catalog, keep a cart, check out, and read their own order history.

The screens follow the reference layout: a header with the brand, navigation, and profile icon; a menu; a main area; and a footer with shop links, customer service, and contact details.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

The layout follows a usual frontend JavaScript app: `index.html` and `src/main.jsx` start it, `src/App.jsx` holds the routes, and screens live in `src/pages`. Shared UI is in `src/components`, request state in `src/context`, the shopping API client in `src/services`, and form rules in `src/lib`.

The login page can fill three seeded accounts. A new registration is always a customer.

| Name | Email | Password | Role |
| --- | --- | --- | --- |
| Rudraksh | rudraksh@example.com | rudraksh1234 | Admin |
| Navya | navya@example.com | navya1234 | Support |
| Het | het@example.com | het12345 | Customer |

Order numbers, payment references, and stock come from that API. An empty history says **No orders found.**

## What you can do

- Register with name, email, mobile, and password. The name is at least 6 letters. The password needs 8 characters, an uppercase letter, a lowercase letter, a number, and a special character. The register button stays off until the form is valid, turns off while the request is in flight, and shows a server message if the email is already taken. Reset clears the fields.
- Log in with an email and password. Bad credentials show an error. Reset clears the form.
- Search products by name or category as you type, and narrow them with the category and sort dropdowns.
- Open a product, then add it to the cart. Out-of-stock products show **Out of Stock** and cannot be added.
- Change cart quantities. A quantity has to be a positive whole number and cannot pass the stock on hand. The total updates only after a valid change. Checkout stays disabled while the cart is empty or a quantity is invalid.
- Check out with a shipping address and a payment method: **Credit Card** or **Cash on Delivery**. Card numbers are checked in the browser (try `4242 4242 4242 4242`) and are not sent. Credit card is sent as `CARD`. Cash on delivery is sent as `UPI`, the non-card method the shopping API accepts.
- Read order history and the detail for each order. You only see your own orders.

Also included: deals, new arrivals, categories, a wishlist, an account page, help, shipping, returns, and a contact form. The contact form checks the note in the browser. The shopping API does not store those messages.

## Shopping API

This repo is the shop UI only. The shopping API is already running on port 8000. Postgres is on host port 5433, and the fake payment and email API is on port 9000. This project does not start either of them.

The UI calls `http://localhost:8000` unless you set another base with no trailing slash:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

The browser calls that host directly, so the API has to allow this site’s origin (`http://127.0.0.1:43123` when you use the dev server). Swagger for the shop is http://localhost:8000/docs. The fake API is http://localhost:9000/docs. The UI never calls port 9000.

What the screens call, matching the demo cases:

| What | Request |
| --- | --- |
| Register | `POST /api/users/register` with `name`, `email`, `password`, `mobile`. No role. |
| Login, refresh, me | `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/me` |
| Browse | `GET /api/products`, `GET /api/products/search?name=`, `GET /api/products/:id`, `GET /api/categories` |
| Cart | `GET /api/cart/:user_id`, `POST /api/cart/add`, `PUT /api/cart/update/:cart_item_id`, `DELETE /api/cart/remove/:cart_item_id` |
| Checkout | `POST /api/orders/checkout` with `user_id` and `payment_method` `CARD` (credit card) or `UPI` (cash on delivery) |
| Your orders | `GET /api/orders/me`, `GET /api/orders/details/:order_id` |
| Staff orders | `GET /api/admin/orders` |
| Retry a charge | `POST /api/payments/process` with `order_id` |
| Notice | `POST /api/notifications/send` with `order_id` |
| Audit and roles | `GET /api/admin/audit-logs`, `PATCH /api/admin/users/:id/role` |
| Catalog | `POST /api/admin/categories`, `POST /api/admin/products`, `DELETE /api/admin/products/:id` |

Login is by email. A wrong password and a missing user both say **Invalid email or password.** An inactive account says **Account is inactive.** The password is not in the response. A second register of the same email says **Email must be unique.**

Checkout does not send a card number. The screen offers credit card and cash on delivery. The API accepts `CARD` and `UPI`, so cash on delivery is charged as `UPI`. A paid order shows `ORD-…`, `PAID`, `CONFIRMED`, and a `PAY-…` reference. A failed charge keeps the order, shows the reason, and puts the stock back. **Try payment again** calls `POST /api/payments/process`. Sending a notice does not change the payment.

Support can read every order and queue a notice. Support cannot open the audit log or create a category. An admin can, and cannot change their own role. Deleting a product sets it inactive, and the shop then returns 404 for it. A guest cart stays in this browser, because the cart route requires a token, and is added with `POST /api/cart/add` at sign-in. The account page shows the name from `GET /api/auth/me`. There is no profile-update route.

Registration asks for a 10-digit mobile and a password with at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character. Login only requires a password, so the seeded accounts still sign in.
