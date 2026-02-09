import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Compatibility check for React 19 which removed findDOMNode
if (typeof window !== 'undefined') {
    const ReactDOM = require('react-dom');
    if (!ReactDOM.findDOMNode) {
        ReactDOM.findDOMNode = (component: any) => {
            return component instanceof HTMLElement ? component : (component && component.current) || null;
        };
    }
}

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

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
