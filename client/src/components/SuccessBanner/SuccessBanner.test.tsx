import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SuccessBanner from "./SuccessBanner";

describe("SuccessBanner", () => {
  it("renders the message when provided", () => {
    render(<SuccessBanner message="Saved successfully!" />);
    expect(screen.getByText("Saved successfully!")).toBeInTheDocument();
  });

  it("renders nothing when message is empty", () => {
    const { container } = render(<SuccessBanner message="" />);
    expect(container).toBeEmptyDOMElement();
  });
});