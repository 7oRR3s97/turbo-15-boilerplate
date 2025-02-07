"use client";

import type NextError from "next/error";
import { useEffect } from "react";
import { captureException } from "@sentry/nextjs";

import { Button } from "@packages/ui/base/ui/button";

interface GlobalErrorProperties {
  readonly error: NextError & { digest?: string };
  readonly reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProperties) => {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html lang="pt-br">
      <body>
        <h1>Algo deu errado</h1>
        <Button onClick={() => reset()}>Tentar novamente</Button>
      </body>
    </html>
  );
};

export default GlobalError;
