import { Account } from './account';
import { AlertBox } from './alertBox';
import { AlertBoxOutline } from './alertBoxOutline';
import { AlertCircleOutline } from './alertCircleOutline';
import { Application } from './application';
import { ApplicationBrackets } from './applicationBrackets';
import { ApplicationCogOutline } from './applicationCogOutline';
import { Backburger } from './backburger';
import { BadgeAccount } from './badgeAccount';
import { Bell } from './bell';
import { BellRing } from './bellRing';
import { CarBrakeParking } from './carBrakeParking';
import { Check } from './check';
import { CheckboxBlankOutline } from './checkboxBlankOutline';
import { CheckboxIntermediateVariant } from './checkboxIntermediateVariant';
import { CheckboxMarked } from './checkboxMarked';
import { CheckDecagram } from './checkDecagram';
import { CheckDecagramOutline } from './checkDecagramOutline';
import { ChevronDown } from './chevronDown';
import { ChevronUp } from './chevronUp';
import { Close } from './close';
import { ContentCopy } from './contentCopy';
import { Dialpad } from './dialpad';
import { Earth } from './earth';
import { EmailOutline } from './emailOutline';
import { ExitToApp } from './exitToApp';
import { Eye } from './eye';
import { EyeOffOutline } from './eyeOffOutline';
import { EyeOutline } from './eyeOutline';
import { FlagCheckered } from './flagCheckered';
import { FolderRemoveOutline } from './folderRemoveOutline';
import { FormTextboxPassword } from './formTextboxPassword';
import { Github } from './github';
import { HelpCircle } from './helpCircle';
import { History } from './history';
import { Information } from './information';
import { KeyIconFilled } from './keyIconFilled';
import { KeyIconOutlined } from './keyIconOutlined';
import { KIcon } from './kIcon';
import { LeadingIcon } from './leadingIcon';
import { Link } from './link';
import { Linkedin } from './linkedin';
import { Loading } from './loading';
import { Magnify } from './magnify';
import { MapMarker } from './mapMarker';
import { MenuOpen } from './menuOpen';
import { Plus } from './plus';
import { ProgressWrench } from './progressWrench';
import { QrcodeScan } from './qrcodeScan';
import { RadioboxBlank } from './radioboxBlank';
import { RadioboxMarked } from './radioboxMarked';
import { Refresh } from './refresh';
import { ScriptTextKey } from './scriptTextKey';
import { ScriptTextKeyNew } from './scriptTextKeyNew';
import { ShieldAccountVariantOutline } from './shieldAccountVariantOutline';
import { SignatureFreehand } from './signatureFreehand';
import { SlashForward } from './slashForward';
import { StopCircle } from './stopCircle';
import { IconContainer, sizeVariant } from './styles';
import { TrailingIcon } from './trailingIcon';
import { Twitter } from './twitter';
import { UsbFlashDrive } from './usbFlashDrive';

import React, { SVGProps } from 'react';

export interface IIconProps {
  size: keyof typeof sizeVariant;
}
const IconWrapper = (
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component: React.FC<SVGProps<SVGSVGElement>>,
): React.FC<SVGProps<SVGSVGElement> & IIconProps> => {
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
