import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const sanitized = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });

  return (
    <div className="prose prose-lg max-w-none mb-12">
      {parse(sanitized)}
    </div>
  );
}
