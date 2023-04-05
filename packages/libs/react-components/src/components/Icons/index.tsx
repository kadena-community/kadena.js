import Account from './Account';
import AlertBox from './AlertBox';
import AlertBoxOutline from './AlertBoxOutline';
import AlertCircleOutline from './AlertCircleOutline';
import Application from './Application';
import ApplicationBrackets from './ApplicationBrackets';
import ApplicationCogOutline from './ApplicationCogOutline';
import BadgeAccount from './BadgeAccount';
import Bell from './Bell';
import BellRing from './BellRing';
import CarBrakeParking from './CarBrakeParking';
import Check from './Check';
import CheckboxBlank from './CheckboxBlank';
import CheckboxIntermediate from './CheckboxIntermediate';
import CheckboxMarked from './CheckboxMarked';
import CheckDecagram from './CheckDecagram';
import CheckDecagramOutline from './CheckDecagramOutline';
import ChevronDown from './ChevronDown';
import ChevronUp from './ChevronUp';
import Close from './Close';
import Copy from './Copy';
import Dialpad from './Dialpad';
import Earth from './Earth';
import Email from './Email';
import ExitToApp from './ExitToApp';
import Eye from './Eye';
import EyeOff from './EyeOff';
import EyeOutline from './EyeOutline';
import FlagCheckered from './FlagCheckered';
import FolderRemove from './FolderRemove';
import FormTextboxPassword from './FormTextboxPassword';
import ForwardSlash from './ForwardSlash';
import Github from './Github';
import HelpCircle from './HelpCircle';
import History from './History';
import Information from './Information';
import KColon from './KColon';
import Key from './Key';
import KeyFilled from './KeyFilled';
import LeadingIcon from './LeadingIcon';
import Link from './Link';
import LinkedIn from './LinkedIn';
import Loading from './Loading';
import Magnify from './Magnify';
import MapMarker from './MapMarker';
import Plus from './Plus';
import ProgressWrench from './ProgressWrench';
import QRCode from './QRCode';
import RadioBoxBlank from './RadioBoxBlank';
import RadioboxMarked from './RadioboxMarked';
import Refresh from './Refresh';
import ScriptTextKey from './ScriptTextKey';
import ShieldAccount from './ShieldAccount';
import Signature from './Signature';
import StopCircle from './StopCircle';
import TrailingIcon from './TrailingIcon';
import Twitter from './Twitter';
import Usb from './Usb';

import React, { SVGProps } from 'react';

export type Icons =
  | 'bell'
  | 'dialpad'
  | 'eye'
  | 'github'
  | 'kcolon'
  | 'progress-wrench'
  | 'shield-account'
  | 'application-brackets'
  | 'close'
  | 'key'
  | 'information'
  | 'application'
  | 'bell-ring'
  | 'eye-outline'
  | 'car-brake-parking'
  | 'twitter'
  | 'copy'
  | 'key-filled'
  | 'loading'
  | 'earth'
  | 'signature'
  | 'eye-off'
  | 'folder-remove'
  | 'linkedin'
  | 'checkbox-blank'
  | 'alert-box'
  | 'radio-box-blank'
  | 'check'
  | 'plus'
  | 'usb'
  | 'stop-circle'
  | 'forward-slash'
  | 'checkbox-marked'
  | 'alert-box-outline'
  | 'radiobox-marked'
  | 'history'
  | 'check-decagram'
  | 'script-text-key'
  | 'qrcode'
  | 'checkbox-intermediate'
  | 'alert-circle-outline'
  | 'chevron-down'
  | 'form-textbox-password'
  | 'check-decagram-outline'
  | 'email'
  | 'help-circle'
  | 'leading-icon'
  | 'chevron-up'
  | 'exit-to-app'
  | 'link'
  | 'map-marker'
  | 'refresh'
  | 'badge-account'
  | 'trailing-icon'
  | 'application-cog-outline'
  | 'account'
  | 'magnify'
  | 'flag-checkered';

