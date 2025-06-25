import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { ProfileForm } from './ProfileForm';

export const Profile: FC = () => {
  return (
    <SectionCard stack="vertical">
      <SectionCardContentBlock>
        <SectionCardHeader title="Profile" />
        <SectionCardBody>
          <ProfileForm />
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
