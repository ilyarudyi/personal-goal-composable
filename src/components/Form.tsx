/* eslint-disable @typescript-eslint/no-explicit-any */
import { useConfigurator } from "@threekit/configurator";
import React from "react";

type Props = {
  assetId: string;
  assetKey: string;
};

type FormItem = {
  name: string;
  value: any;
  values: any;
  onChange: (e: any, attrName: string, value: string) => void;
};

export default function Form({ assetId, assetKey }: Props) {
  const product = useConfigurator({
    assetId: assetId,
    key: assetKey,
  });

  if (!product) return null;

  console.log("🚀 ~ Form ~ product:", product);
  function handleChange(e: any, attrName: string, value: any) {
    e.preventDefault();
    product?.setConfiguration({
      [attrName]: value,
    });
  }

  return (
    <div className="flex flex-row w-4/12 h-full p-4 bg-slate-400">
      {product.attributes?.map(({ id, name, value, values }: any) => {
        if (!name.includes("Custom")) {
          return (
            <div key={id} className="flex">
              <FormItem
                name={name}
                value={value}
                values={values}
                onChange={handleChange}
              />
            </div>
          );
        }
      })}
    </div>
  );
}

export function FormItem(props: FormItem) {
  const selectedValue = props.values.find((value) => value.selected === true);

  return (
    <div>
      <h2 className="text-h-2">{props?.name}</h2>
      <>{props.value.name}</>
      <>selected: {selectedValue?.name}</>
      {props.values.length > 0 ? (
        <>
          {props.values.map((value: any) => {
            return (
              <div key={value.assetId}>
                <button
                  className="p-2 bg-slate-800 text-white"
                  onClick={(e) => props.onChange(e, props.name, value)}
                >
                  {value.name}
                </button>
                <p>isSelected:{value.selected}</p>
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
}