type IconProps = SVGProps<SVGSVGElement> & {
  icon: Icons;
};

export default function Icon({ icon, ...props }: IconProps) {
  switch (icon) {
    case 'dialpad':
      return <Dialpad {...props} />;
    case 'kcolon':
      return <KColon {...props} />;
    case 'shield-account':
      return <ShieldAccount {...props} />;
    case 'application-brackets':
      return <ApplicationBrackets {...props} />;
    case 'bell':
      return <Bell {...props} />;
    case 'eye':
      return <Eye {...props} />;
    case 'progress-wrench':
      return <ProgressWrench {...props} />;
    case 'github':
      return <Github {...props} />;
    case 'close':
      return <Close {...props} />;
    case 'key':
      return <Key {...props} />;
    case 'information':
      return <Information {...props} />;
    case 'application':
      return <Application {...props} />;
    case 'bell-ring':
      return <BellRing {...props} />;
    case 'eye-outline':
      return <EyeOutline {...props} />;
    case 'car-brake-parking':
      return <CarBrakeParking {...props} />;
    case 'twitter':
      return <Twitter {...props} />;
    case 'copy':
      return <Copy {...props} />;
    case 'key-filled':
      return <KeyFilled {...props} />;
    case 'loading':
      return <Loading {...props} />;
    case 'earth':
      return <Earth {...props} />;
    case 'signature':
      return <Signature {...props} />;
    case 'eye-off':
      return <EyeOff {...props} />;
    case 'folder-remove':
      return <FolderRemove {...props} />;
    case 'linkedin':
      return <LinkedIn {...props} />;
    case 'checkbox-blank':
      return <CheckboxBlank {...props} />;
    case 'alert-box':
      return <AlertBox {...props} />;
    case 'radio-box-blank':
      return <RadioBoxBlank {...props} />;
    case 'check':
      return <Check {...props} />;
    case 'plus':
      return <Plus {...props} />;
    case 'usb':
      return <Usb {...props} />;
    case 'stop-circle':
      return <StopCircle {...props} />;
    case 'forward-slash':
      return <ForwardSlash {...props} />;
    case 'checkbox-marked':
      return <CheckboxMarked {...props} />;
    case 'alert-box-outline':
      return <AlertBoxOutline {...props} />;
    case 'radiobox-marked':
      return <RadioboxMarked {...props} />;
    case 'history':
      return <History {...props} />;
    case 'check-decagram':
      return <CheckDecagram {...props} />;
    case 'script-text-key':
      return <ScriptTextKey {...props} />;
    case 'qrcode':
      return <QRCode {...props} />;
    case 'checkbox-intermediate':
      return <CheckboxIntermediate {...props} />;
    case 'alert-circle-outline':
      return <AlertCircleOutline {...props} />;
    case 'chevron-down':
      return <ChevronDown {...props} />;
    case 'form-textbox-password':
      return <FormTextboxPassword {...props} />;
    case 'check-decagram-outline':
      return <CheckDecagramOutline {...props} />;
    case 'email':
      return <Email {...props} />;
    case 'help-circle':
      return <HelpCircle {...props} />;
    case 'leading-icon':
      return <LeadingIcon {...props} />;
    case 'chevron-up':
      return <ChevronUp {...props} />;
    case 'exit-to-app':
      return <ExitToApp {...props} />;
    case 'link':
      return <Link {...props} />;
    case 'map-marker':
      return <MapMarker {...props} />;
    case 'refresh':
      return <Refresh {...props} />;
    case 'badge-account':
      return <BadgeAccount {...props} />;
    case 'trailing-icon':
      return <TrailingIcon {...props} />;
    case 'application-cog-outline':
      return <ApplicationCogOutline {...props} />;
    case 'account':
      return <Account {...props} />;
    case 'magnify':
      return <Magnify {...props} />;
    case 'flag-checkered':
      return <FlagCheckered {...props} />;
    default:
      return null;
  }
}
