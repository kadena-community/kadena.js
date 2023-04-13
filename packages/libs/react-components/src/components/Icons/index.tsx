/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201
import { config } from '../../styles';

import { Account } from './Account';
import { AlertBox } from './AlertBox';
import { AlertBoxOutline } from './AlertBoxOutline';
import { AlertCircleOutline } from './AlertCircleOutline';
import { Application } from './Application';
import { ApplicationBrackets } from './ApplicationBrackets';
import { ApplicationCogOutline } from './ApplicationCogOutline';
import { Backburger } from './Backburger';
import { BadgeAccount } from './BadgeAccount';
import { Bell } from './Bell';
import { BellRing } from './BellRing';
import { CarBrakeParking } from './CarBrakeParking';
import { Check } from './Check';
import { CheckboxBlankOutline } from './CheckboxBlankOutline';
import { CheckboxIntermediateVariant } from './CheckboxIntermediateVariant';
import { CheckboxMarked } from './CheckboxMarked';
import { CheckDecagram } from './CheckDecagram';
import { CheckDecagramOutline } from './CheckDecagramOutline';
import { ChevronDown } from './ChevronDown';
import { ChevronUp } from './ChevronUp';
import { Close } from './Close';
import { ContentCopy } from './ContentCopy';
import { Dialpad } from './Dialpad';
import { Earth } from './Earth';
import { EmailOutline } from './EmailOutline';
import { ExitToApp } from './ExitToApp';
import { Eye } from './Eye';
import { EyeOffOutline } from './EyeOffOutline';
import { EyeOutline } from './EyeOutline';
import { FlagCheckered } from './FlagCheckered';
import { FolderRemoveOutline } from './FolderRemoveOutline';
import { FormTextboxPassword } from './FormTextboxPassword';
import { Github } from './Github';
import { HelpCircle } from './HelpCircle';
import { History } from './History';
import { Information } from './Information';
import { KeyIconFilled } from './KeyIconFilled';
import { KeyIconOutlined } from './KeyIconOutlined';
import { KIcon } from './KIcon';
import { LeadingIcon } from './LeadingIcon';
import { Link } from './Link';
import { Linkedin } from './Linkedin';
import { Loading } from './Loading';
import { Magnify } from './Magnify';
import { MapMarker } from './MapMarker';
import { MenuOpen } from './MenuOpen';
import { Plus } from './Plus';
import { ProgressWrench } from './ProgressWrench';
import { QrcodeScan } from './QrcodeScan';
import { RadioboxBlank } from './RadioboxBlank';
import { RadioboxMarked } from './RadioboxMarked';
import { Refresh } from './Refresh';
import { ScriptTextKey } from './ScriptTextKey';
import { ScriptTextKeyNew } from './ScriptTextKeyNew';
import { ShieldAccountVariantOutline } from './ShieldAccountVariantOutline';
import { SignatureFreehand } from './SignatureFreehand';
import { SlashForward } from './SlashForward';
import { StopCircle } from './StopCircle';
import { IconContainer } from './styles';
import { TrailingIcon } from './TrailingIcon';
import { Twitter } from './Twitter';
import { UsbFlashDrive } from './UsbFlashDrive';

import type { PropertyValue, VariantProps } from '@stitches/react';
import React, { SVGProps } from 'react';

export interface IIconProps {
  size?: VariantProps<typeof IconContainer>['size'];
  color?: PropertyValue<'color', typeof config>;
}
const IconWrapper = (
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component: React.FC<SVGProps<SVGSVGElement>>,
): React.FC<SVGProps<SVGSVGElement> & IIconProps> => {
  const WrappedIcon: React.FC<SVGProps<SVGSVGElement> & IIconProps> = ({
    size = 'md',
    color,
    ...props
  }) => (
    <IconContainer size={size} css={{ color }}>
      <Component {...props} height={undefined} width={undefined} />
    </IconContainer>
  );
  WrappedIcon.displayName = Component.displayName;
  return WrappedIcon;
};

export const SystemIcons = {
  Account: IconWrapper(Account),
  AlertBox: IconWrapper(AlertBox),
  AlertBoxOutline: IconWrapper(AlertBoxOutline),
  AlertCircleOutline: IconWrapper(AlertCircleOutline),
  Application: IconWrapper(Application),
  ApplicationBrackets: IconWrapper(ApplicationBrackets),
  ApplicationCogOutline: IconWrapper(ApplicationCogOutline),
  Backburger: IconWrapper(Backburger),
  BadgeAccount: IconWrapper(BadgeAccount),
  Bell: IconWrapper(Bell),
  BellRing: IconWrapper(BellRing),
  CarBrakeParking: IconWrapper(CarBrakeParking),
  Check: IconWrapper(Check),
  CheckboxBlankOutline: IconWrapper(CheckboxBlankOutline),
  CheckboxIntermediateVariant: IconWrapper(CheckboxIntermediateVariant),
  CheckboxMarked: IconWrapper(CheckboxMarked),
  CheckDecagram: IconWrapper(CheckDecagram),
  CheckDecagramOutline: IconWrapper(CheckDecagramOutline),
  ChevronDown: IconWrapper(ChevronDown),
  ChevronUp: IconWrapper(ChevronUp),
  Close: IconWrapper(Close),
  ContentCopy: IconWrapper(ContentCopy),
  Dialpad: IconWrapper(Dialpad),
  Earth: IconWrapper(Earth),
  EmailOutline: IconWrapper(EmailOutline),
  ExitToApp: IconWrapper(ExitToApp),
  Eye: IconWrapper(Eye),
  EyeOffOutline: IconWrapper(EyeOffOutline),
  EyeOutline: IconWrapper(EyeOutline),
  FlagCheckered: IconWrapper(FlagCheckered),
  FolderRemoveOutline: IconWrapper(FolderRemoveOutline),
  FormTextboxPassword: IconWrapper(FormTextboxPassword),
  Github: IconWrapper(Github),
  HelpCircle: IconWrapper(HelpCircle),
  History: IconWrapper(History),
  Information: IconWrapper(Information),
  KeyIconFilled: IconWrapper(KeyIconFilled),
  KeyIconOutlined: IconWrapper(KeyIconOutlined),
  KIcon: IconWrapper(KIcon),
  LeadingIcon: IconWrapper(LeadingIcon),
  Link: IconWrapper(Link),
  Linkedin: IconWrapper(Linkedin),
  Loading: IconWrapper(Loading),
  Magnify: IconWrapper(Magnify),
  MapMarker: IconWrapper(MapMarker),
  MenuOpen: IconWrapper(MenuOpen),
  Plus: IconWrapper(Plus),
  ProgressWrench: IconWrapper(ProgressWrench),
  QrcodeScan: IconWrapper(QrcodeScan),
  RadioboxBlank: IconWrapper(RadioboxBlank),
  RadioboxMarked: IconWrapper(RadioboxMarked),
  Refresh: IconWrapper(Refresh),
  ScriptTextKey: IconWrapper(ScriptTextKey),
  ScriptTextKeyNew: IconWrapper(ScriptTextKeyNew),
  ShieldAccountVariantOutline: IconWrapper(ShieldAccountVariantOutline),
  SignatureFreehand: IconWrapper(SignatureFreehand),
  SlashForward: IconWrapper(SlashForward),
  StopCircle: IconWrapper(StopCircle),
  TrailingIcon: IconWrapper(TrailingIcon),
  Twitter: IconWrapper(Twitter),
  UsbFlashDrive: IconWrapper(UsbFlashDrive),
} as const;
