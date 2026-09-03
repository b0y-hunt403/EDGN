export const courtInformationRequests = [
  {
    id: "CIR-2026-00419",
    caseNumber: "FFIC-CIV-2026-01842",
    recipient: "Meskel Construction PLC",
    subject: "Updated construction progress certificate",
    issued: "01 Sep 2026, 09:05",
    due: "04 Sep 2026, 17:00",
    status: "AWAITING_RESPONSE",
  },
  {
    id: "CIR-2026-00412",
    caseNumber: "FFIC-CIV-2026-01836",
    recipient: "Dashen Bank",
    subject: "Authenticated claim assessment record",
    issued: "29 Aug 2026, 11:40",
    due: "02 Sep 2026, 17:00",
    status: "RESPONSE_RECEIVED",
  },
  {
    id: "CIR-2026-00398",
    caseNumber: "FFIC-CIV-2026-01819",
    recipient: "Ethiopian Roads Administration",
    subject: "Contract termination notice and proof of service",
    issued: "22 Aug 2026, 15:18",
    due: "27 Aug 2026, 17:00",
    status: "VERIFIED",
  },
];

export const courtHearings = [
  {
    id: "HRG-2026-00182",
    caseNumber: "FFIC-CIV-2026-01842",
    type: "Case management conference",
    date: "08 Sep 2026",
    time: "09:30",
    room: "Commercial Bench · Courtroom 4",
    parties: "All authorized parties notified",
    status: "SCHEDULED",
  },
  {
    id: "HRG-2026-00179",
    caseNumber: "FFIC-CIV-2026-01836",
    type: "Evidence admissibility hearing",
    date: "03 Sep 2026",
    time: "14:00",
    room: "Commercial Bench · Courtroom 2",
    parties: "All authorized parties notified",
    status: "SCHEDULED",
  },
  {
    id: "HRG-2026-00164",
    caseNumber: "FFIC-CIV-2026-01819",
    type: "Final submissions",
    date: "25 Aug 2026",
    time: "10:00",
    room: "Commercial Bench · Courtroom 1",
    parties: "Attendance recorded",
    status: "COMPLETED",
  },
];

export const courtAppeals = [
  {
    id: "APL-2026-00044",
    caseNumber: "FFIC-CIV-2026-01788",
    appellant: "Abyssinia Electromechanical PLC",
    filed: "31 Aug 2026",
    destination: "Federal High Court · Commercial Appellate Bench",
    recordStatus: "Record bundle integrity verified",
    status: "APPEAL_PERIOD_OPEN",
  },
  {
    id: "APL-2026-00038",
    caseNumber: "FFIC-CIV-2026-01742",
    appellant: "Blue Nile Contractors PLC",
    filed: "18 Aug 2026",
    destination: "Federal High Court · Commercial Appellate Bench",
    recordStatus: "Transferred 20 Aug 2026",
    status: "TRANSFERRED",
  },
];

export const courtBankInstructions = [
  {
    id: "JIN-2026-00071",
    caseNumber: "FFIC-CIV-2026-01788",
    bank: "Commercial Bank of Ethiopia",
    instruction: "Preserve settlement position pending expiry of the appeal period",
    issued: "29 Aug 2026, 16:12",
    acknowledgement: "29 Aug 2026, 16:19",
    status: "ACKNOWLEDGED",
  },
  {
    id: "JIN-2026-00068",
    caseNumber: "FFIC-CIV-2026-01742",
    bank: "Awash Bank",
    instruction: "Record execution stay against the related guarantee claim",
    issued: "25 Aug 2026, 10:42",
    acknowledgement: "25 Aug 2026, 10:49",
    status: "EXECUTION_RECORDED",
  },
];

export const courtExecutionRecords = [
  {
    id: "EXE-2026-00052",
    caseNumber: "FFIC-CIV-2026-01788",
    responsibleParty: "Commercial Bank of Ethiopia",
    requiredAction: "Maintain protected settlement position",
    due: "15 Sep 2026",
    evidence: "Bank acknowledgement received",
    status: "MONITORING",
  },
  {
    id: "EXE-2026-00047",
    caseNumber: "FFIC-CIV-2026-01742",
    responsibleParty: "Awash Bank",
    requiredAction: "Apply authenticated execution stay",
    due: "Completed 25 Aug 2026",
    evidence: "Core banking reference AWB-LH-72811",
    status: "COMPLETED",
  },
];

export const closedCourtCases = [
  {
    id: "court-01742",
    caseNumber: "FFIC-CIV-2026-01742",
    parties: "Blue Nile Contractors PLC v. Ethiopian Roads Administration",
    guaranteeReference: "EDGN-2026-004588",
    closed: "22 Aug 2026",
    retention: "Judicial retention until 22 Aug 2036",
    outcome: "Final order recorded and execution acknowledged",
    status: "CLOSED",
  },
  {
    id: "court-01691",
    caseNumber: "FFIC-CIV-2026-01691",
    parties: "Habesha Steel Works PLC v. Ethiopian Electric Utility",
    guaranteeReference: "EDGN-2026-004402",
    closed: "30 Jul 2026",
    retention: "Judicial retention until 30 Jul 2036",
    outcome: "Matter withdrawn by authenticated joint filing",
    status: "CLOSED",
  },
];
