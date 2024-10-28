declare global {
    interface String {
        toTitleCase(): string;
    }
}

String.prototype.toTitleCase = function(): string {
    // Handle empty string
    if (!this.length) return '';

    // Split into words, including handling for multiple spaces
    return this
        .toLowerCase()
        .split(/\s+/)
        .map(word => {
            // Skip articles, conjunctions, and prepositions unless it's the first word
            const commonWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'];
            
            // Special case for hyphenated words
            if (word.includes('-')) {
                return word
                    .split('-')
                    .map((part, index) => 
                        index === 0 || !commonWords.includes(part) 
                            ? part.charAt(0).toUpperCase() + part.slice(1)
                            : part
                    )
                    .join('-');
            }
            
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

// Prevent the method from being enumerable
Object.defineProperty(String.prototype, 'toTitleCase', {
    enumerable: false
});

export {};