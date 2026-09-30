import { cn } from "@/lib/utils";

/**
 * Inline SVG architecture diagram for the LMS microservices project.
 *
 * Why an SVG component rather than an uploaded image: every other project card
 * is a screenshot, and a screenshot of a seven-service architecture is
 * unreadable at the 360px the card actually renders. This is a component, so
 * the labels are real text in the page, it is a few KB instead of a megabyte,
 * it is sharp at any DPI, and it recolours with the token layer rather than
 * going stale when a token changes.
 *
 * The services and datastores below are read out of
 * ~/Desktop/College/Major-Project, not invented. Seven services, not eight:
 * `src/backend` also contains `analytics-service`, but that is dead code --
 * nothing in the stack calls it and it has no database -- so it is deliberately
 * absent here.
 *
 * COLOUR. Every value is a literal hex or rgba, not a token reference. This is
 * the same constraint recorded on AnimatedBeam: SVG `fill` and `stroke`
 * *attributes* are not parsed for var(), so `stroke="var(--color-line)"`
 * renders nothing at all and fails silently. Each constant below names the
 * globals.css token it mirrors.
 *
 * No "use client": there is no state and no handler, so this renders on the
 * server and costs zero client JavaScript.
 */

const COLORS = {
  /** --color-line */
  stroke: "rgba(255, 255, 255, 0.12)",
  /** --color-line-hi */
  strokeHi: "rgba(255, 255, 255, 0.2)",
  /** --color-surface */
  surface: "rgba(255, 255, 255, 0.035)",
  /** --color-accent */
  accent: "#2dd4bf",
  /** --color-accent-line */
  accentLine: "rgba(45, 212, 191, 0.4)",
  /** --color-hi */
  hi: "#f2f3f3",
  /** --color-mid */
  mid: "#9a9ba0",
  /** --color-low */
  low: "#616267",
} as const;

const SERVICES = [
  { name: "Communication", detail: "WebRTC, chat, forums" },
  { name: "User", detail: "Auth, roles" },
  { name: "File", detail: "Upload, download" },
  { name: "AI/ML", detail: "Recommendations" },
  { name: "Course", detail: "Content, enrolment" },
  { name: "Assessment", detail: "Quizzes" },
  { name: "Email", detail: "Transactional" },
] as const;

/**
 * Bottom row: Redis and RabbitMQ sit under SERVICES in the source diagram,
 * the three stores under DATA. They are flattened into one row here because
 * two stacked rows force every connector to cross the layer above it, and a
 * crossing line is exactly the kind of detail that becomes a bug report.
 */
const DATASTORES = [
  { name: "Redis", detail: "Cache, sessions" },
  { name: "RabbitMQ", detail: "Message queue" },
  { name: "MongoDB", detail: "Documents" },
  { name: "PostgreSQL", detail: "Relational" },
  { name: "MinIO", detail: "Object storage" },
] as const;

/**
 * Which services reach which datastore. Drawn from the docker-compose services
 * and the per-service models rather than from the reference diagram, so the
 * lines mean something. A wrong edge here is a claim the page cannot support.
 */
const EDGES: Record<string, string[]> = {
  Redis: ["User", "Course", "Assessment", "Communication"],
  RabbitMQ: ["Assessment", "Email", "File"],
  MongoDB: ["Communication", "User", "File", "AI/ML"],
  PostgreSQL: ["Course", "Assessment", "AI/ML"],
  MinIO: ["File"],
};

/**
 * viewBox for the full diagram.
 *
 * The height is the content bottom plus a little breathing room, NOT a round
 * number. Measured: the last node ends at y=342, and a 420-tall viewBox left
 * 78px of dead space at the bottom, which read as a wrongly-sized box because
 * the empty band is as tall as the gateway.
 */
const FULL_VIEWBOX = "0 0 1200 566";
/**
 * Compact viewBox. Tighter and shorter, because the only thing that has to
 * survive at 360px is "one gateway, seven services, five stores" -- the detail
 * lines are dropped rather than shrunk into grey mush.
 */
/** Tight to content for the same reason: dead space is visible at 360px. */
const COMPACT_VIEWBOX = "0 0 640 300";

