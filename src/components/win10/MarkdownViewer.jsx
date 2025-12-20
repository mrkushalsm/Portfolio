"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownViewer = ({ content, isDark }) => {
    return (
        <div className="prose prose-sm max-w-4xl mx-auto prose-blue prose-img:rounded-md prose-headings:font-semibold prose-a:text-blue-600">
             <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                a: ({node, ...props}) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-[#0078d7] hover:underline" />
                ),
                h1: ({node, ...props}) => <h1 {...props} className="text-3xl border-b pb-2 mb-4 mt-2" />,
                h2: ({node, ...props}) => <h2 {...props} className="text-2xl font-semibold mt-6 mb-3" />,
                code: ({node, inline, className, children, ...props}) => {
                    return inline ? (
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-red-500" {...props}>
                            {children}
                        </code>
                    ) : (

                        <span className={`block p-4 rounded-md overflow-x-auto my-4 border ${props.isDark ? 'bg-[#1e1e1e] border-gray-700' : 'bg-[#f6f8fa] border-gray-200'}`}>
                            <code className={`text-sm font-mono ${props.isDark ? 'text-gray-300' : 'text-black'}`} {...props}>
                                {children}
                            </code>
                        </span>
                    );
                },
            }}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
