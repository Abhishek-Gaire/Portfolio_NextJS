import sanitizeHtml from "sanitize-html";

export function sanitizeContent(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "blockquote",
      "ul", "ol", "li", "a", "h1", "h2", "h3", "h4",
      "code", "pre", "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["class"],
    },
    allowedSchemes: ["https", "http", "mailto"],
  });
}
