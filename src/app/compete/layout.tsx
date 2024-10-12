'use client'
import React, { ReactNode } from 'react';
import Layout from '../navbar/layout';

interface LayoutProps {
    children: ReactNode;
}

const LayoutComponent: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Layout>
                {children}
            </Layout>
        </>
    );
};

export default LayoutComponent;
