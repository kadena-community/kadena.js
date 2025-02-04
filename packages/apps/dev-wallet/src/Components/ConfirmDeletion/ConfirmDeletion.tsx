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
  deleteText = 'Delete',
  cancelText = 'Cancel',
}: {
  onDelete: () => void;
  onCancel: () => void;
  title: React.ReactNode;
  description: React.ReactNode;
  deleteText?: string;
  cancelText?: string;
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
      {cancelText && (
        <Button variant="transparent" onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      {deleteText && (
        <Button onClick={onDelete} variant="negative">
          {deleteText}
        </Button>
      )}
    </DialogFooter>
  </Dialog>
);
