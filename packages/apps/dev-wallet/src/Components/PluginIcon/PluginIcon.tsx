import {
  pluginIconClass,
  smallPluginIconClass,
} from '@/pages/plugins/style.css';
import { getInitials } from '@/utils/get-initials';

export const PluginIcon = ({
  name,
  size = 'md',
}: {
  name: string;
  size?: 'md' | 'sm';
}) => (
  <div
    x-testId={name}
    className={size === 'sm' ? smallPluginIconClass : pluginIconClass}
  >
    {getInitials(name).toUpperCase()}
  </div>
);
