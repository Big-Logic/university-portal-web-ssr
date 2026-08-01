"use client";

import { useEffect, useState } from "react";
import S from "./TimeDateCards.style";

export function formatClock(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDate(date) {
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TimeDateCards() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <S.Row>
      <S.Card>
        <S.Label>Local time</S.Label>
        <S.ValueMono>{formatClock(now)}</S.ValueMono>
      </S.Card>
      <S.Card>
        <S.Label>Today</S.Label>
        <S.Value>{formatDate(now)}</S.Value>
      </S.Card>
    </S.Row>
  );
}
