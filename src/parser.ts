import { parse as parseMarkdown } from "@textlint/markdown-to-ast";
import { parse as parseText } from "@textlint/text-to-ast";
import { ASTNodeTypes, TxtNode, TxtParentNode } from "@textlint/ast-node-types";
import { traverse, VisitorOption } from "@textlint/ast-traverse";
import { splitAST, TxtParentNodeWithSentenceNode } from "sentence-splitter";
import * as path from "path";
import type { SpeechNode, SpeechRange } from "./types";

const MD_EXTS = new Set([".md", ".markdown", ".mdx", ".mdown", ".mkd"]);

interface TxtTextNode extends TxtNode {
  value: string;
}

function isTxtTextNode(node: TxtNode): node is TxtTextNode {
  return "value" in node && typeof (node as TxtTextNode).value === "string";
}

function isTxtParentNode(node: TxtNode): node is TxtParentNode {
  return "children" in node && Array.isArray((node as TxtParentNode).children);
}

function getPlainText(node: TxtNode): string {
  if (isTxtTextNode(node)) return node.value;
  if (isTxtParentNode(node)) {
    return node.children.map(getPlainText).join("");
  }
  return node.raw || "";
}

function overlaps(
  range: readonly [number, number],
  startIdx: number,
  endIdx: number
): boolean {
  return range[1] > startIdx && range[0] < endIdx;
}

export function parseDocument(
  text: string,
  filePath: string,
  range?: SpeechRange
): SpeechNode[] {
  const ext = path.extname(filePath).toLowerCase();
  const ast = MD_EXTS.has(ext) ? parseMarkdown(text) : parseText(text);

  const startIdx = range?.startOffset ?? 0;
  const endIdx = range?.endOffset ?? Infinity;

  const nodes: SpeechNode[] = [];

  traverse(ast as TxtParentNode, {
    enter(node: TxtNode) {
      const isBlock =
        node.type === ASTNodeTypes.Paragraph ||
        node.type === ASTNodeTypes.Header ||
        node.type === "TableCell";

      if (!isBlock) return;

      let sentenceParent: TxtParentNodeWithSentenceNode;
      try {
        sentenceParent = splitAST(node as unknown as Parameters<typeof splitAST>[0]);
      } catch {
        const plainText = getPlainText(node).trim();
        if (plainText && overlaps(node.range, startIdx, endIdx)) {
          nodes.push({
            text: plainText,
            range: [node.range[0], node.range[1]],
          });
        }
        return VisitorOption.Skip;
      }

      for (const child of sentenceParent.children) {
        if (child.type !== "Sentence") continue;
        if (!overlaps(child.range, startIdx, endIdx)) continue;

        const plainText = getPlainText(child as unknown as TxtNode).trim();
        if (plainText) {
          nodes.push({
            text: plainText,
            range: [child.range[0], child.range[1]],
          });
        }
      }

      return VisitorOption.Skip;
    },
  });

  return nodes;
}