type LmsArchitectureProps = {
  variant?: "full" | "compact";
  className?: string;
  title?: string;
};

export function LmsArchitecture({
  variant = "full",
  className,
  title = "LMS microservices architecture",
}: LmsArchitectureProps) {
  return (
    <svg
      viewBox={variant === "full" ? FULL_VIEWBOX : COMPACT_VIEWBOX}
      role="img"
      aria-label={title}
      className={cn("h-auto w-full", className)}
      style={{ color: COLORS.hi }}
    >
      <title>{title}</title>
      {variant === "full" ? <FullDiagram /> : <CompactDiagram />}
    </svg>
  );
}

function FullDiagram() {
  // Column geometry. Seven services across 1200px with a 20px gutter.
  const gutter = 20;
  const colWidth = (1200 - gutter * (SERVICES.length - 1)) / SERVICES.length;
  const serviceX = (name: string) => {
    const i = SERVICES.findIndex((s) => s.name === name);
    return i * (colWidth + gutter);
  };
  const serviceCentre = (name: string) => serviceX(name) + colWidth / 2;

  /*
   * Vertical layout. Deliberately generous: this is the hero visual for the
   * case study, it renders around 370px tall at the shell width, and every
   * gap here is a chance for the layers to read as separate bands rather than
   * as one dense block.
   *
   * The four constants are the whole layout. Node heights come from the Node
   * component, so changing a height there and not here is what produces a
   * diagram whose rows overlap.
   */
  const clientX = 600;
  const gatewayY = 124;
  const serviceY = 232;
  const dataY = 484;

  const gatewayHeight = 52;
  const rowHeight = 58;
  const storeHeight = 52;

  const storeX = (name: string) => {
    const i = DATASTORES.findIndex((s) => s.name === name);
    return i * (colWidth + gutter);
  };
  const storeCentre = (name: string) => storeX(name) + colWidth / 2;

  return (
    <g>
      <text
        x={clientX}
        y={34}
        textAnchor="middle"
        fontSize={14}
        fill={COLORS.hi}
        fontWeight={600}
      >
        Client
      </text>
      <text x={clientX} y={56} textAnchor="middle" fontSize={12} fill={COLORS.low}>
        React + TypeScript
      </text>

      {/* client -> gateway */}
      <line
        x1={clientX}
        y1={64}
        x2={clientX}
        y2={gatewayY - 6}
        stroke={COLORS.accent}
        strokeWidth={1.5}
      />
      <path
        d={`M ${clientX} ${gatewayY - 6} l -4.5 7 l 9 0 z`}
        fill={COLORS.accent}
      />

      <Node
        x={clientX - 120}
        y={gatewayY}
        width={260}
        height={gatewayHeight}
        label="API Gateway"
        detail="NestJS · auth · routing"
        accent
        fontSize={13}
      />

      {/* gateway -> services */}
      {SERVICES.map((s) => (
        <line
          key={`gw-${s.name}`}
          x1={clientX}
          y1={gatewayY + gatewayHeight}
          x2={serviceCentre(s.name)}
          y2={serviceY - 6}
          stroke={COLORS.accentLine}
          strokeWidth={1}
        />
      ))}

      {SERVICES.map((s) => (
        <Node
          key={s.name}
          x={serviceX(s.name)}
          y={serviceY}
          width={colWidth}
          height={rowHeight}
          label={s.name}
          detail={s.detail}
          fontSize={12}
        />
      ))}

      {/*
        services -> datastores, routed orthogonally.

        The first attempt drew these as bezier curves and the middle band turned
        into a tangle: fourteen edges all bowing through the same 46px of
        vertical space overlap each other into visual mush, and the crossings
        make it impossible to follow one line from a service to a store.

        Right angles fix that. Each edge drops straight down to its own lane,
        runs horizontally, then drops into the store. The horizontal runs are
        staggered by LANE_STEP so two edges never occupy the same row, and the
        result reads as a bus rather than a knot.
      */}
      {(() => {
        const edges = DATASTORES.flatMap((store) =>
          EDGES[store.name].map((from) => ({ store: store.name, from })),
        );
        // Scaled with the taller layout: 34px of drop before the first lane and
        // a 10px pitch, so fourteen edges occupy 130px instead of crowding into
        // 46px. Same bus shape, enough separation to trace a line by eye.
        const laneTop = serviceY + rowHeight + 34;
        const laneStep = 10;
        return edges.map((edge, i) => {
          const lane = laneTop + i * laneStep;
          const sx = serviceCentre(edge.from);
          const tx = storeCentre(edge.store);
          return (
            <path
              key={`${edge.store}-${edge.from}`}
              d={`M ${sx} ${serviceY + rowHeight} L ${sx} ${lane} L ${tx} ${lane} L ${tx} ${dataY - 6}`}
              fill="none"
              stroke={COLORS.stroke}
              strokeWidth={1}
              strokeLinejoin="round"
            />
          );
        });
      })()}

      {DATASTORES.map((s) => (
        <Node
          key={s.name}
          x={storeX(s.name)}
          y={dataY}
          width={colWidth}
          height={storeHeight}
          label={s.name}
          detail={s.detail}
          data
          fontSize={12}
        />
      ))}
    </g>
  );
}

