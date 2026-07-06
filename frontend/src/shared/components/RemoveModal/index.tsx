import { Hint, Message, StyledRemoveModal } from '../ModalStyles'

interface RemoveModalProps {
  confirmLoading?: boolean
  hint: string
  message: string
  open: boolean
  title: string
  onCancel: () => void
  onConfirm: () => void
}

export function RemoveModal({
  confirmLoading,
  hint,
  message,
  open,
  title,
  onCancel,
  onConfirm,
}: RemoveModalProps) {
  return (
    <StyledRemoveModal
      centered
      open={open}
      title={title}
      okText="Excluir"
      cancelText="Cancelar"
      confirmLoading={confirmLoading}
      okButtonProps={{ danger: true }}
      width={440}
      maskStyle={{
        backdropFilter: 'blur(2px)',
        background: 'rgb(0 0 0 / 45%)',
      }}
      onCancel={onCancel}
      onOk={onConfirm}
    >
      <Message>{message}</Message>
      <Hint>{hint}</Hint>
    </StyledRemoveModal>
  )
}
