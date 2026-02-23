'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import {
    Bold, Italic, Underline, Strikethrough,
    Heading1, Heading2, List, ListOrdered,
    Link as LinkIcon, Quote, Code, Minus,
    AlignLeft, AlignCenter, AlignRight,
    Image, Undo, Redo, Type, FileCode,
    Unlink,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: string;
}

type ToolbarItem = {
    type: 'button';
    icon: React.ElementType;
    command: string;
    value?: string;
    label: string;
    active?: string;
} | {
    type: 'separator';
};

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Write your email content here...',
    minHeight = '300px',
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showSource, setShowSource] = useState(false);
    const [sourceCode, setSourceCode] = useState('');
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const savedSelectionRef = useRef<Range | null>(null);
    const isInitializedRef = useRef(false);

    // Sync value to editor on initial load only
    useEffect(() => {
        if (editorRef.current && !isInitializedRef.current) {
            editorRef.current.innerHTML = value || '';
            isInitializedRef.current = true;
        }
    }, [value]);

    // Track active formats on selection change
    const updateActiveFormats = useCallback(() => {
        const formats = new Set<string>();

        if (document.queryCommandState('bold')) formats.add('bold');
        if (document.queryCommandState('italic')) formats.add('italic');
        if (document.queryCommandState('underline')) formats.add('underline');
        if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough');
        if (document.queryCommandState('insertUnorderedList')) formats.add('insertUnorderedList');
        if (document.queryCommandState('insertOrderedList')) formats.add('insertOrderedList');

        // Check block format
        const block = document.queryCommandValue('formatBlock');
        if (block) formats.add(block.toLowerCase());

        // Check alignment
        if (document.queryCommandState('justifyCenter')) formats.add('justifyCenter');
        if (document.queryCommandState('justifyRight')) formats.add('justifyRight');
        if (document.queryCommandState('justifyLeft')) formats.add('justifyLeft');

        setActiveFormats(formats);
    }, []);

    useEffect(() => {
        document.addEventListener('selectionchange', updateActiveFormats);
        return () => document.removeEventListener('selectionchange', updateActiveFormats);
    }, [updateActiveFormats]);

    const exec = useCallback((command: string, value?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
        updateActiveFormats();

        // Emit change
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange, updateActiveFormats]);

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    const saveSelection = useCallback(() => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
        }
    }, []);

    const restoreSelection = useCallback(() => {
        const sel = window.getSelection();
        if (sel && savedSelectionRef.current) {
            sel.removeAllRanges();
            sel.addRange(savedSelectionRef.current);
        }
    }, []);

    const handleInsertLink = useCallback(() => {
        if (!linkUrl) return;
        restoreSelection();
        const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
        exec('createLink', url);
        setShowLinkInput(false);
        setLinkUrl('');
    }, [linkUrl, exec, restoreSelection]);

    const handleSourceToggle = useCallback(() => {
        if (showSource) {
            // Switching from source to visual
            if (editorRef.current) {
                editorRef.current.innerHTML = sourceCode;
                onChange(sourceCode);
            }
        } else {
            // Switching from visual to source
            setSourceCode(editorRef.current?.innerHTML || '');
        }
        setShowSource(!showSource);
    }, [showSource, sourceCode, onChange]);

    const isActive = (cmd: string): boolean => {
        if (cmd === 'formatBlock-h1') return activeFormats.has('h1');
        if (cmd === 'formatBlock-h2') return activeFormats.has('h2');
        if (cmd === 'formatBlock-blockquote') return activeFormats.has('blockquote');
        return activeFormats.has(cmd);
    };

    const toolbarGroups: ToolbarItem[][] = [
        [
            { type: 'button', icon: Undo, command: 'undo', label: 'Undo' },
            { type: 'button', icon: Redo, command: 'redo', label: 'Redo' },
        ],
        [
            { type: 'button', icon: Bold, command: 'bold', label: 'Bold' },
            { type: 'button', icon: Italic, command: 'italic', label: 'Italic' },
            { type: 'button', icon: Underline, command: 'underline', label: 'Underline' },
            { type: 'button', icon: Strikethrough, command: 'strikeThrough', label: 'Strikethrough' },
        ],
        [
            { type: 'button', icon: Heading1, command: 'formatBlock', value: 'h1', label: 'Heading 1', active: 'formatBlock-h1' },
            { type: 'button', icon: Heading2, command: 'formatBlock', value: 'h2', label: 'Heading 2', active: 'formatBlock-h2' },
            { type: 'button', icon: Type, command: 'formatBlock', value: 'p', label: 'Paragraph' },
        ],
        [
            { type: 'button', icon: List, command: 'insertUnorderedList', label: 'Bullet List' },
            { type: 'button', icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered List' },
            { type: 'button', icon: Quote, command: 'formatBlock', value: 'blockquote', label: 'Quote', active: 'formatBlock-blockquote' },
        ],
        [
            { type: 'button', icon: AlignLeft, command: 'justifyLeft', label: 'Align Left' },
            { type: 'button', icon: AlignCenter, command: 'justifyCenter', label: 'Align Center' },
            { type: 'button', icon: AlignRight, command: 'justifyRight', label: 'Align Right' },
        ],
        [
            { type: 'button', icon: Minus, command: 'insertHorizontalRule', label: 'Divider' },
        ],
    ];

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
                {toolbarGroups.map((group, gi) => (
                    <div key={gi} className="flex items-center">
                        {gi > 0 && <div className="w-px h-5 bg-gray-200 mx-1" />}
                        {group.map((item, ii) => {
                            if (item.type === 'separator') return <div key={ii} className="w-px h-5 bg-gray-200 mx-1" />;
                            const Icon = item.icon;
                            const activeKey = item.active || item.command;
                            const active = isActive(activeKey);
                            return (
                                <button
                                    key={ii}
                                    type="button"
                                    title={item.label}
                                    onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent losing selection
                                        if (item.command === 'formatBlock' && item.value) {
                                            exec(item.command, `<${item.value}>`);
                                        } else {
                                            exec(item.command, item.value);
                                        }
                                    }}
                                    className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${active
                                        ? 'bg-[#111457] text-white shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </button>
                            );
                        })}
                    </div>
                ))}

                {/* Link button */}
                <div className="w-px h-5 bg-gray-200 mx-1" />
                <button
                    type="button"
                    title="Insert Link"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                        setShowLinkInput(true);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all"
                >
                    <LinkIcon className="w-3.5 h-3.5" />
                </button>
                <button
                    type="button"
                    title="Remove Link"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        exec('unlink');
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all"
                >
                    <Unlink className="w-3.5 h-3.5" />
                </button>

                {/* Source toggle */}
                <div className="ml-auto">
                    <button
                        type="button"
                        title="Toggle HTML Source"
                        onClick={handleSourceToggle}
                        className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${showSource
                            ? 'bg-[#111457] text-white shadow-sm'
                            : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                            }`}
                    >
                        <FileCode className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Link Input Bar */}
            {showLinkInput && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-b border-blue-100">
                    <LinkIcon className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <input
                        type="url"
                        placeholder="https://example.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); handleInsertLink(); }
                            if (e.key === 'Escape') { setShowLinkInput(false); setLinkUrl(''); }
                        }}
                        autoFocus
                        className="flex-1 text-sm bg-white border border-blue-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={handleInsertLink}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                        Insert
                    </button>
                    <button
                        type="button"
                        onClick={() => { setShowLinkInput(false); setLinkUrl(''); }}
                        className="px-2 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Editor / Source */}
            {showSource ? (
                <textarea
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                    className="w-full px-4 py-3 font-mono text-sm text-gray-700 outline-none resize-none"
                    style={{ minHeight }}
                    placeholder="<h2>Your HTML here...</h2>"
                />
            ) : (
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onBlur={handleInput}
                    data-placeholder={placeholder}
                    className="rich-editor-content w-full px-5 py-4 outline-none text-sm text-gray-700 leading-relaxed overflow-y-auto overflow-x-auto break-words"
                    style={{ minHeight }}
                />
            )}

            {/* Editor Styles */}
            <style jsx global>{`
                .rich-editor-content:empty::before {
                    content: attr(data-placeholder);
                    color: #d1d5db;
                    pointer-events: none;
                }

                .rich-editor-content h1 {
                    font-size: 1.5em;
                    font-weight: 800;
                    color: #111;
                    margin: 0.5em 0 0.3em;
                    line-height: 1.3;
                }

                .rich-editor-content h2 {
                    font-size: 1.25em;
                    font-weight: 700;
                    color: #111;
                    margin: 0.5em 0 0.3em;
                    line-height: 1.3;
                }

                .rich-editor-content p {
                    margin: 0.4em 0;
                }

                .rich-editor-content ul,
                .rich-editor-content ol {
                    padding-left: 1.5em;
                    margin: 0.4em 0;
                }

                .rich-editor-content li {
                    margin: 0.2em 0;
                }

                .rich-editor-content blockquote {
                    border-left: 3px solid #e5e7eb;
                    padding: 0.5em 1em;
                    margin: 0.5em 0;
                    color: #6b7280;
                    background: #f9fafb;
                    border-radius: 0 0.5em 0.5em 0;
                }

                .rich-editor-content a {
                    color: #2563eb;
                    text-decoration: underline;
                }

                .rich-editor-content hr {
                    border: none;
                    border-top: 1px solid #e5e7eb;
                    margin: 1em 0;
                }

                .rich-editor-content code {
                    background: #f3f4f6;
                    padding: 0.15em 0.4em;
                    border-radius: 0.25em;
                    font-size: 0.9em;
                    font-family: ui-monospace, monospace;
                    color: #dc2626;
                }

                .rich-editor-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5em;
                    margin: 0.5em 0;
                }

                .rich-editor-content table {
                    width: 100%;
                    max-width: 100%;
                    margin: 0.5em 0;
                    border-collapse: collapse;
                    overflow-x: auto;
                    display: block;
                }

                .rich-editor-content th,
                .rich-editor-content td {
                    border: 1px solid #e5e7eb;
                    padding: 0.5em;
                }
            `}</style>
        </div>
    );
}
