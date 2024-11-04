import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@kadena/kode-ui';

export const ConfirmDeletion = ({
  onDelete,
  onCancel,
  title,
  description,
}: {
  onDelete: () => void;
  onCancel: () => void;
  title: React.ReactNode;
  description: React.ReactNode;
}) => (
  <Dialog
    isOpen
    size="sm"
    onOpenChange={(isOpen) => {
      if (!isOpen) onCancel();
    }}
  >
    <DialogHeader>{title}</DialogHeader>
    <DialogContent>{description}</DialogContent>
    <DialogFooter>
      <Button variant="transparent" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onDelete} variant="negative">
        Delete
      </Button>
    </DialogFooter>
  </Dialog>
);
