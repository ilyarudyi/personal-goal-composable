// TODO make camera switch work

import { Fragment, ChangeEvent } from "react";
import * as THREE from "three";

type Props = {
  cameras: THREE.PerspectiveCamera[];
  handleCameraChange: (arg: ChangeEvent<HTMLSelectElement>) => void;
};

const CameraSwitch = ({ cameras, handleCameraChange }: Props) => {
  return (
    <div className="pt-3 bg-slate-500">
      <label htmlFor="options">Choose a camera:</label>
      <select id="options" onChange={(e) => handleCameraChange(e)}>
        {cameras.map((cam) => (
          <Fragment key={cam.name}>
            <option value={cam.name}>{cam.name}</option>
          </Fragment>
        ))}
      </select>
    </div>
  );
};

export default CameraSwitch;
