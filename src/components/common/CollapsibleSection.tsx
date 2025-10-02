import React, { PropsWithChildren, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  id?: string;
}

const CollapsibleSection: React.FC<PropsWithChildren<CollapsibleSectionProps>> = ({
  title,
  subtitle,
  defaultOpen = false,
  id,
  children
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      className="bg-white border border-gray-200 rounded-xl shadow-sm"
      aria-labelledby={id}
    >
      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        className="w-full flex items-center justify-between px-5 py-4"
        aria-expanded={isOpen}
      >
        <div className="text-left">
          <h2 id={id} className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="px-5 pb-5">
          {children}
        </div>
      )}
    </section>
  );
};

export default CollapsibleSection;
