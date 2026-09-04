"use client";

/*
 * MOCK AUTHENTICATION — DEMO ONLY
 * Multi-step registration page for the EDGN presentation.
 */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Banknote,
  Landmark,
  Code2,
  LoaderCircle,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/store/auth-store";
import { cn } from "@/lib/utils";

type AccountType = "applicant" | "beneficiary" | "bank" | "developer";

const ACCOUNT_TYPES: {
  value: AccountType;
  label: string;
  icon: typeof Building2;
  description: string;
}[] = [
  {
    value: "applicant",
    label: "Applicant Organization",
    icon: Building2,
    description: "Request and manage bank guarantees through EDGN-registered banks.",
  },
  {
    value: "beneficiary",
    label: "Beneficiary Organization",
    icon: Banknote,
    description: "Receive, verify, and claim on bank guarantees issued via EDGN.",
  },
  {
    value: "bank",
    label: "Bank Institution",
    icon: Landmark,
    description: "Process, approve, and issue bank guarantees on the EDGN platform.",
  },
  {
    value: "developer",
    label: "API Developer / Integration Partner",
    icon: Code2,
    description: "Integrate your institutional systems with the EDGN API platform.",
  },
];

const COUNTRIES = ["Ethiopia", "Kenya", "Nigeria", "South Africa", "Ghana"];
const REGIONS: Record<string, string[]> = {
  Ethiopia: ["Addis Ababa", "Amhara", "Oromia", "SNNPR", "Tigray", "Somali", "Benishangul-Gumuz"],
  Kenya: ["Nairobi", "Mombasa", "Kisumu"],
  Nigeria: ["Lagos", "Abuja", "Kano"],
  "South Africa": ["Gauteng", "Western Cape", "KwaZulu-Natal"],
  Ghana: ["Accra", "Kumasi", "Tamale"],
};

