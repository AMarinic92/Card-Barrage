export default function ManaCostDisplay({ manaCost, size = 'md' }) {
  const parseMana = (costString) => {
    if (!costString) return [];

    const symbols = costString.match(/\{[^}]+\}/g) || [];
    const counts = {};

    symbols.forEach((symbol) => {
      const cleaned = symbol.replace(/[{}]/g, '');
      counts[cleaned] = isNaN(Number(cleaned))
        ? (counts[cleaned] || 0) + 1
        : Number(cleaned);
    });

    const ordered = [];
    const seen = new Set();

    symbols.forEach((symbol) => {
      const cleaned = symbol.replace(/[{}]/g, '');
      if (!seen.has(cleaned)) {
        ordered.push({ type: cleaned, count: counts[cleaned] });
        seen.add(cleaned);
      }
    });

    return ordered;
  };

  // Get color for each mana type
  const getManaColor = (type) => {
    const colors = {
      W: '#F0E68C', // White/Yellow
      U: '#0E68AB', // Blue
      B: '#150B00', // Black
      R: '#D3202A', // Red
      G: '#00733E', // Green
      C: '#BEB9B2', // Colorless
    };

    // Check if it's a number (generic mana)
    if (!isNaN(type)) {
      return '#CAC5C0'; // Grey for generic mana
    }

    return colors[type] || '#CAC5C0';
  };

  // Get text color based on background
  const getTextColor = (type) => {
    if (type === 'B' || type === 'U' || type === 'R' || type === 'G') {
      return '#FFFFFF';
    }
    return '#000000';
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  const manaSymbols = parseMana(manaCost);

  return (
    <div className="flex whitespace-pre-line gap-1.5 items-center">
      {manaSymbols.map(({ type, count }, index) => (
        <div
          key={`${type}-${index}`}
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-gray-700`}
          style={{
            backgroundColor: getManaColor(type),
            color: getTextColor(type),
          }}
        >
          {count}
        </div>
      ))}
    </div>
  );
}
