export function getHintPrompt(level: number) {
  if (level === 1) {
    return "Give a simple guiding question.";
  }

  if (level === 2) {
    return "Point toward the method or concept.";
  }

  return "Give a near-complete hint without revealing the final answer.";
}