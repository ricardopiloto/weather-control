/**
 * Thin wrapper around Foundry's ChatMessage API.
 * Mirrors the behavior of the original singleton `S`.
 */
export class ChatProxy {
  create(data) {
    return ChatMessage.create(data);
  }

  getWhisperRecipients(recipient) {
    return ChatMessage.getWhisperRecipients(recipient);
  }
}

// Shared chat proxy instance
export const chatProxy = new ChatProxy();

