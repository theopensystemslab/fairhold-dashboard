interface HighlightProps extends React.PropsWithChildren {
  loading?: boolean;
}

const Highlight: React.FC<HighlightProps> = ({ children, loading }) => (
  loading ? (
    <span className="inline-block w-9 h-4 bg-gray-200 animate-pulse rounded" />
  ) : (
    <span className="text-[rgb(var(--fairhold-equity-color-rgb))] font-semibold">{children}</span>
  )
);

export default Highlight;