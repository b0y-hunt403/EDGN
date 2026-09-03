"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applicationService } from "@/services/application.service";
import { demoService } from "@/services/demo.service";
import { demoUsers } from "@/mocks/users";
import type {
  Application,
  ApplicationStatus,
  AuditEvent,
  Bank,
  Claim,
  CourtCase,
  DemoRoleId,
  Dispute,
  Guarantee,
  IntegrationRecord,
  Language,
  NewGuaranteeDraft,
  NotificationRecord,
  Organization,
  ToastMessage,
  ToastTone,
} from "@/types";

interface PersistedWorkflow {
  applications: Application[];
  guarantees: Guarantee[];
}

interface DemoContextValue {
  role: DemoRoleId;
  language: Language;
  currentUser: (typeof demoUsers)[DemoRoleId];
  applications: Application[];
  guarantees: Guarantee[];
  claims: Claim[];
  disputes: Dispute[];
  courtCases: CourtCase[];
  notifications: NotificationRecord[];
  auditLogs: AuditEvent[];
  banks: Bank[];
  integrations: IntegrationRecord[];
  organizations: Organization[];
  toasts: ToastMessage[];
  isLoading: boolean;
  busyAction: string | null;
  error: string | null;
  setRole: (role: DemoRoleId) => void;
  setLanguage: (language: Language) => void;
  addToast: (
    title: string,
    description?: string,
    tone?: ToastTone,
  ) => void;
  dismissToast: (id: string) => void;
  markNotificationRead: (id: string) => void;
  saveDraft: (draft: NewGuaranteeDraft) => Promise<void>;
  submitApplication: (draft: NewGuaranteeDraft) => Promise<Application | null>;
  transitionApplication: (
    id: string,
    status: ApplicationStatus,
    assignee: string,
    eventTitle: string,
  ) => Promise<Application | null>;
  issueApplication: (id: string) => Promise<Guarantee | null>;
  resetDemo: () => Promise<void>;
}

const DemoContext = createContext<DemoContextValue | null>(null);
const storageKey = "edgn-demo-workflow-v1";
const roleStorageKey = "edgn-demo-role-v1";
const languageStorageKey = "edgn-demo-language-v1";

function addWorkflowEvent(
  application: Application,
  status: ApplicationStatus,
  title: string,
  actor: string,
): Application {
  return {
    ...application,
    status,
    timeline: [
      {
        id: "evt-" + Date.now(),
        title,
        description: "Status updated to " + status.replaceAll("_", " "),
        date: "01 Sep 2026, just now",
        actor,
        tone: status === "REJECTED" ? "danger" : "success",
      },
      ...application.timeline,
    ],
  };
}

