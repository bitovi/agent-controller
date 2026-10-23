/**
 * Safely wraps untrusted text (kubectl's own stdout -- pod logs, `describe`
 * output, etc.) in a Markdown fenced code block before it is delivered to a
 * chat UI.
 *
 * Cluster state is attacker/application-controlled text: a pod can log
 * anything, including a run of backticks. A naive fixed ``` fence lets a
 * ``` (or longer) run inside the content close the block early, so the rest
 * of the content renders as if it were the tool's own message rather than
 * quoted cluster output. This picks a fence strictly longer than the longest
 * backtick run actually present, which keeps the block tooltip even if the
 * content itself is adversarial, matching how fenced code blocks are safely
 * nested in Markdown/CommonMark.
 */
export function fenceCodeBlock(lang: string, content: string): string {
  const runs = content.match(/`+/g) ?? [];
  const longestRun = runs.reduce((max, run) => Math.max(max, run.length), 0);
  const tickCount = Math.max(3, longestRun + 1);
  const fence = "`".repeat(tickCount);
  return `${fence}${lang}\n${content}\n${fence}`;
}
