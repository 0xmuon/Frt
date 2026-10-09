import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { ErrorBoundary } from "@/components/common/error-boundary";
import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/components/providers";
import { AccountPage } from "@/pages/AccountPage";
import { AdminPage } from "@/pages/AdminPage";
import { CartPage } from "@/pages/CartPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { ContactPage } from "@/pages/ContactPage";
import { DealsPage } from "@/pages/DealsPage";
import { HelpPage } from "@/pages/HelpPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { NewArrivalsPage } from "@/pages/NewArrivalsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { OrderPage } from "@/pages/OrderPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { ProductPage } from "@/pages/ProductPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ReturnsPage } from "@/pages/ReturnsPage";
import { ShippingPage } from "@/pages/ShippingPage";
import { WishlistPage } from "@/pages/WishlistPage";

function ShopRoutes() {
  const location = useLocation();
  return (
    <ErrorBoundary key={location.pathname}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <AppShell>
          <ShopRoutes />
        </AppShell>
      </BrowserRouter>
    </Providers>
  );
}