function displayDate(date: string): string {
  if (!date.includes("-")) return date;
  const [year, month, day] = date.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return day + " " + monthNames[Number(month) - 1] + " " + year;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<DemoRoleId>("applicant");
  const [language, setLanguageState] = useState<Language>("en");
  const [applications, setApplications] = useState<Application[]>([]);
  const [guarantees, setGuarantees] = useState<Guarantee[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [courtCases, setCourtCases] = useState<CourtCase[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationRecord[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hydrate = useCallback(async (reset = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await demoService.load();
      let workflow: PersistedWorkflow | null = null;

      if (!reset) {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          try {
            workflow = JSON.parse(saved) as PersistedWorkflow;
          } catch {
            window.localStorage.removeItem(storageKey);
          }
        }
      }

      setApplications(workflow?.applications ?? data.applications);
      setGuarantees(workflow?.guarantees ?? data.guarantees);
      setClaims(data.claims);
      setDisputes(data.disputes);
      setCourtCases(data.courtCases);
      setNotifications(data.notifications);
      setAuditLogs(data.auditLogs);
      setBanks(data.banks);
      setIntegrations(data.integrations);
      setOrganizations(data.organizations);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load the demonstration data.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedRole = window.localStorage.getItem(roleStorageKey) as DemoRoleId | null;
    const savedLanguage = window.localStorage.getItem(
      languageStorageKey,
    ) as Language | null;
    if (savedRole && demoUsers[savedRole]) setRoleState(savedRole);
    if (savedLanguage === "en" || savedLanguage === "am") {
      setLanguageState(savedLanguage);
    }
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isLoading && applications.length > 0) {
      const workflow: PersistedWorkflow = { applications, guarantees };
      window.localStorage.setItem(storageKey, JSON.stringify(workflow));
    }
  }, [applications, guarantees, isLoading]);

  const setRole = useCallback((nextRole: DemoRoleId) => {
    setRoleState(nextRole);
    window.localStorage.setItem(roleStorageKey, nextRole);
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(languageStorageKey, nextLanguage);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const addToast = useCallback(
    (
      title: string,
      description?: string,
      tone: ToastTone = "success",
    ) => {
      const id = "toast-" + Date.now() + "-" + Math.random();
      setToasts((items) => [...items, { id, title, description, tone }]);
      window.setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const saveDraft = useCallback(
    async (draft: NewGuaranteeDraft) => {
      const current = applications.find((item) => item.id === "app-00942");
      if (!current) return;
      setBusyAction("save-draft");
      try {
        const saved = await applicationService.saveDraft(current, draft);
        setApplications((items) =>
          items.map((item) => (item.id === saved.id ? saved : item)),
        );
        addToast(
          "Draft saved",
          saved.reference + " is available from your applications dashboard.",
        );
      } finally {
        setBusyAction(null);
      }
    },
    [addToast, applications],
  );

  const submitApplication = useCallback(
    async (draft: NewGuaranteeDraft): Promise<Application | null> => {
      const current = applications.find((item) => item.id === "app-00942");
      if (!current) return null;
      setBusyAction("submit-application");
      try {
        const submitted = await applicationService.submit(current, draft);
        const withEvent = addWorkflowEvent(
          submitted,
          "SUBMITTED",
          "Application submitted to Commercial Bank of Ethiopia",
          "Sara Mekonnen · Meskel Construction PLC",
        );
        setApplications((items) =>
          items.map((item) => (item.id === withEvent.id ? withEvent : item)),
        );
        setNotifications((items) => [
          {
            id: "ntf-" + Date.now(),
            title: "Application submitted",
            message:
              withEvent.reference +
              " was routed to CBE Guarantee Operations.",
            time: "Just now",
            category: "workflow",
            read: false,
            href: "/applicant/guarantees",
          },
          ...items,
        ]);
        addToast(
          "Application submitted",
          withEvent.reference + " is now in the bank work queue.",
        );
        return withEvent;
      } finally {
        setBusyAction(null);
      }
    },
    [addToast, applications],
  );

  const transitionApplication = useCallback(
    async (
      id: string,
      status: ApplicationStatus,
      assignee: string,
      eventTitle: string,
    ): Promise<Application | null> => {
      const current = applications.find((item) => item.id === id);
      if (!current) return null;
      setBusyAction("transition-" + id);
      try {
        const transitioned = await applicationService.transition(
          current,
          status,
          assignee,
        );
        const actor = demoUsers[role].name + " · " + demoUsers[role].title;
        const withEvent = addWorkflowEvent(
          transitioned,
          status,
          eventTitle,
          actor,
        );
        setApplications((items) =>
          items.map((item) => (item.id === id ? withEvent : item)),
        );
        addToast(
          eventTitle,
          withEvent.reference +
            " is now " +
            status.replaceAll("_", " ").toLowerCase() +
            ".",
        );
        return withEvent;
      } finally {
        setBusyAction(null);
      }
    },
    [addToast, applications, role],
  );

  const issueApplication = useCallback(
    async (id: string): Promise<Guarantee | null> => {
      const current = applications.find((item) => item.id === id);
      if (!current) return null;
      const issued = await transitionApplication(
        id,
        "ISSUED",
        "Registry",
        "Guarantee digitally signed and issued",
      );
      if (!issued) return null;

      const suffix = id === "app-00942" ? "004881" : "004882";
      const newGuarantee: Guarantee = {
        id: "g-" + suffix,
        reference: "EDGN-2026-" + suffix,
        verificationReference: "EDGN-V-2026-" + suffix,
        bankGuaranteeNumber: "CBE/BG/2026/00" + suffix.slice(-4),
        applicant: issued.applicant,
        beneficiary: issued.beneficiary,
        bank: issued.bank,
        branch: "Bole Branch",
        type: issued.type,
        amount: issued.amount,
        currency: "ETB",
        issueDate: "01 Sep 2026",
        expiryDate: displayDate(issued.expiryDate),
        contractReference: issued.contractReference,
        contractTitle: issued.contractTitle,
        status: "ACTIVE",
        version: 1,
        publicVisibleAmount: true,
        documents: [
          {
            id: "doc-" + suffix,
            name: "Digitally Signed Guarantee.pdf",
            category: "Issued guarantee",
            size: "806 KB",
            date: "01 Sep 2026",
            status: "Signed",
            version: "v1",
          },
          ...issued.documents,
        ],
        versions: [
          {
            version: 1,
            kind: "Original",
            effectiveDate: "01 Sep 2026",
            reason: "Original issuance",
            signedBy: demoUsers[role].name,
            hash: "a83f…19e2",
          },
        ],
        timeline: [
          {
            id: "evt-issue-" + Date.now(),
            title: "Guarantee issued and digitally signed",
            description: "Version 1 published to the EDGN registry",
            date: "01 Sep 2026, just now",
            actor: demoUsers[role].name + " · Authorized Signatory",
            tone: "success",
          },
          ...issued.timeline,
        ],
      };

      setGuarantees((items) => {
        const withoutExisting = items.filter(
          (item) => item.reference !== newGuarantee.reference,
        );
        return [newGuarantee, ...withoutExisting];
      });
      setNotifications((items) => [
        {
          id: "ntf-issued-" + Date.now(),
          title: "Guarantee issued",
          message:
            newGuarantee.reference +
            " is signed, active, and available for verification.",
          time: "Just now",
          category: "workflow",
          read: false,
          href: "/applicant/guarantees/" + newGuarantee.id,
        },
        ...items,
      ]);
      return newGuarantee;
    },
    [applications, role, transitionApplication],
  );

  const resetDemo = useCallback(async () => {
    window.localStorage.removeItem(storageKey);
    setRole("applicant");
    await hydrate(true);
    addToast(
      "Demo reset",
      "The connected presentation workflow is back at its starting state.",
      "info",
    );
  }, [addToast, hydrate, setRole]);

  const value = useMemo<DemoContextValue>(
    () => ({
      role,
      language,
      currentUser: demoUsers[role],
      applications,
      guarantees,
      claims,
      disputes,
      courtCases,
      notifications,
      auditLogs,
      banks,
      integrations,
      organizations,
      toasts,
      isLoading,
      busyAction,
      error,
      setRole,
      setLanguage,
      addToast,
      dismissToast,
      markNotificationRead,
      saveDraft,
      submitApplication,
      transitionApplication,
      issueApplication,
      resetDemo,
    }),
    [
      role,
      language,
      applications,
      guarantees,
      claims,
      disputes,
      courtCases,
      notifications,
      auditLogs,
      banks,
      integrations,
      organizations,
      toasts,
      isLoading,
      busyAction,
      error,
      setRole,
      setLanguage,
      addToast,
      dismissToast,
      markNotificationRead,
      saveDraft,
      submitApplication,
      transitionApplication,
      issueApplication,
      resetDemo,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const value = useContext(DemoContext);
  if (!value) {
    throw new Error("useDemo must be used inside DemoProvider.");
  }
  return value;
}
