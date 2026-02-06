export interface AuditLog {
  id: string;
  time: string;
  user: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'CLIENT_ADMIN';
  action: string;
  entity: string;
  entityId: string;
  client: string;
  ip: string;
}

export interface FilterState {
  search: string;
  action: string;
  client: string;
  startDate: string;
  endDate: string;
}

export interface ClientPayload {
  email: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  isActive: boolean;
  role: 'client';
  username?: string;
  password?: string;
}

export interface ClientFormData {
  username: string;
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  isActive: boolean;
}

export interface Client {
  id: number;
  company_name: string;
  email: string;
  phone: string;
  contact_person: string;
  is_active: boolean;
  created_at: string;
}

export interface CredentialItem {
  id: number;
  key: string;      // Matches "key" in your JSON
  provider: string;
  createdAt: string;
}

export interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  showToggle?: boolean;
  icon?: React.ReactNode;
}

export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved';

export interface Complaint {
  id: string;
  awb: string;
  client: string;
  provider: string;
  issue: string;
  status: ComplaintStatus;
  comments?: string;
  resolved_at: string;
  createdAt: string;
}

export interface MiniStatProps {
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: React.ComponentType<{ size: number }>;
}

export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export interface SummaryMiniProps {
  label: string;
  value: number | undefined;
  loading: boolean;
  color: string;
}

export interface SelectFilterProps {
  value: string | number;
  onChange: (value: string) => void;
  options: Array<Record<string, string | number>>;
  labelKey: string;
  placeholder: string;
}

export interface PaginationBtnProps {
  icon: React.ComponentType<{ size: number }>;
  onClick: () => void;
  disabled: boolean;
}

export interface StatusBadgeProps {
  status: string;
}

export interface DrawerInfoBoxProps {
  label: string;
  value: string | undefined;
  icon: React.ComponentType<{ size: number }>;
}

export interface Consignment {
  id: string;
  awb: string;
  provider: string;
  status: string;
  bookedAt: string;
  lastUpdatedAt: string;
  origin: string;
  destination: string;
  tat: string;
  movement: string;
  client: string;
};

export interface NormalizedConsignmentFilters {
  page: number;
  limit: number;
  awb: string | undefined;
  clientId: number | undefined;
  provider: string | undefined;
  status: string | undefined;
  tat: string | undefined;
  from: string | undefined;
  to: string | undefined;
}

export interface DlqJob {
  id: string;
  provider: 'DTDC' | 'Delhivery' | 'BlueDart';
  client: string;
  awb: string;
  reason: string;
  attempts: number;
  maxAttempts: number;
  failedAt: string;
  payload: Record<string, unknown>;
}

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave';

export interface AttendanceEntry {
  date: string;
  status: AttendanceStatus;
  check_in: string | null;
  check_out: string | null;
}

export interface AdvanceEntry {
  id: number;
  amount: number;
  date: string;
  remarks: string;
  is_settled: boolean;
}

export interface Employee {
  id: number;
  employee_code?: string;
  name: string;
  email?: string;
  designation?: string;
  department?: string;
  is_active: boolean;
  base_salary: number;
  phone: string;
  attendance_status?: AttendanceStatus | null;
  check_in?: string | null;
  check_out?: string | null;
  advance_balance: string | number;
  net_due: string | number;
  salary_id?: number | null;
  net_salary?: number | null;
  joining_date?: string;
  salary_type?: string;
  attendance_list: AttendanceEntry[];
  advances: AdvanceEntry[];
}

export type DrawerType = 'edit' | 'attendance' | 'advance' | 'pay' | 'add' | 'holidays';

export interface EmployeeFormData {
    employee_code: string;
    name: string;
    email: string;
    designation: string;
    phone: string;
    department: string;
    base_salary: number;
    joining_date: string;
    salary_type: "monthly" | "daily" | "Monthly" | "Daily" | "Weekly";
    is_active: boolean;
}

export type InputValue = string | number;

const ZONES = ['A', 'B', 'C1', 'C2', 'D1', 'D2', 'E', 'F'] as const;
type ZoneCode = typeof ZONES[number];
export interface Slab {
  id: number;
  slab_type: string;
  zone_code: ZoneCode;
  rate: string | number;
}

export interface RateRowProps {
    label: string;
    slabType: string;
    rates: Record<string, number | undefined>; 
    rateCardId: number;
    isHighlight?: boolean;
    gst: boolean;
}

export interface EditableRateCellProps {
    initialValue: number; 
    rateCardId: number;
    zoneCode: ZoneCode;
    slabType: string;
    gstEnabled: boolean;
}

export interface RateSlab {
  slab_type: string;
  zone_code: string;
  rate: string | number;
}

export interface RawClient {
  id: number;
  company_name?: string;
  name?: string;
}

export interface FormattedClient {
  id: number;
  company_name: string;
}