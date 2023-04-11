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
import { colorVariant, IconContainer, sizeVariant } from './styles';
import { TrailingIcon } from './TrailingIcon';
import { Twitter } from './Twitter';
import { UsbFlashDrive } from './UsbFlashDrive';

import React, { SVGProps } from 'react';

export interface IIconProps {
  size?: keyof typeof sizeVariant;
  color?: keyof typeof colorVariant;
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
    <IconContainer size={size} color={color}>
      <Component {...props} height={undefined} width={undefined} />
    </IconContainer>
  );
  WrappedIcon.displayName = Component.displayName;
  return WrappedIcon;
};

export const AccountIcon = IconWrapper(Account);
export const AlertBoxIcon = IconWrapper(AlertBox);
export const AlertBoxOutlineIcon = IconWrapper(AlertBoxOutline);
export const AlertCircleOutlineIcon = IconWrapper(AlertCircleOutline);
export const ApplicationIcon = IconWrapper(Application);
export const ApplicationBracketsIcon = IconWrapper(ApplicationBrackets);
export const ApplicationCogOutlineIcon = IconWrapper(ApplicationCogOutline);
export const BackburgerIcon = IconWrapper(Backburger);
export const BadgeAccountIcon = IconWrapper(BadgeAccount);
export const BellIcon = IconWrapper(Bell);
export const BellRingIcon = IconWrapper(BellRing);
export const CarBrakeParkingIcon = IconWrapper(CarBrakeParking);
export const CheckIcon = IconWrapper(Check);
export const CheckboxBlankOutlineIcon = IconWrapper(CheckboxBlankOutline);
export const CheckboxIntermediateVariantIcon = IconWrapper(
  CheckboxIntermediateVariant,
);
export const CheckboxMarkedIcon = IconWrapper(CheckboxMarked);
export const CheckDecagramIcon = IconWrapper(CheckDecagram);
export const CheckDecagramOutlineIcon = IconWrapper(CheckDecagramOutline);
export const ChevronDownIcon = IconWrapper(ChevronDown);
export const ChevronUpIcon = IconWrapper(ChevronUp);
export const CloseIcon = IconWrapper(Close);
export const ContentCopyIcon = IconWrapper(ContentCopy);
export const DialpadIcon = IconWrapper(Dialpad);
export const EarthIcon = IconWrapper(Earth);
export const EmailOutlineIcon = IconWrapper(EmailOutline);
export const ExitToAppIcon = IconWrapper(ExitToApp);
export const EyeIcon = IconWrapper(Eye);
export const EyeOffOutlineIcon = IconWrapper(EyeOffOutline);
export const EyeOutlineIcon = IconWrapper(EyeOutline);
export const FlagCheckeredIcon = IconWrapper(FlagCheckered);
export const FolderRemoveOutlineIcon = IconWrapper(FolderRemoveOutline);
export const FormTextboxPasswordIcon = IconWrapper(FormTextboxPassword);
export const GithubIcon = IconWrapper(Github);
export const HelpCircleIcon = IconWrapper(HelpCircle);
export const HistoryIcon = IconWrapper(History);
export const InformationIcon = IconWrapper(Information);
export const KeyIconFilledIcon = IconWrapper(KeyIconFilled);
export const KeyIconOutlinedIcon = IconWrapper(KeyIconOutlined);
export const KIconIcon = IconWrapper(KIcon);
export const LeadingIconIcon = IconWrapper(LeadingIcon);
export const LinkIcon = IconWrapper(Link);
export const LinkedinIcon = IconWrapper(Linkedin);
export const LoadingIcon = IconWrapper(Loading);
export const MagnifyIcon = IconWrapper(Magnify);
export const MapMarkerIcon = IconWrapper(MapMarker);
export const MenuOpenIcon = IconWrapper(MenuOpen);
export const PlusIcon = IconWrapper(Plus);
export const ProgressWrenchIcon = IconWrapper(ProgressWrench);
export const QrcodeScanIcon = IconWrapper(QrcodeScan);
export const RadioboxBlankIcon = IconWrapper(RadioboxBlank);
export const RadioboxMarkedIcon = IconWrapper(RadioboxMarked);
export const RefreshIcon = IconWrapper(Refresh);
export const ScriptTextKeyIcon = IconWrapper(ScriptTextKey);
export const ScriptTextKeyNewIcon = IconWrapper(ScriptTextKeyNew);
export const ShieldAccountVariantOutlineIcon = IconWrapper(
  ShieldAccountVariantOutline,
);
export const SignatureFreehandIcon = IconWrapper(SignatureFreehand);
export const SlashForwardIcon = IconWrapper(SlashForward);
export const StopCircleIcon = IconWrapper(StopCircle);
export const TrailingIconIcon = IconWrapper(TrailingIcon);
export const TwitterIcon = IconWrapper(Twitter);
export const UsbFlashDriveIcon = IconWrapper(UsbFlashDrive);