export function SignupPage() {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    reference: string;
    message: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [accountType, setAccountType] = useState<AccountType | "">("");
  const [org, setOrg] = useState({
    name: "",
    type: "",
    registrationNumber: "",
    tin: "",
    country: "Ethiopia",
    region: "Addis Ababa",
    city: "",
    address: "",
  });
  const [admin, setAdmin] = useState({
    fullName: "",
    position: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableRegions = REGIONS[org.country] ?? [];

  function validateStep1(): boolean {
    if (!accountType) {
      setErrors({ accountType: "Please select an account type." });
      return false;
    }
    setErrors({});
    return true;
  }

  function validateStep2(): boolean {
    const e: Record<string, string> = {};
    if (!org.name.trim()) e.orgName = "Organization name is required.";
    if (!org.registrationNumber.trim()) e.regNumber = "Registration number is required.";
    if (!org.tin.trim()) e.tin = "Tax Identification Number is required.";
    if (!org.city.trim()) e.city = "City is required.";
    if (!org.address.trim()) e.address = "Business address is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3(): boolean {
    const e: Record<string, string> = {};
    if (!admin.fullName.trim()) e.fullName = "Full name is required.";
    if (!admin.position.trim()) e.position = "Position is required.";
    if (!admin.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) e.email = "Enter a valid email.";
    if (!admin.phone.trim()) e.phone = "Phone number is required.";
    if (!admin.password) e.password = "Password is required.";
    else if (admin.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (admin.password !== admin.confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep4(): boolean {
    if (!agreed) {
      setErrors({ agreed: "You must accept the terms and conditions." });
      return false;
    }
    setErrors({});
    return true;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  }

  function handleBack() {
    setErrors({});
    setStep((s) => s - 1);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep4()) return;
    setIsSubmitting(true);
    try {
      const result = await register({
        accountType: accountType as AccountType,
        organization: {
          name: org.name,
          type: accountType as string,
          registrationNumber: org.registrationNumber,
          tin: org.tin,
          country: org.country,
          region: org.region,
          city: org.city,
          address: org.address,
        },
        administrator: {
          fullName: admin.fullName,
          position: admin.position,
          email: admin.email,
          phone: admin.phone,
          password: admin.password,
        },
      });
      setSuccessData(result);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successData) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="size-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Registration Submitted Successfully
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {successData.message}
          </p>
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Reference Number
            </p>
            <p className="mt-1 text-lg font-bold text-[#0f6f68]">{successData.reference}</p>
          </div>
          <div className="mt-6 space-y-2 text-left text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <div className="size-6 shrink-0 rounded-full bg-[#0f6f68] text-white flex items-center justify-center text-[10px] font-bold">
                1
              </div>
              <span>Registration Submitted</span>
              <span className="ml-auto text-xs font-semibold text-emerald-600">Done</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-6 shrink-0 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">
                2
              </div>
              <span>Email Verification Pending</span>
              <span className="ml-auto text-xs text-slate-400">Awaiting</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-6 shrink-0 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                3
              </div>
              <span>Organization Review</span>
              <span className="ml-auto text-xs text-slate-400">Awaiting</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-6 shrink-0 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                4
              </div>
              <span>Account Activation</span>
              <span className="ml-auto text-xs text-slate-400">Awaiting</span>
            </div>
          </div>
          <Link
            href="/login"
            className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-transparent bg-[#0f6f68] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5f59]"
          >
            Continue to Sign In
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  const stepLabels = ["Account Type", "Organization", "Administrator", "Review"];

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="hidden w-[440px] shrink-0 flex-col justify-between bg-[#162f3d] p-10 xl:flex">
        <div>
          <Link href="/login" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-[10px] border border-white/15 bg-white/10 text-[#62d2bd]">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-[0.12em] text-white">EDGN</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                Digital Guarantee Network
              </p>
            </div>
          </Link>
        </div>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold leading-8 text-white">
            Join Ethiopia&apos;s digital guarantee infrastructure
          </h1>
          <div className="space-y-4">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    step > i + 1
                      ? "bg-[#62d2bd] text-[#162f3d]"
                      : step === i + 1
                        ? "bg-white text-[#162f3d]"
                        : "bg-white/10 text-slate-400",
                  )}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    step === i + 1 ? "text-white font-semibold" : "text-slate-400",
                  )}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          &copy; 2026 EDGN Authority. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-[520px]">
          {/* Mobile brand */}
          <div className="mb-6 flex items-center gap-3 xl:hidden">
            <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#162f3d] text-[#62d2bd]">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-[0.12em] text-slate-900">EDGN</p>
              <p className="text-[9px] uppercase tracking-[0.14em] text-slate-500">
                Digital Guarantee Network
              </p>
            </div>
          </div>

          {/* Mobile step indicator */}
          <div className="mb-6 flex items-center gap-2 xl:hidden">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "size-5 rounded-full text-[9px] font-bold flex items-center justify-center",
                    step > i + 1
                      ? "bg-[#0f6f68] text-white"
                      : step === i + 1
                        ? "bg-[#0f6f68] text-white"
                        : "bg-slate-200 text-slate-500",
                  )}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                {i < stepLabels.length - 1 ? (
                  <div
                    className={cn(
                      "h-px w-4",
                      step > i + 1 ? "bg-[#0f6f68]" : "bg-slate-200",
                    )}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0f6f68]">
              Step {step} of 4
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {step === 1 && "Select Account Type"}
              {step === 2 && "Organization Information"}
              {step === 3 && "Account Administrator"}
              {step === 4 && "Review & Submit"}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              {step === 1 && "Choose the type of organization you represent."}
              {step === 2 && "Provide your organization details for verification."}
              {step === 3 && "Set up the primary administrator for this account."}
              {step === 4 && "Review your information before submitting."}
            </p>
          </div>

          {Object.keys(errors).length > 0 && errors[Object.keys(errors)[0]] ? (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errors[Object.keys(errors)[0]]}
            </div>
          ) : null}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 4) handleNext();
              else handleSubmit(e);
            }}
          >
            {/* Step 1 — Account Type */}
            {step === 1 && (
              <div className="space-y-3">
                {ACCOUNT_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setAccountType(type.value);
                        setErrors({});
                      }}
                      className={cn(
                        "flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition",
                        accountType === type.value
                          ? "border-[#0f6f68] bg-[#f2f9f7]"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-lg",
                          accountType === type.value
                            ? "bg-[#0f6f68] text-white"
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {type.label}
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-slate-500">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 2 — Organization Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Organization Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={org.name}
                    onChange={(e) => setOrg((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g., Meskel Construction PLC"
                    className={cn(
                      "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2",
                      errors.orgName
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                        : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Registration Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={org.registrationNumber}
                      onChange={(e) => setOrg((p) => ({ ...p, registrationNumber: e.target.value }))}
                      placeholder="e.g., RD-2024-12345"
                      className={cn(
                        "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2",
                        errors.regNumber
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                      )}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Tax ID (TIN) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={org.tin}
                      onChange={(e) => setOrg((p) => ({ ...p, tin: e.target.value }))}
                      placeholder="e.g., 1234567890"
                      className={cn(
                        "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2",
                        errors.tin
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">Country</label>
                    <select
                      value={org.country}
                      onChange={(e) => setOrg((p) => ({ ...p, country: e.target.value, region: REGIONS[e.target.value]?.[0] ?? "" }))}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#0f6f68] focus:ring-2 focus:ring-[#0f6f68]/10"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">Region</label>
                    <select
                      value={org.region}
                      onChange={(e) => setOrg((p) => ({ ...p, region: e.target.value }))}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#0f6f68] focus:ring-2 focus:ring-[#0f6f68]/10"
                    >
                      {availableRegions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      City <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={org.city}
                      onChange={(e) => setOrg((p) => ({ ...p, city: e.target.value }))}
                      placeholder="e.g., Addis Ababa"
                      className={cn(
                        "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2",
                        errors.city
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                      )}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Business Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={org.address}
                      onChange={(e) => setOrg((p) => ({ ...p, address: e.target.value }))}
                      placeholder="Street address"
                      className={cn(
                        "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2",
                        errors.address
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Administrator */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={admin.fullName}
                      onChange={(e) => setAdmin((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="e.g., Sara Mekonnen"
                      className={cn(
                        "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2",
                        errors.fullName
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                      )}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Position <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={admin.position}
                      onChange={(e) => setAdmin((p) => ({ ...p, position: e.target.value }))}
                      placeholder="e.g., Authorized Representative"
                      className={cn(
                        "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2",
                        errors.position
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Business Email <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={admin.email}
                    onChange={(e) => setAdmin((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@organization.et"
                    className={cn(
                      "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2",
                      errors.email
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                        : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                    )}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Phone Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={admin.phone}
                    onChange={(e) => setAdmin((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+251 91 123 4567"
                    className={cn(
                      "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2",
                      errors.phone
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                        : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Password <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={admin.password}
                        onChange={(e) => setAdmin((p) => ({ ...p, password: e.target.value }))}
                        placeholder="Min 8 characters"
                        className={cn(
                          "h-10 w-full rounded-lg border bg-white px-3 pr-10 text-sm outline-none transition focus:ring-2",
                          errors.password
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Confirm Password <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={admin.confirmPassword}
                        onChange={(e) => setAdmin((p) => ({ ...p, confirmPassword: e.target.value }))}
                        placeholder="Confirm password"
                        className={cn(
                          "h-10 w-full rounded-lg border bg-white px-3 pr-10 text-sm outline-none transition focus:ring-2",
                          errors.confirmPassword
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : "border-slate-300 focus:border-[#0f6f68] focus:ring-[#0f6f68]/10",
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 — Review */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="rounded-lg border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Organization
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-4 py-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Name</p>
                      <p className="font-medium text-slate-900">{org.name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Account Type</p>
                      <p className="font-medium text-slate-900">
                        {ACCOUNT_TYPES.find((t) => t.value === accountType)?.label ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Registration No.</p>
                      <p className="font-medium text-slate-900">{org.registrationNumber || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">TIN</p>
                      <p className="font-medium text-slate-900">{org.tin || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="font-medium text-slate-900">
                        {org.city}, {org.region}, {org.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="font-medium text-slate-900">{org.address || "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Administrator
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-4 py-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Full Name</p>
                      <p className="font-medium text-slate-900">{admin.fullName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Position</p>
                      <p className="font-medium text-slate-900">{admin.position || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-medium text-slate-900">{admin.email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="font-medium text-slate-900">{admin.phone || "—"}</p>
                    </div>
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.agreed) setErrors({});
                    }}
                    className="mt-0.5 size-4 rounded border-slate-300 accent-[#0f6f68]"
                  />
                  <span className="text-sm text-slate-600">
                    I agree to the{" "}
                    <span className="font-semibold text-[#0f6f68]">Terms of Service</span>{" "}
                    and{" "}
                    <span className="font-semibold text-[#0f6f68]">Privacy Policy</span>{" "}
                    of the EDGN platform.
                  </span>
                </label>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
              ) : (
                <div />
              )}
              {step < 4 ? (
                <button
                  type="submit"
                  className="flex h-10 items-center gap-2 rounded-lg border border-transparent bg-[#0f6f68] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5f59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6f68]/30"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-10 items-center gap-2 rounded-lg border border-transparent bg-[#0f6f68] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5f59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6f68]/30 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Registration
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#0f6f68] hover:text-[#0b5f59]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
