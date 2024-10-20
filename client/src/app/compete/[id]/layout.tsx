'use client'
import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const LayoutComponent: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
                {children}
        </>
    );
};

export default LayoutComponent;
