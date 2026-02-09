'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';

// Dynamic import to avoid SSR issues and potential findDOMNode issues with strict mode
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill');
        // Simple wrapper to forward ref if needed, but mainly ensuring client-side
        return function ForwardRefQuill({ forwardedRef, ...props }: any) {
            return <RQ ref={forwardedRef} {...props} />;
        };
    },
    { ssr: false }
);

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
        }
    }), []);

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            style={{ height: '300px', marginBottom: '50px' }}
        />
    );
}
