"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSocket } from './context/SocketContext';

const Page = styled.div`
  padding: 0;
  margin: 0;
`;

export default function Home() {
  const {isPC} = useSocket();
  return (
    <Page>
      {!isPC && <h1>This site is only accessible on a PC.</h1>}
    </Page>
  );
}
