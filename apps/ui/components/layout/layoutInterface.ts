export interface ProviderItem {
  key: string;
  label: string;
  icon: React.ElementType;
}

export interface Provider {
  name: string;
  basePath: string;
  items: ProviderItem[];
}

export interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isOpen: boolean;
  active: boolean;
}

const PROVIDER_CONFIG: Provider[] = [];
export interface ProviderDropdownProps {
  provider: typeof PROVIDER_CONFIG[0];
  isOpen: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  pathname: string;
}