import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";

export function NotFoundPage() {
  return (
    <Container className="py-24 text-center sm:py-32">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">404</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">We couldn't find that page.</h1>
      <p className="mx-auto mt-4 max-w-md text-slate-600">
        The link may be outdated. Browse our systems or talk to a specialist and we'll point you in the right direction.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button to="/systems" variant="outline">
          Browse systems
        </Button>
        <Button to="/quote">
          Request a quote <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Container>
  );
}
