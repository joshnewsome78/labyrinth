import React, { FC, TouchEventHandler, useEffect, useRef } from "react";
import { Engine, EngineOptions, Scene, SceneOptions } from "@babylonjs/core";

interface SceneComponentProps {
    antialias?: boolean | undefined;
    engineOptions?: EngineOptions;
    adaptToDeviceRatio?: boolean;
    sceneOptions?: SceneOptions;
    onRender: Function;
    onSceneReady: Function;
    touchStart: TouchEventHandler<HTMLCanvasElement>;
    touchEnd: TouchEventHandler<HTMLCanvasElement>;
    touchMove: TouchEventHandler<HTMLCanvasElement>;
    id:string;
}

const SceneComponent: FC<SceneComponentProps & React.HTMLAttributes<string>> = ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, id, touchStart, touchEnd, touchMove, ...rest}) => {
  const reactCanvas = useRef(null);

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new Scene(engine, sceneOptions);
    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

  return <canvas ref={reactCanvas} id={id} onTouchStart={touchStart} onTouchEnd={touchEnd} onTouchMove={touchMove} />;
};

export default SceneComponent;