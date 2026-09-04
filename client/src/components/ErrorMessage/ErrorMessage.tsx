type ErrorMessageProps = {
  message: string;
};

function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return <p style={{ color: "red" }}>{message}</p>;
}

export default ErrorMessage;