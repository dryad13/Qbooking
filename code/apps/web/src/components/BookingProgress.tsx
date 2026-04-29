import { CheckCircle2, Circle, Clock, AlertCircle, CreditCard } from "lucide-react";

interface BookingProgressProps {
  currentStep: 1 | 2 | 3 | 4;
  status?: string;
}

const steps = [
  { label: "Booking Created" },
  { label: "KYC Verification" },
  { label: "Payment" },
  { label: "Confirmed" },
];

export function BookingProgress({ currentStep, status }: BookingProgressProps) {
  const isRejected =
    status === "kyc_rejected" || status === "payment_rejected";

  return (
    <nav aria-label="Booking progress" className="w-full py-4">
      <ol className="flex items-center w-full">
        {steps.map((step, idx) => {
          const stepNum = (idx + 1) as 1 | 2 | 3 | 4;
          const isPast = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isFuture = stepNum > currentStep;
          const isLast = idx === steps.length - 1;

          let Icon = Circle;
          let iconClass = "text-muted-foreground/40";

          if (isPast) {
            Icon = CheckCircle2;
            iconClass = "text-primary";
          } else if (isCurrent) {
            if (isRejected) {
              Icon = AlertCircle;
              iconClass = "text-destructive";
            } else if (stepNum === 3) {
              Icon = CreditCard;
              iconClass = "text-blue-500";
            } else {
              Icon = Clock;
              iconClass = "text-amber-500";
            }
          }

          return (
            <li key={step.label} className={`flex items-center ${isLast ? "flex-none" : "flex-1"}`}>
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all
                    ${isCurrent ? "ring-2 ring-offset-2 " + (isRejected ? "ring-destructive" : "ring-primary") : ""}
                  `}
                >
                  <Icon className={`h-5 w-5 ${iconClass} ${isCurrent && !isRejected ? "animate-pulse" : ""}`} />
                </span>
                <span
                  className={`hidden sm:block text-xs font-medium whitespace-nowrap
                    ${isPast ? "text-primary" : isCurrent ? (isRejected ? "text-destructive" : "text-foreground font-semibold") : "text-muted-foreground/60"}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-4 sm:mb-5 transition-all ${isPast ? "bg-primary" : "bg-border"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
