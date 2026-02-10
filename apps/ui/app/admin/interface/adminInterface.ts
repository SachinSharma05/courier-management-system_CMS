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

export interface StuckDetailProps {
  shipment: StuckShipment;
  onClose: () => void;
}

export type ShipmentAgeing = {
  fresh: number;
  aging_24_48: number;
  aging_48_plus: number;
};

export type DailyBookingTrend = {
  day: string;
  total: number;
};

export type ProviderShare = {
  provider: string;
  total: number;
};

export type StuckShipment = {
  awb: string;
  provider: string;
  current_status: string | null;
  last_status_at: string;
};

export type YesterdayBookings = {
  total: number;
};

export type DashboardSummary = {
  totalShipments: number;
  delivered: number;
  inTransit: number;
  rto: number;
  activeClients: number;
};

export type ProviderPerformance = {
  name: string;
  activeShipments: number;
  tat: number | null;
  rto: number;
  healthScore: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  performance: ProviderPerformance[];
  ageing: ShipmentAgeing;
  trends: DailyBookingTrend[];
  share: ProviderShare[];
  stuck: StuckShipment[];
  yesterday: YesterdayBookings;
};

export interface PermissionMatrix {
  permissionKey: string;
  canRead: boolean;
  canWrite: boolean;
  canFull: boolean;
}

export interface Role {
  id: string;
  name: string;
  permissions: PermissionMatrix[];
}

export type SystemStatus = 'healthy' | 'degraded' | 'down';

export interface SystemItem {
  name: string;
  status: SystemStatus;
  details?: string;
}

export interface TrackingEvent {
  status: string;
  eventAt: string;
  description?: string;
  remarks?: string;
  location: string;
}

export interface Consignment {
  awb: string;
  provider: string;
  status: string;
  movement: 'Critical' | 'Normal' | string;
  origin: string;
  destination: string;
  bookedAt: string;
}

export interface TrackingResult {
  consignment: Consignment;
  timeline: TrackingEvent[];
}

export type Provider = 'DTDC' | 'DELHIVERY';

export type ParsedRow = {
  code: string;
  awb: string;
  reference_number: string | null;
  origin_pincode: string | null;
  destination_pincode?: string | null;
  booked_at: Date | null;
};

export interface GroupedData {
  code: string;
  awbs: Omit<ParsedRow, 'code'>[];
}

export type BulkGroup = {
  code: string;
  awbs: {
    awb: string;
    reference_number: string | null;
    origin_pincode: string | null;
    destination_pincode: string | null;
    booked_at: string | null;
  }[];
};

export type UserRole = 'client' | 'super_admin' | 'public';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  company_name?: string | null;
  company_address?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  providers: string[];
  is_active: boolean;
  created_at: string;
}

export interface UserFilters {
  role: UserRole | 'all';
  status: 'Active' | 'Disabled' | 'all';
}

export type UserFormData = Omit<User, 'id' | 'created_at'>;

export interface Option<T> {
  label: string;
  value: T;
}

export interface SelectFilterProp<T> {
  icon: React.ReactNode;
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
}

export type UserOption = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  company_name?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  providers: string[];
  is_active: boolean;
  created_at: string;
};

export type CreateUserDto = {
  username: string;
  email: string;
  password_hash: string;
  role?: "client" | "super_admin" | "public";
  company_name?: string;
  company_address?: string;
  contact_person?: string;
  phone?: string;
  providers?: string[];
  is_active: boolean;
};

export type UpdateUserDto = {
  username?: string;
  email?: string;
  password_hash: string;
  role?: "client" | "super_admin" | "public";
  company_name?: string;
  company_address?: string;
  contact_person?: string;
  phone?: string;
  providers?: string[];
  is_active?: boolean;
};

export interface ApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ShipmentDetail {
  order_id: string | number;
  waybill: string;
  status: {
    status: string;
    status_date: string;
    status_location: string;
    instructions?: string;
  };
  origin: string;
  destination: string;
  consignee: {
    name: string;
    address: string;
    city: string;
  };
}

export interface CancellationResult {
  success: boolean;
  message: string;
  waybill?: string;
}

export interface FloatingInputProps<T extends string | number> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  type?: "text" | "number"; // Allow switching the input behavior
}

export interface RawCostResponse {
  zone: string;
  slab_type: string | number;
  breakdown: {
    base: number;
    total: number;
  };
}

export interface SimplifiedCost {
  zone: string;
  slab: string | number;
  base_charge: number;
  fsc: number;
  cod_charge: number;
  taxes: {
    cgst: number;
    sgst: number;
    igst: number;
  };
  total: number;
}

export interface ActionResult {
  success: boolean;
  message: string;
  awb?: string;
  upload_wbn?: string;
  destination_node: string;
  route: string;
}

export interface PincodeInfo {
  pincode: string | number;
  district: string;
  state: string;
  is_serviceable: boolean;
  city?: string;
  inc: string;
}