import { sanitizeContent } from "../../lib/sanitize";
import parse from "html-react-parser";

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const sanitized = sanitizeContent(content);

  return (
    <div className="prose prose-lg max-w-none mb-12">
      {parse(sanitized)}
    </div>
  );
}