function CompactDiagram() {
  const gutter = 12;
  const colWidth = (640 - gutter * (SERVICES.length - 1)) / SERVICES.length;
  const centre = (i: number) => i * (colWidth + gutter) + colWidth / 2;
  const clientX = 320;
  const gatewayY = 78;
  const gatewayHeight = 40;
  const serviceY = 158;
  const rowHeight = 38;
  const ruleY = 232;
  const storeLabelY = 262;

  return (
    <g>
      <Node
        x={clientX - 140}
        y={gatewayY - gatewayHeight}
        width={280}
        height={gatewayHeight}
        label="API Gateway"
        accent
        fontSize={12}
      />
      {SERVICES.map((s, i) => (
        <line
          key={s.name}
          x1={clientX}
          y1={gatewayY}
          x2={centre(i)}
          y2={serviceY - 5}
          stroke={COLORS.accentLine}
          strokeWidth={1}
        />
      ))}
      {SERVICES.map((s, i) => (
        <Node
          key={s.name}
          x={i * (colWidth + gutter)}
          y={serviceY}
          width={colWidth}
          height={rowHeight}
          label={s.name}
          fontSize={11}
        />
      ))}
      {/*
        One store row, names only. Detail lines would be sub-pixel at 360px --
        the compact variant exists to say "one gateway, seven services, five
        stores" and nothing finer.
      */}
      <line
        x1={4}
        y1={ruleY}
        x2={636}
        y2={ruleY}
        stroke={COLORS.stroke}
        strokeWidth={1}
      />
      {DATASTORES.map((s, i) => (
        <text
          key={s.name}
          x={centre(i)}
          y={storeLabelY}
          textAnchor="middle"
          fontSize={11}
          fill={COLORS.mid}
        >
          {s.name}
        </text>
      ))}
    </g>
  );
}

type NodeProps = {
  x: number;
  y: number;
  width: number;
  height?: number;
  label: string;
  detail?: string;
  accent?: boolean;
  data?: boolean;
  fontSize?: number;
};

/**
 * A single labelled box.
 *
 * `data` boxes get a flatter border and no surface fill. They are drawn that
 * way in the source diagram as cylinders, but a cylinder at this size reads as
 * a smudge, so the distinction is carried by the border weight instead.
 */
function Node({
  x,
  y,
  width,
  height = 42,
  label,
  detail,
  accent = false,
  data = false,
  fontSize = 11,
}: NodeProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={data ? "transparent" : COLORS.surface}
        stroke={accent ? COLORS.accentLine : COLORS.stroke}
        strokeWidth={1}
      />
      <text
        x={x + width / 2}
        y={detail ? y + height / 2 - 3 : y + height / 2 + 4}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight={accent ? 600 : 500}
        fill={accent ? COLORS.accent : COLORS.hi}
      >
        {label}
      </text>
      {detail ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 11}
          textAnchor="middle"
          fontSize={fontSize - 2}
          fill={COLORS.low}
        >
          {detail}
        </text>
      ) : null}
    </g>
  );
}

export default LmsArchitecture;
