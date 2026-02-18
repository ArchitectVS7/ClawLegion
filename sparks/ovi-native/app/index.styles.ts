import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  messageFeed: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageFeedContent: {
    paddingVertical: 24,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyStateTitle: {
    fontSize: 24,
    color: "#8b5cf6",
    fontWeight: "700",
    letterSpacing: 4,
    marginBottom: 8,
  },
  emptyStateHint: {
    fontSize: 14,
    color: "#64748b",
  },
  message: {
    maxWidth: "82%",
    marginBottom: 16,
  },
  messageUser: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  messageAssistant: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: "#7c5cfc",
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: "#1a1a28",
    borderWidth: 1,
    borderColor: "rgba(124, 92, 252, 0.2)",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#e8e8f0",
  },
  timestamp: {
    fontSize: 11,
    color: "#44445a",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "rgba(124, 92, 252, 0.15)",
    backgroundColor: "#0a0a0a",
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(124, 92, 252, 0.15)",
    borderWidth: 2,
    borderColor: "#7c5cfc",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7c5cfc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  voiceButtonActive: {
    transform: [{ scale: 0.92 }],
    backgroundColor: "rgba(124, 92, 252, 0.3)",
    shadowOpacity: 0.5,
  },
  voiceButtonProcessing: {
    opacity: 0.6,
  },
  voiceButtonIcon: {
    fontSize: 32,
  },
  voiceButtonLabel: {
    marginTop: 12,
    fontSize: 14,
    color: "#8888a8",
    fontWeight: "500",
  },
});
