export interface Stats {
  donors: number;
  camps: number;
  appointments: number;
  organizations: number;
}

export interface LoadingState {
  donors: boolean;
  camps: boolean;
  appointments: boolean;
  organizations: boolean;
  charts: boolean;
}

export interface MonthlyData {
  month: string;
  count: number;
}

export interface DailyData {
  date: string;
  count: number;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: JSX.Element;
  loading: boolean;
  color: string;
}
