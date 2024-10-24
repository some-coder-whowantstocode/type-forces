"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Page = styled.div`
  padding: 0;
  margin: 0;
`;

export default function Home() {
  const router = useRouter();
  const [isPC, setIsPC] = useState(true);

  useEffect(() => {
    const checkIfPC = () => {
      const userAgent = navigator.userAgent;
      console.log(userAgent)
      const mobileDevices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return !mobileDevices.test(userAgent)
    };

    if (!checkIfPC()) {
      setIsPC(false);
    } else {
      if (!router) return;
      router.replace("/compete");
    }
  }, [router]);

  return (
    <Page>
      {!isPC && <h1>This site is only accessible on a PC.</h1>}
    </Page>
  );
}
