import { useWallet } from '@/modules/wallet/wallet.hook';
import { ContactForm } from '@/pages/contacts/Components/ContactForm';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useEffect } from 'react';

const AddContact = ({ contactId }: { contactId: string }) => {
  const { handleSetAsideExpanded, setAsideTitle } = useLayout();
  const { getContact } = useWallet();

  useEffect(() => {
    setAsideTitle(contactId ? 'Edit Contact' : 'New Contact');
  }, []);

  return (
    <>
      <ContactForm
        onClose={() => handleSetAsideExpanded(false)}
        onDone={() => handleSetAsideExpanded(false)}
        input={getContact(contactId)}
      />
    </>
  );
};

export default AddContact;
