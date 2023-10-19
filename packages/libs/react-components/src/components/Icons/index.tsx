/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201
import type { VariantProps } from '@stitches/react';
import type { SVGProps } from 'react';
import React from 'react';
import { IconContainer } from './styles';
import { Account } from './svgs/Account';
import { AlertBox } from './svgs/AlertBox';
import { AlertBoxOutline } from './svgs/AlertBoxOutline';
import { AlertCircleOutline } from './svgs/AlertCircleOutline';
import { Application } from './svgs/Application';
import { ApplicationBrackets } from './svgs/ApplicationBrackets';
import { ApplicationCogOutline } from './svgs/ApplicationCogOutline';
import { At } from './svgs/At';
import { Backburger } from './svgs/Backburger';
import { BadgeAccount } from './svgs/BadgeAccount';
import { Bell } from './svgs/Bell';
import { BellRing } from './svgs/BellRing';
import { CarBrakeParking } from './svgs/CarBrakeParking';
import { Check } from './svgs/Check';
import { CheckDecagram } from './svgs/CheckDecagram';
import { CheckDecagramOutline } from './svgs/CheckDecagramOutline';
import { CheckboxBlankOutline } from './svgs/CheckboxBlankOutline';
import { CheckboxIntermediateVariant } from './svgs/CheckboxIntermediateVariant';
import { CheckboxMarked } from './svgs/CheckboxMarked';
import { ChevronDown } from './svgs/ChevronDown';
import { ChevronUp } from './svgs/ChevronUp';
import { Close } from './svgs/Close';
import { Code } from './svgs/Code';
import { ContentCopy } from './svgs/ContentCopy';
import { Cookie } from './svgs/Cookie';
import { Dialpad } from './svgs/Dialpad';
import { Earth } from './svgs/Earth';
import { EmailOutline } from './svgs/EmailOutline';
import { ExitToApp } from './svgs/ExitToApp';
import { Eye } from './svgs/Eye';
import { EyeOffOutline } from './svgs/EyeOffOutline';
import { EyeOutline } from './svgs/EyeOutline';
import { FlagCheckered } from './svgs/FlagCheckered';
import { FolderRemoveOutline } from './svgs/FolderRemoveOutline';
import { FormTextboxPassword } from './svgs/FormTextboxPassword';
import { Github } from './svgs/Github';
import { HelpCircle } from './svgs/HelpCircle';
import { History } from './svgs/History';
import { Information } from './svgs/Information';
import { KIcon } from './svgs/KIcon';
import { KeyIconFilled } from './svgs/KeyIconFilled';
import { KeyIconOutlined } from './svgs/KeyIconOutlined';
import { LeadingIcon } from './svgs/LeadingIcon';
import { Link } from './svgs/Link';
import { Linkedin } from './svgs/Linkedin';
import { Loading } from './svgs/Loading';
import { Magnify } from './svgs/Magnify';
import { MapMarker } from './svgs/MapMarker';
import { MenuOpen } from './svgs/MenuOpen';
import { Plus } from './svgs/Plus';
import { ProgressWrench } from './svgs/ProgressWrench';
import { QrcodeScan } from './svgs/QrcodeScan';
import { RadioboxBlank } from './svgs/RadioboxBlank';
import { RadioboxMarked } from './svgs/RadioboxMarked';
import { Refresh } from './svgs/Refresh';
import { ScriptTextKey } from './svgs/ScriptTextKey';
import { ScriptTextKeyNew } from './svgs/ScriptTextKeyNew';
import { ShieldAccountVariantOutline } from './svgs/ShieldAccountVariantOutline';
import { SignatureFreehand } from './svgs/SignatureFreehand';
import { SlashForward } from './svgs/SlashForward';
import { StopCircle } from './svgs/StopCircle';
import { ThemeLightDark } from './svgs/ThemeLightDark';
import { TrailingIcon } from './svgs/TrailingIcon';
import { Twitter } from './svgs/Twitter';
import { UsbFlashDrive } from './svgs/UsbFlashDrive';

export interface IIconProps {
  size?: VariantProps<typeof IconContainer>['size'];
}

export type IconType = SVGProps<SVGSVGElement> & IIconProps;

const IconWrapper = (
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component: React.FC<SVGProps<SVGSVGElement>>,
): React.FC<IconType> => {
  const WrappedIcon: React.FC<SVGProps<SVGSVGElement> & IIconProps> = ({
    size = 'md',
    ...props
  }) => (
    <IconContainer size={size}>
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
  At: IconWrapper(At),
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
  Code: IconWrapper(Code),
  Cookie: IconWrapper(Cookie),
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
  ThemeLightDark: IconWrapper(ThemeLightDark),
  TrailingIcon: IconWrapper(TrailingIcon),
  Twitter: IconWrapper(Twitter),
  UsbFlashDrive: IconWrapper(UsbFlashDrive),
} as const;
