import { useEffect, useState } from "react";
import formatWalletAddress from "../utils/formatAddress";
import Button from "./Button";
import { useSignTypedData } from "wagmi";
import type { User } from "@prisma/client";
import { message, domain, types } from "../utils/typedData";

const storeSignature = async ({ data, user }: { data: string; user: User }) => {
  try {
    const r = (
      await (
        await fetch("/api/update/storeSignature", {
          body: JSON.stringify({ signature: data, userId: user?.id }),
          method: "POST",
          headers: { "Content-type": "application/json" },
        })
      ).json()
    ).data;
    return r;
  } catch (err) {
    throw err;
  }
};

export const SignMessage = ({
  user,
  refetchUser,
}: {
  user: User | undefined;
  refetchUser: () => void;
}) => {
  const { data, isError, isLoading, isSuccess, signTypedData } =
    useSignTypedData({
      domain,
      value: message,
      types,
    });

  useEffect(() => {
    if (data && user) {
      storeSignature({ data, user });
      refetchUser();
    }
  }, [data, user]);

  const [buttonLabel, setButtonLabel] = useState<string>(
    "Sign Message and Generate Identity"
  );
  useEffect(() => {
    if (isLoading) {
      setButtonLabel("Waiting for signature from Wallet...");
    }
    if (isError) {
      setButtonLabel("Error :( Refresh?");
    }
    if (isSuccess && data) {
      setButtonLabel(`Signed: ${formatWalletAddress(data)}`);
    }
  }, [isLoading, isError, isSuccess, data]);

  if (!user?.twitterId) {
    return (
      <Button
        title="Verify Twitter to Generate Identity"
        handleClick={() => {
          /** do nothing */
        }}
        hoverEffect={false}
        disabled={true}
      />
    );
  }

  if (user?.signature) {
    return (
      <Button
        title={`Signed: ${formatWalletAddress(user.signature)}`}
        handleClick={() => {
          /** do nothing */
        }}
        hoverEffect={false}
        disabled={true}
      />
    );
  }

  return (
    <Button
      title={buttonLabel}
      handleClick={() => signTypedData()}
      hoverEffect={false}
      className="w-full bg-slate-300 text-slate-800 hover:bg-slate-400"
    />
  );
};
