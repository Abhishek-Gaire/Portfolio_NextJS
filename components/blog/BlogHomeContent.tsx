import { sanitizeContent } from "../../lib/sanitize";
import parse, { domToReact, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import type React from "react";

interface BlogContentProps {
  content: string;
}

export default function BlogHomeContent({ content }: BlogContentProps) {
  const sanitized = sanitizeContent(content);
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (
        "type" in domNode &&
        domNode.type === "tag" &&
        "name" in domNode &&
        ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"].includes(domNode.name)
      ) {
        const children =
          "children" in domNode ? (domNode.children as DOMNode[]) : [];
        const Tag = domNode.name as keyof React.JSX.IntrinsicElements;
        return (
          <Tag {...("attribs" in domNode ? domNode.attribs : {})}>
            {domToReact(children, options)}
            {"..."}
          </Tag>
        );
      }
      return undefined;
    },
  };

  return (
    <div className="prose prose-lg max-w-none mb-6">
      {parse(sanitized, options)}
    </div>
  );
}
