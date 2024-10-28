"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Page = styled.div`
  padding: 0;
  margin: 0;
`;

export default function Home() {
  const [isPC, setIsPC] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkIfPC = () => {
      const userAgent = navigator.userAgent;
      const mobileDevices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return !mobileDevices.test(userAgent)
    };

    if (!checkIfPC()) {
      setIsPC(false);
    } else {
      if (!router) return;
      router.replace("/practice");
    }
  }, [router]);

  return (
    <Page>
      {!isPC && <h1>This site is only accessible on a PC.</h1>}
    </Page>
  );
}
