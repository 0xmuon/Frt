import { Label } from "@/components/ui/label";
export function FormField({ id, label, error, hint, children, }) {
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
    return (<div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div data-described-by={describedBy}>{children}</div>
      {error ? (<p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>) : hint ? (<p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>) : null}
    </div>);
}
