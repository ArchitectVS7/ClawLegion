/**
 * Component tests — MessageFeed, StatusBar, HelpPanel, VoiceButton
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MessageFeed } from "../components/MessageFeed";
import { StatusBar } from "../components/StatusBar";
import { HelpPanel } from "../components/HelpPanel";
import { VoiceButton } from "../components/VoiceButton";
import type { OVIMessage } from "../hooks/useOVI";

describe("MessageFeed", () => {
  it("shows empty state when no messages", () => {
    render(<MessageFeed messages={[]} />);
    expect(screen.getByText("OVI is ready.")).toBeInTheDocument();
    expect(screen.getByText("Hold the button and speak.")).toBeInTheDocument();
  });

  it("renders user and assistant messages", () => {
    const messages: OVIMessage[] = [
      { id: "1", role: "user", content: "Hello OVI", timestamp: new Date() },
      { id: "2", role: "assistant", content: "Hello VS7", timestamp: new Date() },
    ];

    render(<MessageFeed messages={messages} />);
    expect(screen.getByText("Hello OVI")).toBeInTheDocument();
    expect(screen.getByText("Hello VS7")).toBeInTheDocument();
  });

  it("shows interim transcript", () => {
    render(<MessageFeed messages={[]} interimTranscript="I am speaking..." />);
    expect(screen.getByText("I am speaking...")).toBeInTheDocument();
    expect(screen.getByText("listening…")).toBeInTheDocument();
  });

  it("applies correct CSS classes for roles", () => {
    const messages: OVIMessage[] = [
      { id: "1", role: "user", content: "User msg", timestamp: new Date() },
      { id: "2", role: "assistant", content: "Bot msg", timestamp: new Date() },
    ];

    const { container } = render(<MessageFeed messages={messages} />);
    const userMsg = container.querySelector(".message--user");
    const assistantMsg = container.querySelector(".message--assistant");
    expect(userMsg).toBeInTheDocument();
    expect(assistantMsg).toBeInTheDocument();
  });
});

describe("StatusBar", () => {
  it("shows Connected when gateway is connected", () => {
    render(
      <StatusBar status={{ connected: true, gateway: "connected", reconnecting: false }} />,
    );
    expect(screen.getByText("Connected")).toBeInTheDocument();
  });

  it("shows Offline when disconnected", () => {
    render(
      <StatusBar status={{ connected: false, gateway: "disconnected", reconnecting: false }} />,
    );
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("shows Reconnecting when reconnecting", () => {
    render(
      <StatusBar status={{ connected: false, gateway: "disconnected", reconnecting: true }} />,
    );
    expect(screen.getByText(/Reconnecting/)).toBeInTheDocument();
  });

  it("shows partial status when server up but gateway offline", () => {
    render(
      <StatusBar status={{ connected: true, gateway: "disconnected", reconnecting: false }} />,
    );
    expect(screen.getByText("Server up, gateway offline")).toBeInTheDocument();
  });

  it("applies correct CSS class for connected", () => {
    const { container } = render(
      <StatusBar status={{ connected: true, gateway: "connected", reconnecting: false }} />,
    );
    expect(container.querySelector(".status-dot--connected")).toBeInTheDocument();
  });

  it("applies correct CSS class for reconnecting", () => {
    const { container } = render(
      <StatusBar status={{ connected: false, gateway: "disconnected", reconnecting: true }} />,
    );
    expect(container.querySelector(".status-dot--reconnecting")).toBeInTheDocument();
  });
});

describe("HelpPanel", () => {
  it("renders help trigger button", () => {
    render(<HelpPanel />);
    expect(screen.getByLabelText("Help")).toBeInTheDocument();
  });

  it("opens help panel on click", () => {
    render(<HelpPanel />);
    fireEvent.click(screen.getByLabelText("Help"));
    expect(screen.getByText("What is this?")).toBeInTheDocument();
    expect(screen.getByText(/Orchestrated Voice Interface/)).toBeInTheDocument();
  });

  it("closes help panel on close button", () => {
    render(<HelpPanel />);
    fireEvent.click(screen.getByLabelText("Help"));
    expect(screen.getByText("What is this?")).toBeInTheDocument();

    fireEvent.click(screen.getByText("✕"));
    expect(screen.queryByText("What is this?")).not.toBeInTheDocument();
  });
});

describe("VoiceButton", () => {
  it("shows Hold to talk in idle state", () => {
    render(
      <VoiceButton
        onStart={vi.fn()}
        onStop={vi.fn()}
        isListening={false}
        isProcessing={false}
        isSpeaking={false}
      />,
    );
    expect(screen.getByText("Hold to talk")).toBeInTheDocument();
  });

  it("shows Listening when active", () => {
    render(
      <VoiceButton
        onStart={vi.fn()}
        onStop={vi.fn()}
        isListening={true}
        isProcessing={false}
        isSpeaking={false}
      />,
    );
    expect(screen.getByText("Listening...")).toBeInTheDocument();
  });

  it("shows Thinking when processing", () => {
    render(
      <VoiceButton
        onStart={vi.fn()}
        onStop={vi.fn()}
        isListening={false}
        isProcessing={true}
        isSpeaking={false}
      />,
    );
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("shows Speaking when TTS is active", () => {
    render(
      <VoiceButton
        onStart={vi.fn()}
        onStop={vi.fn()}
        isListening={false}
        isProcessing={false}
        isSpeaking={true}
      />,
    );
    expect(screen.getByText("Speaking...")).toBeInTheDocument();
  });

  it("does not call onStart when disabled", () => {
    const onStart = vi.fn();
    render(
      <VoiceButton
        onStart={onStart}
        onStop={vi.fn()}
        isListening={false}
        isProcessing={false}
        isSpeaking={false}
        disabled={true}
      />,
    );

    const button = screen.getByRole("button");
    fireEvent.mouseDown(button);
    // Even after the 150ms timer, onStart should not fire since button is disabled
    expect(onStart).not.toHaveBeenCalled();
  });

  it("does not call onStart when processing", () => {
    const onStart = vi.fn();
    render(
      <VoiceButton
        onStart={onStart}
        onStop={vi.fn()}
        isListening={false}
        isProcessing={true}
        isSpeaking={false}
      />,
    );

    const button = screen.getByRole("button");
    fireEvent.mouseDown(button);
    expect(onStart).not.toHaveBeenCalled();
  });

  it("shows STT mode hint", () => {
    render(
      <VoiceButton
        onStart={vi.fn()}
        onStop={vi.fn()}
        isListening={false}
        isProcessing={false}
        isSpeaking={false}
        mode="whisper"
      />,
    );
    expect(screen.getByText("Whisper")).toBeInTheDocument();
  });
});
