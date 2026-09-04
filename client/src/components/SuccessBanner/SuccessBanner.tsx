import "./SuccessBanner.css";

type SuccessBannerProps = { message: string };

function SuccessBanner({ message }: SuccessBannerProps) {
  if (!message) return null;
  return <div className="success-banner">{message}</div>;
}

export default SuccessBanner;