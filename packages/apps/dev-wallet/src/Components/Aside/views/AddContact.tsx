import { useWallet } from '@/modules/wallet/wallet.hook';
import { ContactForm } from '@/pages/contacts/Components/ContactForm';
import { useSideBar } from '@kadena/kode-ui/patterns';

const AddContact = ({ contactId }: { contactId: string }) => {
  const { handleSetAsideExpanded } = useSideBar();
  const { getContact } = useWallet();
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
