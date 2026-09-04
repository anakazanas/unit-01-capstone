import "./ConfirmModal.css"

type ConfirmModalProps = {
  message: string;
  subMessage?: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({ message, subMessage, confirmLabel, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p className="modal-message">{message}</p>
        {subMessage && <p className="modal-submessage">{subMessage}</p>}
        <button className="btn-primary" onClick={onConfirm}>{confirmLabel}</button>
        <button className="btn-outline" onClick={onCancel}>Nevermind</button>
      </div>
    </div>
  );
}

export default ConfirmModal;