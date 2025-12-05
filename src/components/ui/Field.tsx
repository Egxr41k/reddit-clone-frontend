import { forwardRef, InputHTMLAttributes } from 'react';

interface IField extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  error?: string;
}

const Field = forwardRef<HTMLInputElement, IField>(
  ({ placeholder, error, className, type = 'text', style, ...rest }, ref) => {
    return (
      <div className={['mb-4', className].join(' ')} style={style}>
        <label>
          <span className="mb-1 block">{placeholder}</span>
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            {...rest}
            className={[
              'w-full rounded-lg border border-solid border-gray-300 px-4 py-2 transition-all outline-none placeholder:text-gray-300 focus:border-teal-400',
              !!error && 'border-red-500',
            ].join(' ')}
          />
        </label>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Field.displayName = 'Field';

export default Field;
