"use client";
import { AssetProps, useScene } from "@threekit/react-three-fiber";
import * as THREE from "three";
import { useThree, useFrame, Object3DProps } from "@react-three/fiber";
import { forwardRef, useEffect, useState } from "react";

type MySceneProps = AssetProps &
  Object3DProps & {
    camera?: THREE.PerspectiveCamera | null;
  };

function cloneCamera(camera: THREE.PerspectiveCamera | null) {
  if (!camera) return null;
  const worldPosition = new THREE.Vector3();
  const worldRotation = new THREE.Quaternion();
  camera.updateMatrixWorld(true);
  camera.matrixWorld.decompose(
    worldPosition,
    worldRotation,
    new THREE.Vector3()
  );
  const cameraClone = camera.clone();
  cameraClone.position.copy(worldPosition);
  cameraClone.rotation.setFromQuaternion(worldRotation);
  cameraClone.updateMatrixWorld(true);
  return cameraClone;
}

export default forwardRef(function MyScene(
  props: MySceneProps,
  ref: React.Ref<THREE.Object3D>
) {
  const { camera, assetId, configuration, ...r3fProps } = props;
  const threekitAsset = useScene({ assetId, configuration });
  const r3f = useThree((r3f) => r3f);
  const { domeLight } = threekitAsset.scene.userData;
  const [defaultCamera, setDefaultCamera] =
    useState<THREE.PerspectiveCamera | null>(
      cloneCamera(threekitAsset.scene.userData.camera)
    );

  useEffect(() => {
    if (!camera) return;
    setDefaultCamera(cloneCamera(camera));
  }, [camera]);

  useEffect(() => {
    if (!r3f.scene || !domeLight?.image) return;
    const oldEnv = r3f.scene.environment;
    r3f.scene.environment = domeLight.image;
    return () => {
      // undo our environment change, assuming it hasn't been overridden
      if (r3f.scene.environment === domeLight.image) {
        r3f.scene.environment = oldEnv;
      }
    };
  }, [r3f, domeLight]);

  useEffect(() => {
    if (!defaultCamera) return;
    defaultCamera.aspect = r3f.viewport.aspect;
    defaultCamera.updateProjectionMatrix(); // only required initially. R3F only updates the aspect on canvas resize

    const oldCam = r3f.camera;
    if (r3f.camera === defaultCamera) return;
    r3f.set({ camera: defaultCamera });
    return () => {
      if (r3f.camera === oldCam) {
        // undo our camera change, assuming it hasn't been overridden
        r3f.set({ camera: oldCam });
      }
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCamera]);

  useFrame(() => {
    if (!domeLight?.image) return;
    const intensity = domeLight.intensity ?? 1;

    // unfortunately there's no global envMapFactor in three
    r3f.scene?.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        for (const mat of materials) {
          if ("envMap" in mat && "envMapFactor" in mat) {
            if (!mat.envMap) {
              // only assign the intensity if the material doesn't have an envMap override
              mat.envMapFactor = intensity;
            }
          }
        }
      }
    });
  });

  return (
    <>
      {threekitAsset ? (
        <primitive
          object={threekitAsset.scene}
          ref={ref}
          castShadow
          receiveShadow
          {...r3fProps}
        />
      ) : null}
    </>
  );
});
