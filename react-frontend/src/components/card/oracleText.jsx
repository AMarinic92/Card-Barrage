export default function OracleText({ text, size = 'md' }) {
  // Parse the oracle text and replace symbols
  const parseOracleText = (oracleString) => {
    if (!oracleString) return [];
    const parts = [];
    let lastIndex = 0;
    const symbolRegex = /\{[^}]+\}/g;
    let match;
    while ((match = symbolRegex.exec(oracleString)) !== null) {
      // Add text before the symbol
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: oracleString.substring(lastIndex, match.index),
        });
      }
      // Add the symbol
      const symbol = match[0].replace(/[{}]/g, '');
      parts.push({
        type: 'symbol',
        content: symbol,
      });
      lastIndex = match.index + match[0].length;
    }
    // Add remaining text
    if (lastIndex < oracleString.length) {
      parts.push({
        type: 'text',
        content: oracleString.substring(lastIndex),
      });
    }
    return parts;
  };
  // Get symbol display (emoji/unicode or text)
  const getSymbolDisplay = (symbol) => {
    const specialSymbols = {
      T: '⟳', // Tap symbol (using anticlockwise open circle arrow)
      Q: '⟲', // Untap symbol
      E: 'E', // Energy symbol (no good unicode)
      S: '❄', // Snow symbol
      CHAOS: '⚡', // Chaos symbol
      X: 'X',
      Y: 'Y',
      Z: 'Z',
    };
    return specialSymbols[symbol] || symbol;
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
      T: '#999999', // Tap symbol (grey)
      Q: '#999999', // Untap symbol (grey)
      E: '#999999', // Energy (grey)
      S: '#ADD8E6', // Snow (light blue)
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
  // Size classes for symbols
  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-base',
  };
  const parts = parseOracleText(text);
  return (
    <div className="whitespace-pre-line">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return part.content;
        } else {
          return (
            <span
              key={index}
              className={`${sizeClasses[size]} rounded-full inline-flex items-center justify-center font-bold border border-gray-700 align-middle`}
              style={{
                backgroundColor: getManaColor(part.content),
                color: getTextColor(part.content),
              }}
            >
              {getSymbolDisplay(part.content)}
            </span>
          );
        }
      })}
    </div>
  );
}
