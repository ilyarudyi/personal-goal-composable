"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Viewer, UnifiedResolver } from "@threekit/react-three-fiber";
import * as THREE from "three";

import { OrbitControls } from "@react-three/drei";

import MyScene from "./MyScene";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CameraSwitch from "./CameraSwitch";

const cameras: THREE.PerspectiveCamera[] = [];

type Props = {
  auth: ThreekitAuthProps;
  assetId: string;
  assetKey: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Player({ assetId, auth, assetKey }: Props) {
  const [scene, setScene] = useState<THREE.Object3D | null>(null);
  const [camTarget, setCamTarget] = useState<THREE.Object3D | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (scene) {
      scene.traverse((node) => {
        if (node.name === "CamTarget") {
          console.log("Found the target node:", node);
          setCamTarget(node);
        }
        // TODO make camera switch work
        if (node instanceof THREE.PerspectiveCamera) {
          if (cameras.includes(node)) return;
          console.log("found camera:", node);
          cameras.push(node);
        }
      });
    }
  }, [scene]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCameraChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const cam = cameras.find((cam) => cam.name === e.target.value);
    if (!cam) return;
    setCamera(cam);
  };

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <Viewer
          auth={auth}
          ui={true}
          resolver={UnifiedResolver({
            cacheScope: "v2",
            optimize: false,
          })}
        >
          {scene ? (
            camTarget ? (
              <OrbitControls target={camTarget.position} />
            ) : (
              <OrbitControls />
            )
          ) : null}
          <MyScene assetId={assetId} camera={camera} ref={setScene} />
        </Viewer>
      </div>
      {/* // TODO make camera switch work */}
      {/* <CameraSwitch cameras={cameras} handleCameraChange={handleCameraChange} /> */}
    </>
  );
}
