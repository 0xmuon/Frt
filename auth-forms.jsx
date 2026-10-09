import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { DEMO_ACCOUNTS } from "@/lib/demo";
import { roleLabel } from "@/lib/roles";
import { safeNextPath } from "@/lib/paths";
import { loginSchema, registerSchema } from "@/lib/validators";
import { errorMessage } from "@/services/api-error";
const passwordRules = [
    { label: "At least 8 characters", test: (value) => value.length >= 8 },
    { label: "One uppercase letter", test: (value) => /[A-Z]/.test(value) },
    { label: "One lowercase letter", test: (value) => /[a-z]/.test(value) },
    { label: "One number", test: (value) => /\d/.test(value) },
    { label: "One special character", test: (value) => /[^A-Za-z0-9]/.test(value) },
];
function fieldMessage(message, dirty, submitCount) {
    if (!message || (!dirty && submitCount === 0)) {
        return undefined;
    }
    return message;
}
export function RegisterForm() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { register } = useAuth();
    const [serverError, setServerError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: { name: "", email: "", password: "", mobile: "" },
    });
    const password = useWatch({ control: form.control, name: "password" });
    const { errors, dirtyFields, isValid, isSubmitting, submitCount } = form.formState;
    async function onSubmit(values) {
        setServerError(null);
        try {
            await register(values);
            navigate(safeNextPath(params.get("next")));
        }
        catch (error) {
            setServerError(errorMessage(error, "The account could not be created."));
        }
    }
    return (<AuthCard title="Register" footer={<>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Login
          </Link>
        </>}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField id="name" label="Full name" error={fieldMessage(errors.name?.message, dirtyFields.name, submitCount)} hint="Letters and spaces, at least 6 characters.">
          <Input id="name" autoComplete="name" aria-invalid={errors.name != null && (dirtyFields.name || submitCount > 0)} {...form.register("name")}/>
        </FormField>
        <FormField id="mobile" label="Mobile" error={fieldMessage(errors.mobile?.message, dirtyFields.mobile, submitCount)} hint="10 digits. A new account is always a customer.">
          <Input id="mobile" inputMode="numeric" autoComplete="tel" aria-invalid={errors.mobile != null && (dirtyFields.mobile || submitCount > 0)} {...form.register("mobile")}/>
        </FormField>
        <FormField id="email" label="Email address" error={fieldMessage(errors.email?.message, dirtyFields.email, submitCount)}>
          <Input id="email" type="email" autoComplete="email" aria-invalid={errors.email != null && (dirtyFields.email || submitCount > 0)} {...form.register("email")}/>
        </FormField>
        <FormField id="password" label="Password">
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" className="pr-11" {...form.register("password")}/>
            <button type="button" className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
            </button>
          </div>
          <ul className="mt-2 grid gap-1 text-xs">
            {passwordRules.map((rule) => {
            const passed = rule.test(password);
            return (<li key={rule.label} className={passed ? "text-foreground" : "text-muted-foreground"}>
                  {passed ? "✓" : "○"} {rule.label}
                </li>);
        })}
          </ul>
        </FormField>
        {serverError ? (<p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {serverError}
          </p>) : null}
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Creating account…" : "Register"}
        </Button>
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => {
            setServerError(null);
            form.reset();
        }}>
          Reset
        </Button>
      </form>
    </AuthCard>);
}
export function LoginForm() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { login } = useAuth();
    const [serverError, setServerError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: { email: "", password: "" },
    });
    const { errors, dirtyFields, isValid, isSubmitting, submitCount } = form.formState;
    async function onSubmit(values) {
        setServerError(null);
        try {
            await login(values);
            navigate(safeNextPath(params.get("next")));
        }
        catch (error) {
            setServerError(errorMessage(error, "Could not sign in."));
        }
    }
    return (<AuthCard title="Login" footer={<>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Register
          </Link>
        </>}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField id="email" label="Email address" error={fieldMessage(errors.email?.message, dirtyFields.email, submitCount)}>
          <Input id="email" type="email" autoComplete="email" aria-invalid={errors.email != null && (dirtyFields.email || submitCount > 0)} {...form.register("email")}/>
        </FormField>
        <FormField id="password" label="Password" error={fieldMessage(errors.password?.message, dirtyFields.password, submitCount)}>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" className="pr-11" aria-invalid={errors.password != null && (dirtyFields.password || submitCount > 0)} {...form.register("password")}/>
            <button type="button" className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
            </button>
          </div>
        </FormField>
        {serverError ? (<p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {serverError}
          </p>) : null}
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Signing in…" : "Login"}
        </Button>
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => {
            setServerError(null);
            form.reset();
        }}>
          Reset
        </Button>
      </form>
      <div className="mt-6 rounded-lg bg-muted px-3 py-3 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Seeded accounts</p>
        <ul className="mt-3 grid gap-2">
          {DEMO_ACCOUNTS.map((account) => (<li key={account.email} className="flex flex-wrap items-center justify-between gap-2">
              <span>
                {account.name}
                <span className="block text-xs">{account.email}</span>
              </span>
              <Button type="button" variant="secondary" onClick={() => {
                form.setValue("email", account.email, { shouldValidate: true, shouldDirty: true });
                form.setValue("password", account.password, { shouldValidate: true, shouldDirty: true });
            }}>
                {roleLabel(account.role)}
              </Button>
            </li>))}
        </ul>
      </div>
    </AuthCard>);
}
function AuthCard({ title, footer, children, }) {
    return (<div className="mx-auto w-full max-w-md py-6">
      <h1 className="text-center text-4xl">{title}</h1>
      <div className="mt-8">{children}</div>
      <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
    </div>);
}
