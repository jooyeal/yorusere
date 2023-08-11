import React from "react";
import Lottie from "lottie-react";
import Cockatoo from "./cockatoo.json";

type Props = {
  visible: boolean;
  isBlur?: boolean;
};

export default function LoadingScreen({ visible, isBlur }: Props) {
  return visible ? (
    <Lottie
      className={`fixed top-0 z-50 h-screen w-screen bg-white ${
        isBlur && "bg-opacity-50"
      }`}
      animationData={Cockatoo}
      loop={true}
    />
  ) : null;
}
